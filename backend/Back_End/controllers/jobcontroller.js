import Job from "../models/job.js";
import { createNotification, sendPushNotification } from "./notificationController.js";
import User from "../models/user.js";

export const createJob = async (req, res) => {
    try {
        const { jobTitle, jobDescription, payment, location, duration, jobCategory, requiredSkills, workingHours, 
            employerName, employerEmail, employerPhone, employerWebsite, 
            applicationDeadline 
        } = req.body;

        const job = new Job({
            jobTitle,
            jobDescription,
            payment,
            location,
            duration,
            jobCategory,
            requiredSkills,
            workingHours, 
            employerName, 
            employerEmail, 
            employerPhone, 
            employerWebsite, 
            applicationDeadline,
            createdBy: req.user.id,
        });

        const savedJob = await job.save();
        
        const users = await User.find({ _id: { $ne: req.user.id } });
  
        const notificationPromises = users.map(async (user) => {
            await createNotification(
                "New Job Posted", 
                `A new job "${jobTitle}" has been posted in ${location}`,
                "JOB_POSTED",
                user._id,
                savedJob._id
            );
            
            if (user.fcmToken) {
                try {
                    await sendPushNotification(
                        user.fcmToken,
                        "New Job Posted",
                        `A new job "${jobTitle}" has been posted in ${location}`,
                        { 
                            jobId: savedJob._id.toString(),
                            type: "JOB_POSTED"
                        }
                    );
                } catch (err) {
                    console.error(`Failed to send push notification to user ${user._id}:`, err);
                }
            }
        });
        
        await Promise.allSettled(notificationPromises);
        
        res.status(201).json({ message: "Job posted successfully", job: savedJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("createdBy", "fullName email");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getJobsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const jobs = await Job.find({ jobCategory: categoryId }).populate("createdBy", "fullName email");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate("createdBy", "fullName email");
        
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


