import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String },
  applicantGender: { type: String },
  applicantAddress: { type: String },
  applicantEducation: { type: String },
  applicantSkills: { type: String },
  feedback: { type: String },
  relatedNotification: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Notification" 
  },
}, { timestamps: true });

// Create a compound index to ensure a user can only apply once to each job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;