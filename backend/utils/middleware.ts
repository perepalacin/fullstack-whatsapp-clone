import { Response } from "express";
// import session from "express-session";

import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";

const middleWare = async (req: any, res: Response, next: any) => {
    try {

        //We ge the token from the request from the client
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({error: "Unauthorized - No token Provided"});
        }

        //We process this token with our jwt secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({error: "Internal server error"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        //If its invalid we kick the user
        if (!decoded) {
            return res.status(401).json({error: "Unauthorized user - Invalid Token"});
        }

        //We find the user in our db
        const user = await User.findById(decoded.userId).select("-password");

        //If the user is not in the db we stop the request
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        //we set the user into the request;
        res.locals.userId = user._id;
        
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