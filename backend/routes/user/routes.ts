import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import sql from "../../utils/connectToDB";
import { OnGoingChatsProps, publicUserDetailsProps } from "../../../frontend/src/types";

const router = express.Router();

router.get("/", middleWare, async (_req: Request, res: Response) => {
    try {
        const loggedInUser = res.locals.userId;

        if (!loggedInUser) {
            return res.status(400).json({error: "Unauthorized request"});
        }

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
        // const chats = await sql`SELECT * from chats JOIN chats_to_users ON chats_to_users.user_id = ${loggedInUser} JOIN users ON chats_to_users `;
        // const chats = await sql`SELECT * FROM messages ORDER BY created_at ASC JOIN chats_to_users ON chats_to_users.user_id = ${loggedInUser} GROUP BY chat_id`;
        const chats = await sql<OnGoingChatsProps[]>`
        SELECT 
            c.id AS chat_id,
            c.name AS chat_name,
            c.picture AS chat_picture,
            c.type AS chat_type,
            lm.id AS last_message_id,
            lm.text AS last_message_text,
            lm.created_at AS last_message_timestamp,
            u.id AS sender_id,
            u.username AS sender_username,
            u.fullname AS sender_fullname,
            (
                SELECT 
                    jsonb_agg(
                        jsonb_build_object(
                            'user_id', u2.id,
                            'username', u2.username,
                            'fullname', u2.fullname,
                            'profile_picture', u2.profile_picture
                        )
                    )
                FROM 
                    chats_to_users ctu
                JOIN 
                    users u2 ON ctu.user_id = u2.id
                WHERE 
                    ctu.chat_id = c.id
            ) AS participants
        FROM 
            chats c
        JOIN 
            messages lm ON lm.id = (
                SELECT 
                    m.id 
                FROM 
                    messages m 
                WHERE 
                    m.chat_id = c.id 
                ORDER BY 
                    m.created_at DESC 
                LIMIT 1
            )
        JOIN 
            users u ON lm.sender_id = u.id
        JOIN 
            chats_to_users ctu2 ON c.id = ctu2.chat_id
        WHERE 
            ctu2.user_id = ${loggedInUser}
        ORDER BY 
            c.id`;

        return res.status(200).json(chats);
    
    } catch (error) {
        console.log("Error getting users" + error);
        return res.status(500).json({error: "Interval Server Error fetching users"});
    }
});

router.get("/user/:userId", middleWare, async (req: Request, res: Response) => {
    try {

        const loggedInUser = res.locals.userId;
        if (!loggedInUser) {
            return res.status(400).json({error: "Unauthorized request"});
        }

        const {userId} = req.params;

        if (!userId) {
            return res.status(406).json({error: "User id improperly formatted"});
        }

        const userDetails = await sql<publicUserDetailsProps[]>`SELECT id, fullname, username, profile_picture FROM users WHERE id = ${userId} LIMIT 1`;

        return res.status(200).json(userDetails);

    } catch (error) {
        console.log("Error getting users" + error);
        return res.status(500).json({error: "Interval Server Error fetching users"});
    }
});



export default router;