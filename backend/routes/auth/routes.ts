import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../../models/userModel";

import generateJWTSession from "../../utils/tokenGenerator";
import { isString } from "../../utils/dataParser";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    try {
        //Check if passwords match
        const {fullName, username, password, confirmPassword} = req.body;
        if (password != confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"});
        }

        //Check if the username is unique
        const user = await User.findOne({username});
        if (user) {
            return res.status(400).json({error: "Username already exists"});
        }

        //Check if the data is properly formatted
        if (!isString(fullName) || !isString(username) || !isString(password) || !isString(confirmPassword)) {
            return res.status(400).json({error: "Data not properly formatted"});
        }
        
        //Hash the passwrod
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        //Create the new user object
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            porfilePicture: "",
        });


        //Generate a jwt session, upload the object to mongo db
        if (newUser) {
            generateJWTSession(newUser._id, res);
            await newUser.save();
    
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePicture: newUser.profilePicture,
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
        const user = await User.findOne({username});

        //Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        //Return ambiguous data if one is incorrect
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateJWTSession(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePictue: user.profilePicture, 
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