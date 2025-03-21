import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbconnect.js";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import profileRoutes from "./routes/profile.js";
import jobRoutes from "./routes/jobroutes.js"; 
import bookmarkRoutes from "./routes/bookmarkRoutes.js"; 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/bookmarks", bookmarkRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
