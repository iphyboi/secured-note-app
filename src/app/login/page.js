"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [message, setMessage ] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            setMessage(errorData.error || "Login failed");
            return;
        }
        

        const data = await res.json();
        console.log("Token:", data.token);
        if (!data.token) {
            setMessage("Token not received");
            return;
        }
            localStorage.setItem("token", data.token);
            router.push('/dashboard');
        } catch (err) {
            console.error("Login error:", err);
            setMessage(data.error || "Login failed")
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            <p>
                No account? <a href="/register">Register here</a>
                </p>
            {message && <p>{message}</p>}
        </div>
    );
}