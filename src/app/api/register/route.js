import {dbConnect} from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
    await dbConnect();

    const { username, password } = await req.json();
    console.log("DEBUG Username:", username);
    console.log("DEBUG PASSWORD:", password);
    if (!username || !password) {
        return NextResponse.json({message: "Missing username or password"}, { status: 400 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return NextResponse.json({message: "User already exist"}, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({username, password: hashedPassword});

    return NextResponse.json({ 
        message: "Registration Successful",
        user: {
            id: newUser._id,
        },
    });
    } catch (error) {
        return NextResponse.json({ error: "server error"}, { status: 500});
    }
}