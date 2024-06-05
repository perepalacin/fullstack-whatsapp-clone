import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
import { ObjectId } from 'mongodb';

dotenv.config();

const generateJWTSession = (userId: ObjectId, res: any) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({error: "Internal server error when generating a JWT Token"})
    }

    const jwtToken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });
    
    res.cookie("jwt", jwtToken, {
        maxAge: 15 * 24 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
} 

export default generateJWTSession;