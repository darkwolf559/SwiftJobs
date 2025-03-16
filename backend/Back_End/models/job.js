import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    payment: { type: Number, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    jobCategory: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    workingHoursPerDay: { type: Number, required: true },
    employerMobile: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Employer's ID
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
