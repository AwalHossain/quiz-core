"use client"

import { clearCookies, getLoginUserInfo } from "@/action/set-cookie";
import { createContext, useContext, useEffect, useState } from "react";



interface AuthProviderProps {
    children: React.ReactNode;
}

interface User {
    userId: string;
    username: string;
    email?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => {
        setUser(null);
        clearCookies();
    }

    const value: AuthContextType = {
        user,
        setUser,
        logout
    }

    useEffect(() => {
        const loadUser = async () => {
            const userInfo = await getLoginUserInfo();
            if (userInfo) {
                setUser({
                    userId: userInfo.userId || "",
                    username: userInfo.username || "",
                });
            }
        }
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
