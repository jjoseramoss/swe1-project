// requests persist
// Socket IO - create websockets
// websockets make connections to server
// good for small frequent requests

const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// roomCode -> roomData
// roomData: { scores: Map<userId, number>, userIds: Set<userId>, answers: Map<userId, string> , gameState: state}
const activeRooms = new Map();
const createRoomData = () => ({
  scores: new Map(),
  userIds: new Set(),
  userData: new Map(), // store per-user info { uid, displayName, avatarUrl} can add other info later
  answers: new Map(),
  question: new String(),
  gameState: new String(),
  //game states: start, question, answer, finished
});

const generateRoomCode = () => {
  let roomCode;
  do {
    roomCode = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
  } while (activeRooms.has(roomCode));
  return roomCode;
};
const logActiveRooms = (label) => {
  const snapshot = Array.from(activeRooms.entries()).map(([code, data]) => ({
    code,
    userIds: Array.from(data.userIds),
    scores: Array.from(data.scores.entries()),
    answers: Array.from(data.answers.entries()),
    question: data.question,
    state: data.gameState,
  }));
  console.log(label);
  console.dir(snapshot, { depth: null });
};

//every time a client connects to server, gives them a socket instance for each user
io.on("connection", (socket) => {
  console.log("client connected", socket.id); // random id assigned to each user
  logActiveRooms("active rooms snapshot on connect");
  socket.on("create-room-code", (reply) => {
    if (typeof reply !== "function") return;
    const roomCode = generateRoomCode();
    activeRooms.set(roomCode, createRoomData());
    logActiveRooms(`created room ${roomCode}`);
    reply({ ok: true, code: roomCode });
  });

  socket.on("validate-room-code", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const exists = typeof roomCode === "string" && activeRooms.has(roomCode);
    reply({ ok: exists });
  });

  // join-lobby(roomCode, userId?, reply?)
  socket.on("join-lobby", (roomCode, maybeUser, maybeReply) => {
    const userObj =
      maybeUser && typeof maybeUser === "object"
        ? maybeUser
        : typeof maybeUser === "string"
        ? { uid: maybeUser }
        : undefined;
    const reply =
      typeof maybeUser === "function"
        ? maybeUser
        : typeof maybeReply === "function"
        ? maybeReply
        : undefined;
    const room = activeRooms.get(roomCode);
    const exists = !!room;
    if (room) {
      socket.join(roomCode);
      const idToStore = userObj?.id || socket.id;
      room.userIds.add(idToStore);
      //store user data if provided
      if (userObj && userObj.uid) {
        room.userData.set(userObj.uid, {
          uid: userObj.uid,
          displayName: userObj.displayName || `User-${userObj.uid.slice(0, 6)}`,
          avatarUrl: userObj.avatarUrl || "",
        });
      } else {
        // fallback: ensure an entry exists for socket id
        room.userData.set(idToStore, {
          uid: idToStore,
          displayName: idToStore,
          avatarUrl: "",
        });
      }
      room.scores.set(idToStore, 0);
      room.answers.set(idToStore, "");
      logActiveRooms(`joined room ${roomCode}`);
      const participants = Array.from(room.userData.values());
      io.to(roomCode).emit("lobby:update", { participants });
    } else {
      console.log(`join rejected for room`, roomCode);
    }
    if (typeof reply === "function") {
      reply({ ok: exists });
    }
  });

  // leave-lobby(roomCode, userId?)
  socket.on("leave-lobby", (roomCode, userId) => {
    if (typeof roomCode !== "string") return;
    socket.leave(roomCode);
    const room = activeRooms.get(roomCode);
    if (room) {
      const idToRemove = userId || socket.id;
      room.userIds.delete(idToRemove);
      room.scores.delete(idToRemove);
      room.answers.delete(idToRemove);
      room.userData.delete(idToRemove);
      if (room.userIds.size === 0) {
        activeRooms.delete(roomCode);
        logActiveRooms(`room ${roomCode} emptied and removed`);
      } else {
        logActiveRooms(`left room ${roomCode}`);
        const participants = Array.from(room.userData.values());
        io.to(roomCode).emit("lobby:update", { participants });
      }
    }
  });

  socket.on("chat message", (msg) => {
    const roomId = msg?.roomId;
    if (!roomId) return;
    console.log("chat message", msg, "room", roomId);
    io.to(roomId).emit("chat message", msg); // broadcast to the room only
  });

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
    // remove socket from any rooms it belonged to
    for (const [code, room] of activeRooms.entries()) {
      // find matching uid entries pointing to this socket id (best-effort)
      // here we simply delete any entry whose uid matches socket.id
      if (room.userIds.has(socket.id)) {
        room.userIds.delete(socket.id);
        room.scores.delete(socket.id);
        room.answers.delete(socket.id);
        room.userData.delete(socket.id);
        if (room.userIds.size === 0) {
          activeRooms.delete(code);
          logActiveRooms(`room ${code} emptied and removed`);
        } else {
          const participants = Array.from(room.userData.values());
          io.to(code).emit("lobby:update", { participants });
          logActiveRooms(`socket disconnect cleaned up from room ${code}`);
        }
      }
    }
  });

  //will give the players in players one more point
  socket.on("add points", (roomCode, players) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    for (const playerId of players) {
      const current = room.scores.get(playerId);
      room.scores.set(playerId, current + 1);
    }
    logActiveRooms(`added points in room ${roomCode}`);
  });

  socket.on("reset points", (roomCode, players) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    for (const playerId of players) {
      room.scores.set(playerId, 0);
    }
    logActiveRooms(`reset points in room ${roomCode}`);
  });

  socket.on("set question", (roomCode, question) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    room.question = question;
    io.to(roomCode).emit("question updated", { question });
    logActiveRooms(`set question in room ${roomCode}`);
  });

  //returns the question that is in room.question
  socket.on("get question", (roomCode, reply) => {
    const room = activeRooms.get(roomCode);
    reply({ question: room.question });
  });

  socket.on("set answer", (roomCode, userId, answer) => {
    const room = activeRooms.get(roomCode);
    room.answers.set(userId, answer);
    logActiveRooms(`set answer in room ${roomCode}`);
  });

  // get-answer-map(roomCode, reply)
  // Returns an array of {user: userId, answer: string, id: 1-based index}
  socket.on("get answer map", (roomCode, reply) => {
    const room = activeRooms.get(roomCode);
    const answers = Array.from(room.answers.entries()).map(
      ([user, answer], idx) => ({
        user,
        answer,
        id: idx + 1,
      })
    );
    reply({ ok: true, answers });
  });

  socket.on("set game state", (roomCode, state) => {
    const room = activeRooms.get(roomCode);
    room.gameState = state;
    logActiveRooms(`set state in room ${roomCode}`);
  });

  socket.on("get game state", (roomCode, reply) => {
    const room = activeRooms.get(roomCode);
    reply({ gameState: room.gameState });
  });
});
