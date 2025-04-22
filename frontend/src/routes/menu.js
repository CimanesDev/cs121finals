import { useEffect, useState } from "react";
import { get_notes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import "./menu.css";

const Menu = () => {
    const [notes, setNotes] = useState([]);
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [username, setUsername] = useState("User");
    const nav = useNavigate();


    useEffect(() => {

        const storedUsername = localStorage.getItem("username") || sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Update time and date
        const updateDateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const fetchedNotes = await get_notes();
                setNotes(fetchedNotes || []);
            } catch (error) {
                console.error("Error fetching notes:", error);
                setNotes([]);
            }
        };
        fetchNotes();
    }, []);

    const handleLogout = async () => {
        try {
            const success = await logout();
            if (success) {
                localStorage.removeItem("username");
                sessionStorage.removeItem("username");
                nav('/login');
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1 className="welcome-title">Hello, <span>{username}</span>!</h1>
                    <p className="datetime">{currentDate} • {currentTime}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>Sign Out</button>
            </header>

            <main className="dashboard-content">
                <h2 className="dashboard-title">Your Notes</h2>
                
                {notes && notes.length > 0 ? (
                    <div className="notes-grid">
                        {notes.map((note, index) => (
                            <div 
                                className="note-card" 
                                key={note.id || index} 
                                style={{"--index": index}}
                            >
                                <p className="note-content">{note.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-notes">
                        <div className="empty-notes-icon">📝</div>
                        <h3 className="empty-notes-text">No notes yet</h3>
                        <p className="empty-notes-subtext">Your notes will appear here once you create them.</p>
                    </div>
                )}
            </main>

            <footer className="dashboard-footer">
                <p>Built with ♥ by <span className="brand">@CimanesDev</span></p>
            </footer>
        </div>
    );
};

export default Menu;