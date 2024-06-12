import { useEffect, useState } from "react"
import { notifyError } from "../components/Toasts";
import { ChatMessages } from "../types";

const useFetchChatMsgs = (chat_id: String) => {
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessages[]>([]);


    const fetchChatMessages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/msg/chat/${chat_id}`);
            const data = await res.json();

            if (data.error) {
                throw new Error (data.error.message);
            }

            setChatMessages(data);

        } catch (error){
            
            if (error instanceof Error) {
                notifyError(error.message);
            }
        
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchChatMessages();
    }, []);

    return {chatMessages, isLoading};

}

export default useFetchChatMsgs