// requests persist
// Socket IO - create websockets
// websockets make connections to server
// good for small frequent requests

const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// roomCode -> roomData
// roomData: { scores: Map<userId, number>, userIds: Set<userId>, answers: Map<userId, string> , gameState: state}
const activeRooms = new Map();
const createRoomData = () => ({
    userIds: new Set(), // userid
    scores: new Map(), //userid, score
    answers: new Map(), // userid, answers
    names: new Map(), // userid, name
    chosen: new String, //userid
    question: new String, //question
    gameState: new String, //state
    queue: new Set(), //userid

    //game states: start, question, answer, finished
});

const generateRoomCode = () => {
    let roomCode;
    do {
        roomCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
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
io.on('connection', socket => {
    console.log('client connected', socket.id); // random id assigned to each user
    logActiveRooms('active rooms snapshot on connect');
    socket.on('create-room-code', (reply) => {
        if (typeof reply !== 'function') return;
        const roomCode = generateRoomCode();
        activeRooms.set(roomCode, createRoomData());
        logActiveRooms(`created room ${roomCode}`);
        reply({ ok: true, code: roomCode });
    });

    socket.on('validate-room-code', (roomCode, reply) => {
        if (typeof reply !== 'function') return;
        const exists = typeof roomCode === 'string' && activeRooms.has(roomCode);
        reply({ ok: exists });
    });
    
    // join-lobby(roomCode, userId?, reply?)
    socket.on("join-lobby", (roomCode, maybeUserId, userName, maybeReply) => {
      const userId = typeof maybeUserId === 'string' ? maybeUserId : undefined;
      const reply = typeof maybeUserId === 'function' ? maybeUserId : (typeof maybeReply === 'function' ? maybeReply : undefined);
      const room = activeRooms.get(roomCode);
      const exists = !!room;
      if (room) {
        socket.join(roomCode);
        const idToStore = userId || socket.id;
        room.userIds.add(idToStore);
        room.scores.set(idToStore, 0);
        room.answers.set(idToStore, "");
        room.names.set(idToStore, userName);
        room.chosen = "";
        logActiveRooms(`joined room ${roomCode}`);
      } else {
        console.log(`join rejected for room`, roomCode);
      }
      if (typeof reply === 'function') {
        reply({ ok: exists });
      }
    });

    // leave-lobby(roomCode, userId?)
    socket.on("leave-lobby", (roomCode, userId) => {
      if (typeof roomCode !== 'string') return;
      socket.leave(roomCode);
      const room = activeRooms.get(roomCode);
      if (room) {
        const idToRemove = userId || socket.id;
        room.userIds.delete(idToRemove);
        room.scores.delete(idToRemove);
        room.answers.delete(idToRemove);
        if (room.userIds.size === 0) {
          activeRooms.delete(roomCode);
          logActiveRooms(`room ${roomCode} emptied and removed`);
        } else {
          logActiveRooms(`left room ${roomCode}`);
        }
      }
    });

    socket.on('chat message', (msg) => {
        const roomId = msg?.roomId;
        if (!roomId) return;
        console.log('chat message', msg, 'room', roomId);    
        io.to(roomId).emit('chat message', msg); // broadcast to the room only
    });

    
    /** 
    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
      // remove socket from any rooms it belonged to
      for (const [code, room] of activeRooms.entries()) {
        room.userIds.delete(socket.id);
        room.scores.delete(socket.id);
        room.answers.delete(socket.id);
        if (room.userIds.size === 0) {
          activeRooms.delete(code);
          logActiveRooms(`room ${code} emptied and removed`);
        }
      }
    });
*/

    //will give the players in players one more point
    socket.on('add-points', (roomCode, players) => {
      const room = activeRooms.get(roomCode);
      if (!room) return;
      for (const playerId of players) {
        const current = room.scores.get(playerId); 
        room.scores.set(playerId, current + 1);
      }
        logActiveRooms(`added points in room ${roomCode}`);
      });

    socket.on('reset-points', (roomCode, players) => {
      const room = activeRooms.get(roomCode);
      if (!room) return;
      for (const playerId of players) {
        room.scores.set(playerId, 0);
      }
        logActiveRooms(`reset points in room ${roomCode}`);
      });

    socket.on('set-question', (roomCode, question) => {
      const room = activeRooms.get(roomCode);
      if (!room) return;
      room.question = question;
      room.gameState = 'setA';      
      logActiveRooms(`set question in room ${roomCode}`);
    });

    //returns the question that is in room.question
    socket.on('get-question', (roomCode, reply) => {
      const room = activeRooms.get(roomCode);
      reply({question: room.question });
    });

    socket.on('set-answer', (roomCode, userId, answer) => {
      const room = activeRooms.get(roomCode);
      room.answers.set(userId, answer)
      room.gameState
      logActiveRooms(`set answer in room ${roomCode}`);
    });

    socket.on('get-answer', (roomCode, userId, reply) => {
      const room = activeRooms.get(roomCode);
      reply({answer: room.answers.get(userId)});
    });

    socket.on('get-name', (roomCode, userId, reply) => {
      const room = activeRooms.get(roomCode);
      reply({name: room.names.get(userId)});
    });

    socket.on('get-answer-map', (roomCode, reply) => {
      if (typeof reply !== 'function') return;
      const room = activeRooms.get(roomCode);
      if (!room) {
        reply({ ok: false, answers: [] });
        return;
      }
      const answers = Array.from(room.answers.entries()).map(([userId, answer]) => ({
        user: room.names.get(userId) || "",
        answer,
        id: userId,
      }));
      reply({ ok: true, answers });
    });

    socket.on('set-game-state', (roomCode, state) => {
      const room = activeRooms.get(roomCode);
      room.gameState = state;
      logActiveRooms(`set state in room ${roomCode}`);
    });

    socket.on('get-game-state', (roomCode, reply) => {
      const room = activeRooms.get(roomCode);
      reply({ok: true, gameState: room.gameState});
    });

    socket.on('get-users', (roomCode, reply) => {
      if (typeof reply !== 'function') return;
      const room = activeRooms.get(roomCode);
      if (!room) {
        reply({ ok: false, users: [] });
        return;
      }
      reply({ ok: true, users: Array.from(room.userIds) });
    });

    socket.on('start-game', (roomCode) => {
        const room = activeRooms.get(roomCode);
        room.gameState = "setQ";
        room.queue = room.userIds;
        const iter = room.queue.values();
        const first = iter.next().value;
        if(first !== undefined) {
          room.chosen = first;
          room.queue.delete(first);
        }
        else {
          room.chosen = "none";
        }
        logActiveRooms(`started in room ${roomCode}`);
    });

    socket.on('next-player', (roomCode) => {
      const room = activeRooms.get(roomCode);
      const first = room.queue.values().next.value;
        if(first !== undefined) {
          set.delete(first);
          room.chosen = first;
        }
        else {
          room.chosen = "";
        }
    });

    socket.on('get-chosen', (roomCode, reply) => {
      const room = activeRooms.get(roomCode);
      reply({ok: true, chosen: room.chosen });
    });



});
