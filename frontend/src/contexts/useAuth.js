import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, register } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (username, password) => {
        try {
            const success = await login(username, password);
            if (success) {
                setIsAuthenticated(true);
                nav('/');
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const register_user = async (username, email, password) => {    
        try {
            await register(username, email, password);
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    };

    useEffect(() => {
        get_authenticated();
    }, [window.location.pathname]);

    return (
        <AuthContext.Provider value={{isAuthenticated, loading, login_user, register_user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);