import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import path from "path";

import { app, server } from './socket/socket';
import authRouter from './routes/auth/routes';
import messagingRouter from './routes/msg/routes';
import userRoutes from './routes/user/routes';

dotenv.config();


const PORT = process.env.PORT || 5000;

const __rootDirectory = path.resolve()

app.get('/ping', (_req, res) => {
    console.log('Someone pinged here');
    res.send('pong');
});

app.use(express.json()); //Middleware to transform req.body into a json
//Get the tokens from our cookies:
app.use(cookieParser());

//Routes
app.use('/api/auth', authRouter);
app.use('/api/msg', messagingRouter);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__rootDirectory, "/frontend/dist")));
app.get("*", (_req, res) => {
    res.sendFile(path.join(__rootDirectory, "frontend", "dist", "index.html"))
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});