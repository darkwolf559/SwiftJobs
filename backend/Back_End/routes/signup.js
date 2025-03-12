import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { fullName, email, password, username, mobileNumber, dateOfBirth, gender, homeAddress, country, zipCode, college, degree, higherSecondaryEducation } = req.body;

        if (!fullName || !email || !password || !username || !mobileNumber || !dateOfBirth || !gender || !homeAddress || !country || !zipCode || !college || !degree || !higherSecondaryEducation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            fullName,
            email,
            password: hashedPassword,
            username,
            mobileNumber,
            dateOfBirth,
            gender,
            homeAddress,
            country,
            zipCode,
            college,
            degree,
            higherSecondaryEducation
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, user: { id: user._id, fullName, email, username, mobileNumber } });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
