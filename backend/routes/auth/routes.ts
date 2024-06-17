import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";

import generateJWTSession from "../../utils/tokenGenerator";
import { isString } from "../../utils/dataParser";
import sql from "../../utils/connectToDB";
import { publicUserDetailsProps, privateUserDetailsProps } from "../../../frontend/src/types";
import { getRandomInt } from "../../utils/helperFunctions";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    try {
        //Check if passwords match
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if (password != confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"});
        }

        //Check if the username is unique
        const user = await sql`SELECT username FROM users WHERE username = ${username}`;
        if (user.length !== 0) {
            return res.status(400).json({error: "Username already exists"});
        }

        const randomInt = getRandomInt(76); //The api used to generate the random image has a limit of 77 types.
        let profile_picture_url = `https://xsgames.co/randomusers/assets/avatars/${gender.toLowerCase()}/${randomInt}.jpg`;

        //Check if the data is properly formatted
        if (!isString(fullName) || !isString(username) || !isString(password) || !isString(confirmPassword)) {
            return res.status(400).json({error: "Data not properly formatted"});
        }
        
        //Hash the passwrod
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        //Create the new user object
        const newUser = await sql<publicUserDetailsProps[]>`INSERT INTO users (username, fullname, password, profile_picture)
        VALUES (${username}, ${fullName}, ${hashedPassword}, ${profile_picture_url}) RETURNING id, username, fullname, profile_picture`;


        //Generate a jwt session, upload the object to mongo db
        if (newUser[0]) {
            generateJWTSession(Object(newUser[0].id), res);
    
            return res.status(201).json({
                id: newUser[0].id,
                fullName: newUser[0].fullname,
                username: newUser[0].username,
                profilePicture: newUser[0].profile_picture,
            });
        } else {
            return res.status(400).json({error: "Invalid user details"});
        }

    } catch (error) {
        console.log("Error in sign up: " + error)
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const{username, password} = req.body;
        //Look if the user exists

        const queryResult = await sql<privateUserDetailsProps[]>`SELECT id, username, password FROM users WHERE username = ${username}`;

        const user = queryResult[0];

        //Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");

        //Return ambiguous data if one is incorrect
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateJWTSession(Object(user.id), res);

        return res.status(200).json({
            id: user.id,
            fullName: user.fullname,
            username: user.username,
            profilePictue: user.profile_picture, 
        });

    } catch (error) {
        console.log("Error in login route", error);
        return res.status(500).json({error: "Internal Server Error in Login Route"});

    }
});

router.post("/logout", async (_req, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({message: "Logged out successfylly"});
    } catch (error) {
        console.log("Error in the logout route" + error);
        return res.status(500).json({error: "Internal Server Error when logging out"});
    }
});

export default router;