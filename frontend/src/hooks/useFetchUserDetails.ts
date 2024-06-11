import { useEffect, useState } from "react"
import { notifyError } from "../components/Toasts";
import { OnGoingChatsProps, publicUserDetailsProps } from "../types";

const useFetchUserDetails = (user_id: String) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<publicUserDetailsProps>();


    const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/user/${user_id}`);
            //TODO: FETCH THE DATA OF 1 MEMBER OF THE GROUP, IF THE CONVERSATION IS PRIVATE, RENDER THAT USER
            const data = await res.json();

            if (data.error) {
                throw new Error (data.error.message);
            }

            setUserDetails(data[0]);

        } catch (error){
            
            if (error instanceof Error) {
                notifyError(error.message);
            }
        
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return {userDetails, isLoading};

}

export default useFetchUserDetails