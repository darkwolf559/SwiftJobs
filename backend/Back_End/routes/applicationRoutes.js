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

router.get("/job/:jobId", authMiddleware, getJobApplications);
router.get("/employer", authMiddleware, getEmployerApplications);
router.get("/user", authMiddleware, getUserApplications);
router.get("/:applicationId", authMiddleware, getApplicationById);
router.put("/:applicationId/status", authMiddleware, updateApplicationStatus);

export default router;