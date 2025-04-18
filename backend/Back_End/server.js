import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbconnect.js";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import profileRoutes from "./routes/profile.js";
import jobRoutes from "./routes/jobroutes.js"; 
import bookmarkRoutes from "./routes/bookmarkRoutes.js"; 
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import chatRoutes from "./routes/chatRoute.js";
import resetPasswordRoutes from "./routes/resetPassword.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/bookmarks", bookmarkRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reset-password", resetPasswordRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
