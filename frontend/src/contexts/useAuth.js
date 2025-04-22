import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login, register, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
            const result = await is_authenticated();
            setIsAuthenticated(result.authenticated);
            if (result.authenticated && result.first_name) {
                setFirstName(result.first_name);
            }
        } catch (error) {
            console.error("Authentication check error:", error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (email, password) => {
        try {
            const success = await login(email, password);
            if (success) {
                const userInfo = await is_authenticated();
                setIsAuthenticated(true);
                if (userInfo.first_name) {
                    setFirstName(userInfo.first_name);
                }
                nav('/');
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const register_user = async (firstName, lastName, email, birthday, password) => {    
        try {
            const success = await register(firstName, lastName, email, birthday, password);
            return success;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    };

    const logout_user = async () => {
        try {
            const success = await logout();
            if (success) {
                setIsAuthenticated(false);
                localStorage.removeItem("username");
                sessionStorage.removeItem("username");
                localStorage.removeItem("access_token");
                sessionStorage.removeItem("access_token");
                setFirstName('');
                nav('/login');
                return true;
            }
            return false;
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        }
    };

    useEffect(() => {
        get_authenticated();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated, 
            loading, 
            firstName,
            login_user, 
            register_user, 
            logout_user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);