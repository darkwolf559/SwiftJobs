import express from "express";
import { createJob, getJobs } from "../controllers/jobcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.get("/", getJobs);

export default router;
