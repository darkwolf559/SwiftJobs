import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { 
      type: Object, 
      default: {} 
    },
    type: { 
      type: String, 
      required: true,
      enum: ['JOB_APPLICATION', 'JOB_POSTED', 'APPLICATION_STATUS', 'NEW_MESSAGE', 'GENERAL','CHAT_MESSAGE']
    },
    read: { type: Boolean, default: false },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: false },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;