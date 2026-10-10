import { useQuery } from "@tanstack/react-query";
import { getUser } from "../pages/Auth/getUser";
import React, { createContext, useContext } from "react";

interface AuthProviderType {
    user: any;
    loading: boolean;
}

const AuthContext = createContext<AuthProviderType | null>(null);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        retry: false,
    });

    const user = data || null;

    return (
        <AuthContext.Provider value={{ user, loading: isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);