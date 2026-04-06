import { dbConnect } from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/auth";

export async function POST(req) {
    try {
    await dbConnect();
    const { username, password } = await req.json();
    

    if (!username || !password) {
        return NextResponse.json({message: "MIssing username or password"}, { status: 400});
    }

    const user = await User.findOne({ username });

    if (!user) {
        return NextResponse.json({ message: "User not found"}, { status: 404 });
    }

     const isMatch = await bcrypt.compare(password, user.password);

     if (!isMatch) {
        return NextResponse.json({ message: "invalid credentials" }, { status: 401 });
     }

     const token = signToken({
        id: user._id.toString(),
        username: user.username,
        role: user.role
     });

     return NextResponse.json({
        message: "Login successful",
        token,
     }, { status: 200});

    } catch (error) {
        console.error("DETAILED LOGIN ERROR:", error);
        return NextResponse.json({ error: "Server error"}, { status: 500});
    }
}