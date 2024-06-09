import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import authRouter from './routes/auth/routes';
import messagingRouter from './routes/msg/routes';
import userRoutes from './routes/user/routes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});