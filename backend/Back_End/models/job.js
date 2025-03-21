import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    payment: { 
        type: Number, 
        required: true,
        min: [0, 'Payment must be a positive number'] 
    },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    jobCategory: { type: String, required: true },
    requiredSkills: { type: String, required: true },
    workingHours: { type: String, required: true },
    employerName: { type: String, required: false },
    employerEmail: { type: String, required: false },
    employerPhone: { type: String, required: false },
    employerWebsite: { type: String, required: false },
    applicationDeadline: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
