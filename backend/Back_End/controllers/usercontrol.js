import User from "../models/user.js";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { username, email, mobileNumber, password } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with default profile fields
        const user = new User({
            username,
            email,
            mobileNumber,
            password: hashedPassword,
            // Initialize other profile fields with defaults
            fullName: '', // Empty string instead of being required
            gender: '',
            dateOfBirth: null,
            phoneNumber: '',
            homeAddress: '',
            country: '',
            zipCode: '',
            college: '',
            highSchool: '',
            higherSecondaryEducation: ''
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the email exists in database
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        
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
                email: user.email,
                username: user.username
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

export const editUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Destructure all possible profile fields
        const {
            fullName,
            gender,
            dateOfBirth,
            phoneNumber,
            homeAddress,
            country,
            zipCode,
            college,
            highSchool,
            higherSecondaryEducation
        } = req.body;

        // Find user and update profile
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {
                fullName,
                gender,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                phoneNumber,
                homeAddress,
                country,
                zipCode,
                college,
                highSchool,
                higherSecondaryEducation
            }, 
            { 
                new: true,        // Return the updated document
                runValidators: true  // Run mongoose validation
            }
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating profile', 
            error: error.message 
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error changing password', 
            error: error.message 
        });
    }
};