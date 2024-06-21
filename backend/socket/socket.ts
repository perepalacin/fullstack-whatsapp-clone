import { Server } from "socket.io";
import http from 'http';
import express from "express";

//Wrap the express server with the socket server
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]

    } 
});

interface UserSocketMap {
    [key: string]: string;
}

//Variable where we will store all the active socket ids!
const userSocketMap: UserSocketMap = {};

//Function that returns the socket id of a user id
export const getUserSocketId = (userId: string) => {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log("Someone has connected: " + socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        if (userId instanceof Array) {
            userSocketMap[userId[0]] = socket.id;
        } else {
            userSocketMap[userId] = socket.id;
        }
    }

    socket.on('disconnect', () => {
        console.log('Someone has disconnected: ' + socket.id);
    })
})

export {app, server, io};