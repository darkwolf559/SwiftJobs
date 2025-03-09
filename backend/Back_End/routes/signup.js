import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { fullName, email, password, username, mobileNumber } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ fullName, email, password: hashedPassword, username, mobileNumber });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, user: { id: user._id, fullName, email, username, mobileNumber } });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
