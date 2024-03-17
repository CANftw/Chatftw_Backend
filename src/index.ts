import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';
import { connectToDb } from './db/connection';
const app = express();
dotenv.config();

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});


connectToDb();
app.use('/api/v1', router());