import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/usercontrol.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserProfile);
router.put("/", authMiddleware, updateUserProfile);

export default router;
