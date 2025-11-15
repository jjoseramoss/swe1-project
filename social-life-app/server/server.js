// requests persist
// Socket IO - create websockets
// websockets make connections to server
// good for small frequent requests

const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//every time a client connects to server, gives them a socket instance for each user
io.on('connection', socket => {
    console.log('client connected', socket.id) // random id assigned to each user
    
    socket.on('chat message', (msg) => {
      console.log('chat message', msg);
      io.emit('chat message', msg); // broadcast to everyone
    });

    socket.on('disconnect', () => {
      console.log('client disconnected', socket.id);
    });
})