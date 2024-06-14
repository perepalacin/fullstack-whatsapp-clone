import { useEffect, useState } from "react";
import { notifyError } from "../components/Toasts";
import { Chats } from "../types";
import { useChatsContext } from "../context/ChatsContext";

const useFetchChatMsgs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<Chats[]>([]);

    const { selectedChat } = useChatsContext();

    useEffect(() => {
        const fetchChatMessages = async () => {
            if (!selectedChat) {
                setChatMessages([]);
                return;
            }

            let isAlreadyFetched = chatMessages.some(item => item.chat.chat_id === selectedChat.chat_id);
            if (!isAlreadyFetched) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/msg/chat/${selectedChat.chat_id}`);
                    const data = await res.json();

                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    setChatMessages(prevMessages => [...prevMessages, { chat: { chat_id: selectedChat.chat_id, messages: data } }]);

                } catch (error) {
                    if (error instanceof Error) {
                        notifyError(error.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchChatMessages();
    }, [selectedChat]); // Dependency array ensures this runs only when selectedChat changes

    return { chatMessages, isLoading };
};

export default useFetchChatMsgs;
