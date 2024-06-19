import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import sql from "../../utils/connectToDB";
import { OnGoingChatsProps, publicUserDetailsProps } from "../../../frontend/src/types";
import uuid4 from "uuid4";

const router = express.Router();

interface participantsProps {
    user_id: string;
}

router.get("/chat/:chatId", middleWare, async (req: Request, res: Response) => {
    try {
        const {chatId} = req.params;

        if (!chatId ) {
            return res.status(400).json({error: "Chat id improperly formatted"})
        }

        const userId = res.locals.userId;
        if (!userId) {
                return res.status(500).json({error: "Unauthorized request"});
        }

        //Check if user is in chat id, otherwise say its unauthorized
        const participants = await sql<participantsProps[]>`SELECT user_id FROM chats_to_users WHERE chat_id = ${chatId}`;

        let authorized = false;
        participants.forEach((item) => {
            if (item.user_id === userId) {
                authorized = true;
            }
        })

        if (!authorized) {
            return res.status(500).json({error: "Unauthorized user"});
        }

        const messages = await sql`SELECT * FROM messages WHERE chat_id = ${chatId} ORDER BY created_at ASC`;
        if (!messages) {
            return res.status(404).json({error: "No messages were found"});
        }

        return res.status(200).json(messages);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error to fetch messages"});
    }
})

router.post("/newdm/:receiverId", middleWare, async (req: Request, res: Response) => {
    try {

        //Get the params of the request
        const {message} = req.body;
        const {receiverId} = req.params;
        if (!message) {
            return res.status(400).json({error: "Message is missing"});
        }
        // Get the sender id from the session
        const senderId = res.locals.userId.toString();
            if (!senderId) {
                return res.status(500).json({error: "Unauthorized request"});
        }

        if (!receiverId) {
            return res.status(500).json({error: "Receiver id not properly formatted"});
        }

        //CHECK THAT THE RECEIVING USER EXISTS ON THE DB
        const usersData = await sql<publicUserDetailsProps[]>`SELECT id, username, fullname, profile_picture FROM users WHERE id = ${receiverId} LIMIT 1`;  
        
        if (usersData.length === 0) {
            return res.status(404).json({error: "Receiver does not exist"});
        }        

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
        const messageData = await sql`INSERT INTO messages (text, sender_id, chat_id)
        VALUES (${message}, ${senderId}, ${uuid}) RETURNING id, text, sender_id, chat_id, created_at;`;
        
        // Convert this response into a OnGoingChats object to return it and append it to the context state!

        const chatData: OnGoingChatsProps = {
            chat_id: uuid,
            chat_name: usersData[0].fullname,
            chat_picture: usersData[0].profile_picture,
            chat_type: "private",
            participants: [{
                id: usersData[0].id,
                fullname: usersData[0].fullname,
                username: usersData[0].username,
                profile_picture: usersData[0].profile_picture
            }],
            messages: [{
                id: messageData[0].id,
                text: messageData[0].text,
                sender_id: messageData[0].sender_id,
                chat_id: messageData[0].chat_id,
                created_at: messageData[0].created_at
            }]
        }

        return res.status(200).json({chatData});

    } catch (error) {
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
            const newMessage = await sql`INSERT INTO messages (text, sender_id, chat_id)
            VALUES (${message}, ${senderId}, ${chatId}) RETURNING text, sender_id, chat_id, created_at;`;
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