import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import sql from "./connectToDB";

import { publicUserDetailsProps } from "../../frontend/src/types";


const middleWare = async (req: Request, res: Response, next: any) => {
    try {
        //We ge the token from the request from the client
        console.log("here");
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({error: "Unauthorized - No token Provided"});
        }
        console.log("here2");

        //We process this token with our jwt secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({error: "Internal server error"});
        }
        console.log("here3");
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        console.log("here4");

        //If its invalid we kick the user
        if (!decoded) {
            return res.status(401).json({error: "Unauthorized user - Invalid Token"});
        }
        console.log("here5");

        //We find the user in our db
        const queryResult = await sql<publicUserDetailsProps[]>`SELECT id, username, fullname, profile_picture FROM users WHERE id = ${decoded.userId}`;
        console.log("here6");
        console.log(queryResult);
        const user = queryResult[0];
        //If the user is not in the db we stop the request
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        console.log("here7");

        //we set the user into the request;
        res.locals.userId = user.id; // So that it can be accessed later on
        
        //We execute the next function after the middleware
        next();

        //Return null for typescript strict mode
        return null;
        
    } catch (error) {
        console.log("Error in the middleware function: " + error);
        return res.status(500).json({error: "Internal server error with the middleware"});
    }
}

export default middleWare;