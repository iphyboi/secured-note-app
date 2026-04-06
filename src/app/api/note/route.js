import { dbConnect } from "@/lib/mongodb";
import Note from "@/models/Note";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { unauthorized } from "next/navigation";

export async function GET(req) {
    try {
        await dbConnect();

        const token = req.headers.get("authorization")?.split(" ")[1];
        const user = verifyToken(token);
        if (!user) return NextResponse.json({ error: "unauthorized"}, { status: 401 });

        const notes = await Note.find({ userId: user.id }).sort({ createdAt: -1 });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: error.message}, { status: 500});
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        const token = req.headers.get("authorization")?.split(" ")[1];
        const user = verifyToken(token);
        console.log("CHECKING USER DATA:", user);
        if(!user) return NextResponse.json({ error: "unauthorized"}, { status: 401 });

        const { content } = await req.json();
        if (!content || content.trim() === " ") {
            return NextResponse.json({ error: "Content cannot be empty"}, { status: 400});
        }
        const note = await Note.create({ content, userId: user._id || user.id });
        return NextResponse.json(note);
    } catch (error) {
        console.error("POST ERROR:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json({ error: messages.join(" ")}, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create note" }, { status: 500});
    }
}