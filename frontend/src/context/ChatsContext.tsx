import { ReactNode, createContext, useContext, useState } from "react";
import { ChatsContextStateProps } from "../types";


// Define the context type
interface ChatContextType {
    selectedChat: ChatsContextStateProps | null;
    setSelectedChat: (openChats: ChatsContextStateProps | null) => void;
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
    const [selectedChat, setSelectedChat] = useState<ChatsContextStateProps | null>(null);

    return (
        <ChatsContext.Provider value={{ selectedChat, setSelectedChat }}>
            {children}
        </ChatsContext.Provider>
    );
};