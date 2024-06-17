import { useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";

const useSendMsg = () => {


    const { selectedChat, onGoingChats, setOnGoingChats} = useChatsContext();
    //Use this hook to disable the send button for example
    const [isSending, setIsSending] = useState(false);

    const sendMSg = async (message: String) => {
        setIsSending(true);

        //For future works: We could create a fake message object, append it to the OnGoingChats context state (with a clock to show that it hasnt been sent yet)
        //then try the api call, if it fails, say that the message failed. If it succeeds, update the state to display the tickmeaning that the msg was sent.
        try {
            if (!selectedChat) {
                throw new Error ("No chat selected");
            }

            const res = await fetch(`/api/msg/send/${selectedChat}`, {
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
            

            if (onGoingChats) {
                const newChatArray = [...onGoingChats];
    
                newChatArray.forEach((item) => {
                    if (item.chat_id === selectedChat) {
                        item.messages.push(data[0]);
                    }
                });
                setOnGoingChats(newChatArray);
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