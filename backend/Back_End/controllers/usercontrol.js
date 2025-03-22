import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadProfilePhoto = upload.single('profilePhoto');
export const uploadCoverPhoto = upload.single('coverPhoto');
export const uploadResume = upload.single('resume');
export const uploadBothPhotos = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);

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

        const userData = user.toObject();
        delete userData.password; 
        
        if (user.profilePhoto) {
            userData.profilePhotoUrl = `data:${user.profilePhotoType};base64,${user.profilePhoto.toString('base64')}`;
            delete userData.profilePhoto; 
        }
        
        if (user.coverPhoto) {
            userData.coverPhotoUrl = `data:${user.coverPhotoType};base64,${user.coverPhoto.toString('base64')}`;
            delete userData.coverPhoto; 
        }
        
        if (user.resume) {
            userData.resumeUrl = `data:${user.resumeType};base64,${user.resume.toString('base64')}`;
            userData.resumeName = user.resumeName;
            delete userData.resume; 
        }

        res.json({ 
            token, 
            user: userData
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        const userData = user.toObject();
        
        if (user.profilePhoto) {
            userData.profilePhotoUrl = `data:${user.profilePhotoType};base64,${user.profilePhoto.toString('base64')}`;
            delete userData.profilePhoto; 
        }
        
        if (user.coverPhoto) {
            userData.coverPhotoUrl = `data:${user.coverPhotoType};base64,${user.coverPhoto.toString('base64')}`;
            delete userData.coverPhoto; 
        }
        
        if (user.resume) {
            userData.resumeUrl = `data:${user.resumeType};base64,${user.resume.toString('base64')}`;
            userData.resumeName = user.resumeName;
            delete userData.resume; 
        }
        
        res.json(userData);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { 
            dateOfBirth,
            ...updates 
        } = req.body;
        
        delete updates.profilePhotoBase64;
        delete updates.profilePhotoType;
        delete updates.coverPhotoBase64;
        delete updates.coverPhotoType;
        delete updates.resumeBase64;
        delete updates.resumeType;
        delete updates.resumeName;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update user properties
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                user[key] = updates[key];
            }
        });
        
        if (dateOfBirth) {
            user.dateOfBirth = new Date(dateOfBirth);
        }
        
        if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
            user.profilePhoto = req.files.profilePhoto[0].buffer;
            user.profilePhotoType = req.files.profilePhoto[0].mimetype;
        }
        else if (req.file && req.file.fieldname === 'profilePhoto') {
            user.profilePhoto = req.file.buffer;
            user.profilePhotoType = req.file.mimetype;
        }

        if (req.files && req.files.coverPhoto && req.files.coverPhoto[0]) {
            user.coverPhoto = req.files.coverPhoto[0].buffer;
            user.coverPhotoType = req.files.coverPhoto[0].mimetype;
        }
        else if (req.file && req.file.fieldname === 'coverPhoto') {
            user.coverPhoto = req.file.buffer;
            user.coverPhotoType = req.file.mimetype;
        }
        
        if (req.file && req.file.fieldname === 'resume') {
            user.resume = req.file.buffer;
            user.resumeType = req.file.mimetype;
            user.resumeName = req.file.originalname;
        }

        await user.save();
        
        const userData = user.toObject();
        delete userData.password;
        
        if (user.profilePhoto) {
            userData.profilePhotoUrl = `data:${user.profilePhotoType};base64,${user.profilePhoto.toString('base64')}`;
            delete userData.profilePhoto;
        }
        
        if (user.coverPhoto) {
            userData.coverPhotoUrl = `data:${user.coverPhotoType};base64,${user.coverPhoto.toString('base64')}`;
            delete userData.coverPhoto;
        }
        
        if (user.resume) {
            userData.resumeUrl = `data:${user.resumeType};base64,${user.resume.toString('base64')}`;
            userData.resumeName = user.resumeName;
            delete userData.resume;
        }
        
        res.json(userData);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const { profilePhotoBase64, profilePhotoType } = req.body;
        
        if (!profilePhotoBase64 || !profilePhotoType) {
            return res.status(400).json({ message: "Profile photo data is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const base64Data = profilePhotoBase64.replace(/^data:image\/\w+;base64,/, '');
        user.profilePhoto = Buffer.from(base64Data, 'base64');
        user.profilePhotoType = profilePhotoType;
        
        await user.save();
        
        res.json({
            message: "Profile photo updated successfully",
            profilePhotoUrl: `data:${user.profilePhotoType};base64,${user.profilePhoto.toString('base64')}`
        });
    } catch (error) {
        console.error("Update profile photo error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateCoverPhoto = async (req, res) => {
    try {
        const { coverPhotoBase64, coverPhotoType } = req.body;
        
        if (!coverPhotoBase64 || !coverPhotoType) {
            return res.status(400).json({ message: "Cover photo data is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const base64Data = coverPhotoBase64.replace(/^data:image\/\w+;base64,/, '');
        user.coverPhoto = Buffer.from(base64Data, 'base64');
        user.coverPhotoType = coverPhotoType;
        
        await user.save();
        
        res.json({
            message: "Cover photo updated successfully",
            coverPhotoUrl: `data:${user.coverPhotoType};base64,${user.coverPhoto.toString('base64')}`
        });
    } catch (error) {
        console.error("Update cover photo error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateResume = async (req, res) => {
    try {
        const { resumeBase64, resumeType, resumeName } = req.body;
        
        if (!resumeBase64 || !resumeType) {
            return res.status(400).json({ message: "Resume data is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const base64Data = resumeBase64.replace(/^data:.*?;base64,/, '');
        user.resume = Buffer.from(base64Data, 'base64');
        user.resumeType = resumeType;
        user.resumeName = resumeName || 'resume';
        
        await user.save();
        
        res.json({
            message: "Resume updated successfully",
            resumeName: user.resumeName
        });
    } catch (error) {
        console.error("Update resume error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};