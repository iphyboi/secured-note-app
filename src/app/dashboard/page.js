"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    
    useEffect(() => {
        const fetchNotes = async () => {
            try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            if (!token) {
                router.push("/login");
                return;
            }

        const res = await fetch("/api/note", {
            headers: { Authorization: `Bearer ${token}`,
        },
        });
        console.log("STATUS:", res.status);
        const data = await res.json();
        console.log("DATA:", data);
        
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                router.push("/login");
            }
            throw new Error(data.error || "Failed to fetch notes");
        }
        setNotes(data);
    } catch (error) {
        console.error("Error:", error.message);
        setMessage("Error fetching notes");
    }
};
     fetchNotes();
    }, [router]);

    const handleAddNote = async () => {
        if (!newNote) return;
        const token = localStorage.getItem("token");
        try {
        const res = await fetch("/api/note", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify({ content: newNote }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add note");
        const addedNote = data;
        setNotes((prev) => [...prev, addedNote]); 
        setNewNote("");
        setMessage("Note added");
    } catch (error) {
        console.error(error.message);
        setMessage("error.message");
    }
};

    const handleUpdate = async (id) => {
        const updatedContent = prompt("Update note:", "");
        if (!updatedContent) return;
            const token = localStorage.getItem("token");
            try {
            const res = await fetch(`/api/note/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify({ content: updatedContent }),
        });
    
        if (!res.ok) throw new Error("Update failed");
        const updatedNote = await res.json();
        setNotes((prev) => prev.map((note) => (note._id === id ? updatedNote : note)));
        setMessage("Note updated");
    } catch (error) {
        console.error(error.message);
        setMessage("Error updating note");
    }
};

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
          try {
        const res = await fetch(`/api/note/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`},
        });
        
        if (!res.ok) throw new Error("Delete failed");
        
        setNotes((prev) => prev.filter((note) => note._id !== id));
        setMessage("Note deleted");
    } catch (error) {
        console.error(error.message);
        setMessage("Error deleting note");
    }
    };

    const handlelogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <button onClick={handlelogout} style={{ marginBottom: "20px" }}>
                logout
            </button>

            <div>
                <input
                type="text"
                placeholder="New note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                />
                <button onClick={handleAddNote}>Add Note</button>
            </div>
            {message && <p style={{ color: "red"}}>{message}</p>}
            {notes.length === 0 ? (
                <p>No notes yet.add one above!</p>
            ) : (
                <ul style={{ marginTop: "20px" }}>
                    {notes.map((note) => (
                        <li key={note._id} style={{marginTop: "10px" }}>
                    {note.content}{" "}
                    <button onClick={() => handleUpdate(note._id)}>Update</button>{" "}
                    <button onClick={() => handleDelete(note._id)}>Delete</button>
                    </li>
                    ))}
                </ul>
            )}
            </div>
    );
            }