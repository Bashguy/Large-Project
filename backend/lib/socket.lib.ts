import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const userSocket: any = {}; // {userID: socketID}

export const getReceiverID = (receiverID: any) => {
    return userSocket[receiverID];
}

io.on("connection", (socket: any) => {
    const userID = socket.handshake.query.userID; // can be null
    if (userID) userSocket[userID] = socket.id;

    // io.emit() is used to broadcast to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocket) );

    console.log("User Connected: ", userID);

    socket.on("disconnect", () => {
        delete userSocket[userID];
        console.log("User Disconnected: ", userID);
    });
});

export { app, server, io };