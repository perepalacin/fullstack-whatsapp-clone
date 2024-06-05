import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            },
        ],
        name: {
            type: String,
            required: false,
        }
    },
    {timestamps: true}
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;

