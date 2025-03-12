import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Sign Up Route
router.post("/", async (req, res) => {
    try {
        const { fullName, email, password, username, mobileNumber, dateOfBirth, gender, homeAddress, country, zipCode, college, degree, higherSecondaryEducation } = req.body;

        // Check if all required fields are provided
        if (!fullName || !email || !password || !username || !mobileNumber || !dateOfBirth || !gender || !homeAddress || !country || !zipCode || !college || !degree || !higherSecondaryEducation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the username already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Check if the email already exists
        existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            fullName,
            email,
            username,
            mobileNumber,
            password: hashedPassword,
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

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ 
            message: "User registered successfully",
            token, 
            user: { 
                id: user._id, 
                fullName, 
                email, 
                username 
            } 
        });

    } catch (error) {
        console.error("Sign-up Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
