import jwt from "jsonwebtoken";

const SECRET = "YOUR_SECRET_KEY";

export function signToken(payload) {
    return jwt.sign(payload,
         SECRET, { expiresIn: "1h"} );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}