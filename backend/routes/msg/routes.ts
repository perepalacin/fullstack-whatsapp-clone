import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";

const router = express.Router();


router.get("/:chatId", middleWare, async (req: Request, res: Response) => {
    try {
        const {chatId} = req.params;

        if (!chatId ) {
            return res.status(400).json({error: "Chat Id improperly formatted"})
        }


        const chat = await Chat.findById(chatId).populate("messages");

        if (!chat) {
            return res.status(404).json({error: "Chat room not found"});
        }

        return res.status(200).json(chat.messages)


    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error to fetch messages"});
    }
})

router.post("/send/:receiverId/", middleWare, async (req: Request, res: Response) => {
    try {

        //Get the params of the request
        const {message} = req.body;
        console.log(message);
        const { receiverId } = req.params;
        console.log(receiverId);
        console.log(res.locals.userId.toString());
        const senderId = res.locals.userId.toString();

        //Check if message exists
        console.log("Here");

        if (!message) {
            return res.status(400).json({error: "Message is missing"});
        }
        
        console.log("cat");
        //Check if roomchat exists
        let chat = await Chat.findById(receiverId.toString());
        
        //If it exsists, throw error
        if (chat) {
            return res.status(500).json({error: "This conversation already exists"});
        }
        
        //if not, create one
        chat = await Chat.create({
            participants: [senderId, receiverId],
            name: "",

        });

        //Create a new message instance
        const newMessage = new Message({
            userId: senderId, 
            message
        });

        if (newMessage) {
            chat.messages.push(newMessage._id);
        }

        // //Save the convo and the message onto the database:
        // await chat.save();
        // await newMessage.save();
        //How to make two promises in parallel:
        await Promise.all([chat.save(), newMessage.save()]);

        return res.status(201).json(newMessage);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
});


export default router;