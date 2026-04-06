import { dbConnect } from "@/lib/mongodb";
import Note from "@/models/Note";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const token = req.headers.get("authorization")?.split(" ")[1];
        const user = verifyToken(token);

        if (!user) return NextResponse.json({ error: "Unauthorized"}, { status: 401});
        

        const { content } = await req.json();
        const note = await Note.findOneAndUpdate(
            { _id: id, userId: user.id || user._id },
            { content },
            { returnDocument: 'after'}
        );

        if (!note) return NextResponse.json({ error: "Note not found"}, { status: 404});

        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500});
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const token = req.headers.get("authorization")?.split(" ")[1];
        const user = verifyToken(token); 
        if(!user) return NextResponse.json({ error: "Unauthorized"}, { status: 401});

         const note = await Note.findById(id);
         if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404});
        
         const isOwner = note.userId.toString() === (user.id || user._id);
         const isAdmin = user.role === 'admin';
         if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403});
         }
        await Note.findByIdAndDelete(id);

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200});
        
    } catch (error) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ error: "Deleted failed" }, { status: 500});
    }
}