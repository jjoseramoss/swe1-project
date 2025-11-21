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

// roomCode -> Set of user ids (or socket ids if user id not provided)
const activeRooms = new Map();
const generateRoomCode = () => {
    let roomCode;
    do {
        roomCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    } while (activeRooms.has(roomCode));
    return roomCode;
};
const logActiveRooms = (label) => {
    const snapshot = Array.from(activeRooms.entries()).map(([code, users]) => ({
        code,
        users: Array.from(users)
    }));
    console.log(label, snapshot);
};

//every time a client connects to server, gives them a socket instance for each user
io.on('connection', socket => {
    console.log('client connected', socket.id); // random id assigned to each user
    logActiveRooms('active rooms snapshot on connect');
    socket.on('create-room-code', (reply) => {
        if (typeof reply !== 'function') return;
        const roomCode = generateRoomCode();
        activeRooms.set(roomCode, new Set());
        logActiveRooms(`created room ${roomCode}`);
        reply({ ok: true, code: roomCode });
    });

    socket.on('validate-room-code', (roomCode, reply) => {
        if (typeof reply !== 'function') return;
        const exists = typeof roomCode === 'string' && activeRooms.has(roomCode);
        reply({ ok: exists });
    });
    
    // join-lobby(roomCode, userId?, reply?)
    socket.on("join-lobby", (roomCode, maybeUserId, maybeReply) => {
      const userId = typeof maybeUserId === 'string' ? maybeUserId : undefined;
      const reply = typeof maybeUserId === 'function' ? maybeUserId : (typeof maybeReply === 'function' ? maybeReply : undefined);
      const exists = typeof roomCode === 'string' && activeRooms.has(roomCode);
      if (exists) {
        socket.join(roomCode);
        const users = activeRooms.get(roomCode);
        const idToStore = userId || socket.id;
        users?.add(idToStore);
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
      const users = activeRooms.get(roomCode);
      if (users) {
        users.delete(userId || socket.id);
        if (users.size === 0) {
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

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
      // remove socket from any rooms it belonged to
      for (const [code, users] of activeRooms.entries()) {
        users.delete(socket.id);
        if (users.size === 0) {
          activeRooms.delete(code);
          logActiveRooms(`room ${code} emptied and removed`);
        }
      }
    });
});
