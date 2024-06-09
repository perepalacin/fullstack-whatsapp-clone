import { useEffect, useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import { notifyError } from "../assets/components/Toasts";

const useFetchChats = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [chats, setChats] = useState([]);


    const fetchChats = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/chats`);
            //TODO: FETCH THE DATA OF 1 MEMBER OF THE GROUP, IF THE CONVERSATION IS PRIVATE, RENDER THAT USER
            const data = await res.json();

            if (data.error) {
                throw new Error (data.error.message);
                }

                setChats(data);

        } catch (error){
            
            if (error instanceof Error) {
                notifyError(error.message);
            }
        
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchChats();
    }, []);

    return {chats, isLoading};

}

export default useFetchChats