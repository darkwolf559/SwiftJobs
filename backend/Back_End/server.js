import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbconnect.js";
import signupRoutes from "./routes/signup.js";
import loginRoutes from "./routes/login.js";

dotenv.config();
const app = express();

dbConnect();

app.use(express.json());

app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
