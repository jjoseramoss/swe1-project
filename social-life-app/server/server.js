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
  host: new String(),
  userData: new Map(), // store per-user info { uid, displayName, avatarUrl} can add other info later
  question: new String(),
  gameState: new String(),
  userIds: new Set(), // userid
  scores: new Map(), //userid, score
  answers: new Map(), // userid, answers
  names: new Map(), // userid, name
  chosen: new String(), //userid
  queue: new Set(), //userid
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
    names: Array.from(data.names.entries()),
    queue: Array.from(data.queue),
    chosen: data.chosen,
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
    roomCode.chosen = "";
    logActiveRooms(`created room ${roomCode}`);
    reply({ ok: true, code: roomCode });
  });

  socket.on("validate-room-code", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const exists = typeof roomCode === "string" && activeRooms.has(roomCode);
    reply({ ok: exists });
  });

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
      const idToStore = userObj?.uid || socket.id;
      room.userIds.add(idToStore);
      //store user data if provided
      if (userObj && userObj.uid) {
        room.userData.set(userObj.uid, {
          uid: userObj.uid,
          displayName: userObj.displayName || `User-${userObj.uid.slice(0, 6)}`,
          avatarUrl: userObj.avatarUrl || "",
          bio: userObj.bio || "",
          insta: userObj.insta || "",
        });
      } else {
        // fallback: ensure an entry exists for socket id
        room.userData.set(idToStore, {
          uid: idToStore,
          displayName: idToStore,
          avatarUrl: "",
          bio: "",
          insta: "",
        });
      }
      room.scores.set(idToStore, 0);
      room.answers.set(idToStore, "");
      room.names.set(idToStore, userObj.displayName);
      room.chosen = "";
      logActiveRooms(`joined room ${roomCode}`);
      const participants = Array.from(room.userData.values());
      io.to(roomCode).emit("lobby:update", {
        participants,
        count: participants.length,
      });
    } else {
      console.log(`join rejected for room`, roomCode);
    }
    if (typeof reply === "function") {
      reply({ ok: exists });
    }
  });

  // leave-lobby(roomCode, userId?)
  socket.on("leave-lobby", (roomCode, userId) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    socket.leave(roomCode);
    room.userIds.delete(userId);
    room.scores.delete(userId);
    room.answers.delete(userId);
    room.userData.delete(userId);

    logActiveRooms(`leave-lobby ${userId} from room ${roomCode}`);

    const participants = Array.from(room.userData.values());
    io.to(roomCode).emit("lobby:update", {
      participants,
      count: participants.length,
    });

    if (room.userIds.size === 0) {
      activeRooms.delete(roomCode);
      logActiveRooms(`room ${roomCode} emptied and removed`);
    }
  });

  socket.on("chat message", (msg) => {
    const roomId = msg?.roomId;
    if (!roomId) return;
    console.log("chat message", msg, "room", roomId);
    io.to(roomId).emit("chat message", msg); // broadcast to the room only
  });

  /*
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
    });
    */

  //will give the players in players one more point
  socket.on("add-points", (roomCode, players) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    for (const playerId of players) {
      const current = room.scores.get(playerId);
      room.scores.set(playerId, current + 1);
    }
    room.gameState = "viewL";
    io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    logActiveRooms(`added points in room ${roomCode}`);
  });

  socket.on("reset-points", (roomCode, players) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    for (const playerId of players) {
      room.scores.set(playerId, 0);
    }
    logActiveRooms(`reset points in room ${roomCode}`);
  });

  socket.on("set-question", (roomCode, question) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    room.question = question;
    room.gameState = "setA";
    io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    logActiveRooms(`set question in room ${roomCode}`);
  });

  //returns the question that is in room.question
  socket.on("get-question", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ question: "" });
      return;
    }
    reply({ question: room.question });
  });

  socket.on("set-answer", (roomCode, userId, answer) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    room.answers.set(userId, answer);
    let everyoneAnswered = true;
    for (const playerId of room.userIds) {
      if (room.chosen && playerId === room.chosen) continue;
      const response = room.answers.get(playerId);
      if (!response || response.trim() === "") {
        everyoneAnswered = false;
        break;
      }
    }

    if (everyoneAnswered) {
      room.gameState = "setC";
      io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    }

    logActiveRooms(`set answer in room ${roomCode}`);
  });

  socket.on("get-answer", (roomCode, userId, reply) => {
    const room = activeRooms.get(roomCode);
    reply({ answer: room.answers.get(userId) });
  });

  socket.on("get-name", (roomCode, userId, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ name: "" });
      return;
    }
    reply({ name: room.names.get(userId) });
  });

  socket.on("get-answer-map", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ ok: false, answers: [] });
      return;
    }
    const answers = Array.from(room.answers.entries())
      .filter(([userId]) => userId !== room.chosen)
      .map(([userId, answer]) => ({
        user: room.names.get(userId) || "",
        answer,
        id: userId,
      }));
    reply({ ok: true, answers });
  });

  socket.on("get-scores-map", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ ok: false, answers: [] });
      return;
    }
    const answers = Array.from(room.scores.entries()).map(
      ([userId, score]) => ({
        id: userId,
        user: room.names.get(userId) || "",
        score: score,
        avatarUrl: room.userData.get(userId)?.avatarUrl || "",
      })
    );
    reply({ ok: true, answers });
  });

  socket.on("set-game-state", (roomCode, state) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    room.gameState = state;
    io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    logActiveRooms(`set state in room ${roomCode}`);
  });

  socket.on("get-game-state", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ ok: false, gameState: "" });
      return;
    }
    reply({ ok: true, gameState: room.gameState });
  });

  socket.on("get-users", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ ok: false, participants: [] });
      return;
    }
    const participants = Array.from(room.userData.values());
    reply({ ok: true, participants });
  });

  socket.on("start-game", (roomCode) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    room.gameState = "setQ";
    // create an independent queue so mutations don't change userIds
    room.queue = new Set(room.userIds);
    // reset all answers at the start of the round
    for (const uid of room.answers.keys()) {
      room.answers.set(uid, "");
    }
    const iter = room.queue.values();
    const first = iter.next().value;
    if (first !== undefined) {
      room.chosen = first;
      room.queue.delete(first);
    } else {
      room.chosen = "none";
    }
    io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    logActiveRooms(`started in room ${roomCode}`);
  });

  socket.on("start-next-game", (roomCode) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;
    room.gameState = "setQ";
    // reset all answers at the start of the round
    for (const uid of room.answers.keys()) {
      room.answers.set(uid, "");
    }
    const iter = room.queue.values();
    const first = iter.next().value;
    if (first !== undefined) {
      room.chosen = first;
      room.queue.delete(first);
    } else {
      room.chosen = "none";
    }
    io.to(roomCode).emit("game-state-updated", { gameState: room.gameState });
    logActiveRooms(`started in room ${roomCode}`);
  });

  socket.on("end-game", (roomCode) => {
    const room = activeRooms.get(roomCode);
    if(!room) return;

    // set gameState to end
    room.gameState = "end"
    // send state to sockets
    io.to(roomCode).emit("game-state-updated", {gameState: room.gameState});
  })

  socket.on("next-player", (roomCode) => {
    const room = activeRooms.get(roomCode);
    const first = room.queue.values().next.value;
    if (first !== undefined) {
      set.delete(first);
      room.chosen = first;
    } else {
      room.chosen = "";
    }
  });

  socket.on("get-chosen", (roomCode, reply) => {
    if (typeof reply !== "function") return;
    const room = activeRooms.get(roomCode);
    if (!room) {
      reply({ ok: false, chosen: "" });
      return;
    }
    reply({ ok: true, chosen: room.chosen });
  });
});
