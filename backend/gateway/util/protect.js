import jwt from "jsonwebtoken";

// Verifies the session token (cookie or Bearer header) issued by the auth
// service, then attaches the user so proxyWithHeader can forward it downstream.
export const protect = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userID: decoded.id };
        next();
    } catch (error) {
        console.error("Error in protect middleware:", error);
        return res.status(401).json({ error: "Invalid or expired session" });
    }
};
