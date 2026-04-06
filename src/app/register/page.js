"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [ username, setUsername] = useState("");
    const [ password, setPassword ] = useState("");
    const [ message, setMessage ] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        const res = await fetch('/api/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password}),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Registration successful! redirect to login...");
            setTimeout(() => router.push("/login"), 1500);
        } else {
            setMessage(data.error || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />

                 <input
                 type="password"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 />
                 <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
