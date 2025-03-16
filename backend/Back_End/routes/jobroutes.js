import express from "express";
import Job from "../models/Job.js";
import { protect } from "../middleware/authmiddleware.js"; 

const router = express.Router();

// @route    POST /api/jobs
// @desc     Create a new job
// @access   Private (Only logged-in users can post)
router.post("/", protect, async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      payment,
      location,
      duration,
      jobCategory,
      requiredSkills,
      workingHoursPerDay,
      employerMobile,
      applicationDeadline,
    } = req.body;

    const newJob = new Job({
      jobTitle,
      jobDescription,
      payment,
      location,
      duration,
      jobCategory,
      requiredSkills,
      workingHoursPerDay,
      employerMobile,
      applicationDeadline,
      createdBy: req.user._id, 
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// @route    GET /api/jobs
// @desc     Get all jobs
// @access   Public
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
