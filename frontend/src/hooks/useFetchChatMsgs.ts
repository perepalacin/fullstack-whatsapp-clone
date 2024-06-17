import { useEffect, useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";

const useFetchChatMsgs = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { selectedChat, onGoingChats, setOnGoingChats } = useChatsContext();

    useEffect(() => {
        const fetchChatMessages = async () => {
            if (!selectedChat) {
                return;
            }

            //TODO: Check somehow if the messages have already been fetched. 
            //even better,send the actual length of the array in the params of the api, fetch from the length + 50.
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/msg/chat/${selectedChat}`);
                    const data = await res.json();

                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    if (onGoingChats) {
                        const newChatArray = [...onGoingChats];
                        newChatArray.forEach((item) => {
                            if (item.chat_id === selectedChat) {
                                item.messages = data;
                            }
                        });
                        setOnGoingChats(newChatArray);
                    }

                } catch (error) {
                    if (error instanceof Error) {
                        notifyError(error.message);
                    }
                } finally {
                    setIsLoading(false);
                }
        };

        fetchChatMessages();
    }, [selectedChat]); // Dependency array ensures this runs only when selectedChat changes

    return { isLoading };
};

export default useFetchChatMsgs;
