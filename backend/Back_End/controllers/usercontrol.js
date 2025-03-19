import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Registration Function
export const registerUser = async (req, res) => {
    try {
        const { username, email, mobileNumber, password, fullName } = req.body;

        console.log('Registration request received:', { 
            username, 
            email, 
            mobileNumber, 
            fullName,
            passwordProvided: !!password
        });

     
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                missingFields: {
                    username: !username,
                    email: !email,
                    password: !password,
                    fullName: !fullName
                } 
            });
        }
        
       
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists with this email" });

        userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: "Username is already taken" });

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
         
            mobileNumber: mobileNumber || undefined,
            phoneNumber: mobileNumber || '',
        });

        await user.save();

        console.log('User registered successfully:', { id: user._id, username: user.username });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        
 
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            
            
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            
            return res.status(400).json({ 
                message: "Validation error", 
                errors: validationErrors 
            });
        }
        
       
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `Duplicate value for ${field}`,
                field: field
            });
        }
        
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User Login Function
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

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                email: user.email,
                username: user.username,
                fullName: user.fullName
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

export const updateUserProfile = async (req, res) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
      ).select("-password");
      
      res.json(user);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };