import Job from "../models/job.js"; // Ensure the model exists

// Create a new job post
export const createJob = async (req, res) => {
    try {
        const { title, description, payment, location, duration, category, requiredSkills, workingHours, employerMobile, applicationDeadline } = req.body;

        if (!title || !description || !payment || !location || !duration || !category || !requiredSkills || !workingHours || !employerMobile || !applicationDeadline) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newJob = new Job({
            title,
            description,
            payment,
            location,
            duration,
            category,
            requiredSkills,
            workingHours,
            employerMobile,
            applicationDeadline,
            postedBy: req.user.id, // Ensure user authentication
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all job listings
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "fullName email");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
