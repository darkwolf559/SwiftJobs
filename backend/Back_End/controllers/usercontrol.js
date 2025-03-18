import User from "../models/user.js";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { username, email, mobileNumber, password } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash the password with bcrypt instead of bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with only required fields
        const user = new User({
            username,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("Login attempt with:", { email: req.body.email });
        
        const { email, password } = req.body;
        
        // Check if the email exists in database
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        console.log("User found:", { id: user._id, email: user.email });
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return success with token and minimal user info
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
