import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI) { 
    throw new Error("please define the MONGO_URI environment variable inside .env.local");
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            console.log("MongoDB Atlas connected successfully");
            return mongoose;
        }).catch((err) => {
            console.error("MongoDB connection Error:", err);
            throw err;
        });
        }

    cached.conn = await cached.promise;
    return cached.conn;
}