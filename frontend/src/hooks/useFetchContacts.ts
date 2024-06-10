import { useEffect, useState } from "react"
import { notifyError } from "../components/Toasts";
import { publicUserDetailsProps } from "../types";

const useFetchContacts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<publicUserDetailsProps[]>([]);


    const fetchChats = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/`);
            //TODO: FETCH THE DATA OF 1 MEMBER OF THE GROUP, IF THE CONVERSATION IS PRIVATE, RENDER THAT USER
            const data = await res.json();

            if (data.error) {
                throw new Error (data.error.message);
            }
            setContacts(data);
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

    return {contacts, isLoading};

}

export default useFetchContacts