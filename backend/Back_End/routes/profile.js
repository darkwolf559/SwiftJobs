import express from "express";
import User from "../models/user.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Get User Profile
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update User Profile
router.put("/", authMiddleware, async (req, res) => {
    try {
        const { 
            fullName, dateOfBirth, gender, homeAddress, country, zipCode, 
            college, degree, higherSecondaryEducation, mobileNumber
        } = req.body;
        

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { fullName, dateOfBirth, gender, homeAddress, country, zipCode, college, degree, higherSecondaryEducation, mobileNumber },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    
    }
});

export default router;