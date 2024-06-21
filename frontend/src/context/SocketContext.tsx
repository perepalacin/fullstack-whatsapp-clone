import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

interface SocketContextProviderProps {
    children: ReactNode;
}

interface SocketContextType {
    socket: Socket | null;
    // setSocket: (sockets: Socket | null) => void;
    onlineUsers: string[] | null;
    // setOnlineUsers: (users: string | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocketContext must be used within an SocketContextProvider");
    }
    return context;
};


export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const {authUser} = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:5000", {
                query: {
                    userId: authUser.id,
                }
            });
            setSocket(socket);

            return () => {socket.close()};
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{socket, onlineUsers,}}>
            {children}
        </SocketContext.Provider>
    );
};