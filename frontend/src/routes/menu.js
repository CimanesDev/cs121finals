import { useEffect, useState } from "react";
import { get_notes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const Menu = () => {

    const [notes, setNotes] = useState([])
    const nav = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await get_notes()
            setNotes(notes)
        }
        fetchNotes();

    }, [])

    const handleLogout = async () => {
        const success = await logout();
        if(success) {
            nav('/login')
        }
    }

    return (
        <div> 
            <div>
                {notes.map((note) => {
                    return <h2>{note.description}</h2>
                })}
            </div>
            <div>
            <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default Menu