import Job from "../models/job.js";

export const createJob = async (req, res) => {
    try {
        const { jobTitle, jobDescription, payment, location, duration, jobCategory, requiredSkills, workingHoursPerDay, employerMobile, applicationDeadline } = req.body;

        const job = new Job({
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
            createdBy: req.user.id,
        });

        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (error) {
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
