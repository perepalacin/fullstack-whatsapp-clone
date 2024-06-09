import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import sql from "../../utils/connectToDB";
import { publicUserDetailsProps } from "../../../frontend/src/types";
import uuid4 from "uuid4";

const router = express.Router();


// router.get("/:chatId", middleWare, async (req: Request, res: Response) => {
//     try {
//         const {chatId} = req.params;

//         if (!chatId ) {
//             return res.status(400).json({error: "Chat id improperly formatted"})
//         }


//         const chat = await Chat.findById(chatId).populate("messages");

//         if (!chat) {
//             return res.status(404).json({error: "Chat room not found"});
//         }

//         return res.status(200).json(chat.messages)


//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({error: "Internal Server Error to fetch messages"});
//     }
// })

router.post("/newdm/:receiverId", middleWare, async (req: Request, res: Response) => {
    try {
        //Get the params of the request
        console.log("here");
        const {message} = req.body;
        const {receiverId} = req.params;
        console.log("here2");
        if (!message) {
            return res.status(400).json({error: "Message is missing"});
        }
        console.log("here3");
        // Get the sender id from the session
        const senderId = res.locals.userId.toString();
            if (!senderId) {
                return res.status(500).json({error: "Unauthorized request"});
        }
        console.log("here4");

        if (!receiverId) {
            return res.status(500).json({error: "Receiver id not properly formatted"});
        }
        console.log("here5");

        //CHECK THAT THE RECEIVING USER EXISTS ON THE DB
        const usersData = await sql<publicUserDetailsProps[]>`SELECT id, username, fullname, profile_picture FROM users WHERE id = ${receiverId} LIMIT 1`;  
        
        if (usersData.length === 0) {
            return res.status(404).json({error: "Receiver does not exist"});
        }        
        console.log("here6");

        const chatRoom = await sql`SELECT chat_id
            FROM chats_to_users
            WHERE user_id = ${senderId} OR user_id = ${receiverId}
            GROUP BY chat_id
            HAVING COUNT(DISTINCT user_id) = 2;`

        if (chatRoom.length !== 0) {
            return res.status(500).json({error: "Chat room already exsists"});
        }

        const uuid = uuid4();

        await sql`INSERT INTO chats (id, name, picture, type)
        VALUES (${uuid}, ${''}, ${''}, 'private');`;
        await sql`INSERT INTO chats_to_users (user_id, chat_id)
        VALUES (${senderId}, ${uuid}), (${receiverId}, ${uuid});`;
        const messageData = await sql`INSERT INTO messages (text, sender_id, room_id)
        VALUES (${message}, ${senderId}, ${uuid}) RETURNING text, sender_id, room_id;`;

        return res.status(200).json({messageData});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
});

router.post("/send/:chatId/", middleWare, async (req: Request, res: Response) => {
    try {

        //Get the params of the request
        const {message} = req.body;
        const {chatId} = req.params;

        // We get the sender id from the session
        const senderId = res.locals.userId.toString();

        if (!message) {
            return res.status(400).json({error: "Message is missing"});
        }

        if (!senderId) {
            return res.status(500).json({error: "Unauthorized request"});
        }

        if (!chatId){
            return res.status(400).json({error: "Chat id improperly formatted"});
        }
        
        //Check if roomchat exists
        // let chat = await Chat.findById(receiverId.toString());
        const query = await sql`SELECT id FROM chats WHERE id = ${chatId}`

        const chat = query[0];
        //TODO:
        if (chat) {
            const newMessage = await sql`INSERT INTO messages (text, sender_id, room_id)
            VALUES (${message}, ${senderId}, ${chatId}) RETURNING text, sender_id, room_id;`;
            console.log(newMessage);
            return res.status(200).json(newMessage);
        } else {
            return res.status(404).json({error: "Chat id not found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
});


export default router;