import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Attach user data to request (excluding password)

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
