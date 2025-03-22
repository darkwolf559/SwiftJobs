import express from "express";
import { createJob, getJobs, getJobsByCategory, getJobById } from "../controllers/jobcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/category/:categoryId", getJobsByCategory);
router.get("/:id", getJobById);

export default router;
