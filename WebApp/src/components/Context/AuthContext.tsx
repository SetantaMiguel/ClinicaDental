import { createContext, useEffect, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User{
    username: string;
    token: string;  
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isloading, setLoading] = useState(true);

    useEffect(() => {     
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {

            const userData: User = JSON.parse(savedUser);
            try {
                setUser(userData);
    
            } 
            catch (error) {
                console.log("Error al decodificar el token", error);
            }
        }
        setLoading(false);
    }, []);
    
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user_session', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_session');
        localStorage.removeItem('token');   
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading: isloading }}>
            {children}
        </AuthContext.Provider>
    );
    
}

export const useAuth = () => {
    const context = useContext(AuthContext);   
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
}
