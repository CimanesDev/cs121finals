import { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import "./menu.css";

const Menu = () => {
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [displayName, setDisplayName] = useState("there");
    const { logout_user } = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        const storedFirstName = localStorage.getItem('first_name');
        if (storedFirstName) {
            setDisplayName(storedFirstName);
        }

        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('first_name');
        await logout_user();
        nav('/login');
    };

    return (
        <div className="menu-container">
            <div className="menu-card">
                <div className="menu-header">
                    <h1>Welcome back, <span>{displayName}</span>!</h1>
                    <p className="datetime">{currentDate} • {currentTime}</p>
                </div>
                <button className="menu-button" onClick={handleLogout}>Sign Out</button>
                <div className="menu-footer">
                    <p>Built with ♥ by <span className="brand">@CimanesDev</span></p>
                </div>
            </div>
        </div>
    );
};

export default Menu;