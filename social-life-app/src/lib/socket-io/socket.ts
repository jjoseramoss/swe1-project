import { io, Socket } from 'socket.io-client'

export const socket:Socket = io('http://localhost:3000', {
    autoConnect: true,
    transports: ['websocket']
}) // connects us to our backend server

