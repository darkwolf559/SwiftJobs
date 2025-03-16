import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import { createJob, getAllJobs } from "../controllers/jobController.js";

const router = express.Router();

// Create a new job post (protected)
router.post("/create", authMiddleware, createJob);

// Get all job listings (public)
router.get("/listings", getAllJobs);

export default router;
