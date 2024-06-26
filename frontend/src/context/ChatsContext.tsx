import { ReactNode, createContext, useContext, useState } from "react";
import { OnGoingChatsProps } from "../types";


// Define the context type
interface ChatContextType {
    selectedChat: String | null;
    setSelectedChat: (openChats: String | null) => void;
    onGoingChats: OnGoingChatsProps[] | null;
    setOnGoingChats: (openChats: OnGoingChatsProps[] | null) => void;
    systemAdminId: string; //Variable equal to process.env.SYSTEM_USER_ID
}


export const ChatsContext = createContext<ChatContextType | undefined>(undefined);



export const useChatsContext = (): ChatContextType => {
    const context = useContext(ChatsContext);
    if (!context) {
        throw new Error("useChatsContext must be used within an ChatsContextProvider");
    }
    return context;
};

interface ChatsContextProviderProps {
    children: ReactNode;
}

export const ChatsContextProvider: React.FC<ChatsContextProviderProps> = ({ children }) => {
    // State that holds the info about the selected chat
    const [selectedChat, setSelectedChat] = useState<String | null>(null);
    // State that holds the info about all the chats the user currently has open.
    const [onGoingChats, setOnGoingChats] = useState<OnGoingChatsProps[] | null>(null);

    const systemAdminId = 'a9a7eac7-636f-489a-b892-6d65c10381f0';
    return (
        <ChatsContext.Provider value={{systemAdminId, selectedChat, setSelectedChat, onGoingChats, setOnGoingChats }}>
            {children}
        </ChatsContext.Provider>
    );
};