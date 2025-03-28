import express from "express";
import {
  createApplication,
  getJobApplications,
  getEmployerApplications,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus
} from "../controllers/applicationContrtoller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Create a new application (already handled in job routes)
// POST /api/jobs/:jobId/apply

// Get all applications for a specific job (employers only)
router.get("/job/:jobId", authMiddleware, getJobApplications);

// Get all applications for the logged-in employer
router.get("/employer", authMiddleware, getEmployerApplications);

// Get all applications made by the logged-in user
router.get("/user", authMiddleware, getUserApplications);

// Get specific application details
router.get("/:applicationId", authMiddleware, getApplicationById);

// Update application status (employers only)
router.put("/:applicationId/status", authMiddleware, updateApplicationStatus);

export default router;