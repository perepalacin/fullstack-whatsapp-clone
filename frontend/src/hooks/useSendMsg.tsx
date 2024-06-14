import { useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";

const useSendMsg = () => {


    const { selectedChat} = useChatsContext();
    //Use this hook to disable the send button for example
    const [isSending, setIsSending] = useState(false);

    const sendMSg = async (message: String) => {
        setIsSending(true);
        try {
            if (!selectedChat) {
                throw new Error ("No chat selected");
            }

            if (!selectedChat.chat_id) {
                throw new Error ("Chat id missing");
            }
            const res = await fetch(`/api/msg/send/${selectedChat.chat_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message})
            });

            const data = await res.json();
            
            if (data.error) {
                throw new Error (data.error);
            }

        } catch (error) {
            if (error instanceof Error) {
                notifyError(error.message);
            } else {
                console.log(error);
            }

        } finally {
            setIsSending(false);
        }
    }

    return {sendMSg, isSending}
}

export default useSendMsg;