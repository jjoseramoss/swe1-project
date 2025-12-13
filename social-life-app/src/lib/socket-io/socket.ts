import { io, Socket } from 'socket.io-client'

export const socket:Socket = io('https://hectorcorp.com', {
    autoConnect: true,
    transports: ['websocket']
}) // connects us to our backend server

//http://localhost:3000
//https://hectorcorp.com