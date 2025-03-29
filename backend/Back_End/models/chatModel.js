import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  application: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Application", 
    required: true,
    unique: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  messages: [messageSchema],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

chatSchema.index({ job: 1, applicant: 1, employer: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;