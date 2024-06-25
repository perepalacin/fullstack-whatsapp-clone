import { useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";

const useSendMsg = () => {


    const { selectedChat, setSelectedChat, onGoingChats, setOnGoingChats } = useChatsContext();
    //Use this hook to disable the send button for example
    const [isSending, setIsSending] = useState(false);

    const sendMSg = async (message: String) => {
        setIsSending(true);

        //For future works: We could create a fake message object, append it to the OnGoingChats context state (with a clock to show that it hasnt been sent yet)
        //then try the api call, if it fails, say that the message failed. If it succeeds, update the state to display the tickmeaning that the msg was sent.
        try {
            if (!selectedChat) {
                throw new Error("No chat selected");
            }

            // This section controls new dm (first time you msg someone)
            if (selectedChat.startsWith("new-")) {
                const receiverId = selectedChat.slice(4).trim();
                const res = await fetch(`/api/msg/newdm/${receiverId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message })
                });

                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                if (onGoingChats) {
                    const newChatArray = [...onGoingChats];
                    newChatArray.filter((chat) => {chat.chat_id.startsWith("new-")});
                    newChatArray.unshift(data.chatData);
                    setOnGoingChats(newChatArray);
                } else {
                    setOnGoingChats(data.chatData);
                }
                setSelectedChat(data.chatData.chat_id)
                
                //This part manages sending someone a message you have already texted in the past.
            } else {
                const res = await fetch(`/api/msg/send/${selectedChat}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                if (onGoingChats) {
                    const newChatArray = [...onGoingChats];
                    //Turn this into a for, break when found the chat id, shift the index to the front! 
                    for (let i = 0; i < newChatArray.length; i++) {
                        if (newChatArray[i].chat_id === selectedChat) {
                            newChatArray[i].messages.push(data[0]);
                            newChatArray.unshift(newChatArray.splice(i, 1)[0]);
                            break;
                        }
                    }

                    setOnGoingChats(newChatArray);
                }
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

    return { sendMSg, isSending }
}

export default useSendMsg;