import React, { ReactNode, createContext, useState, useContext } from "react";
import { publicUserDetailsProps } from "../types";


// Define the context type
interface AuthContextType {
    authUser: publicUserDetailsProps | null;
    setAuthUser: (user: publicUserDetailsProps | null) => void;
}

// Initialize context with undefined to enforce usage in a provider
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for safer usage
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};

// Helper function to parse local storage safely
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("chatAppUserDetails");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        return null;
    }
};
    
interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [authUser, setAuthUser] = useState<publicUserDetailsProps | null>(getStoredUser());
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};