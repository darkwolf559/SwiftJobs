import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import signupRoutes from "./routes/signup.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/signup", signupRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
