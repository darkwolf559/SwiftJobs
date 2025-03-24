import express from "express";
import { createJob, getJobs, getJobsByCategory, getJobById,  } from "../controllers/jobcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendJobApplicationNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/create", authMiddleware, createJob);
router.get("/", getJobs);
router.get("/category/:categoryId", getJobsByCategory);
router.get("/:id", getJobById);
router.post("/:jobId/apply", authMiddleware, sendJobApplicationNotification);
export default router;
