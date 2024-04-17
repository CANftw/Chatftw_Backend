import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path'
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';
import { connectToDb } from './db/connection';
import { Server } from 'socket.io';
import { authenticateToken, authtokenws } from './middleware/index';
import * as fs from 'fs';
import { addMessageToRoom } from './controllers/room.controller';

const app = express();
dotenv.config();


const key = fs.readFileSync('certs/cert.key');
const cert = fs.readFileSync('certs/cert.crt');

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});



io.on('connection', (socket) => {
    console.log(`a user ${socket.id} connected`);

    socket.on('message', (msg) => {
        console.log('message: ' + msg);
    })
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });
    socket.on('message', (room, user, msg) => {
        socket.broadcast.emit('message', room, user, msg);
        console.log(`Message to ${room}: ${msg}`);
        addMessageToRoom(room, user, msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});


connectToDb();
app.use('/api/v1', router());