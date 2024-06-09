import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import sql from "../../utils/connectToDB";
import { publicUserDetailsProps } from "../../../frontend/src/types";

const router = express.Router();

router.get("/", middleWare, async (_req: Request, res: Response) => {
    try {
        const loggedInUser = res.locals.userId;

        const allUsersExceptSelf = await sql<publicUserDetailsProps[]>`SELECT id, fullname, username, profile_picture FROM users WHERE id != ${loggedInUser}`;

        return res.status(200).json(allUsersExceptSelf);

    } catch (error) {
        console.log("Error getting users" + error);
        return res.status(500).json({error: "Interval Server Error fetching users"});
    }
});

router.get("/chats/", middleWare, async (_req: Request, res: Response) => {
    try {
        const loggedInUser = res.locals.userId;
        const chats = await sql`SELECT * from chats JOIN chats_to_users ON chats_to_users.user_id = ${loggedInUser}`;
        return res.status(200).json(chats);
    } catch (error) {
        console.log("Error getting users" + error);
        return res.status(500).json({error: "Interval Server Error fetching users"});
    }
})

export default router;