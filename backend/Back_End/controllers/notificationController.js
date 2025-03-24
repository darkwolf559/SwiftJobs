import Notification from "../models/notification.js";
import User from "../models/user.js";
import admin from "firebase-admin";
import serviceAccount from "../config/firebaseServiceKey.json" with { type: "json" };
import Job from "../models/job.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const createNotification = async (title, body, type, recipientId, jobId = null) => {
  try {
    const notification = new Notification({
      title,
      body,
      type,
      recipient: recipientId,
      relatedJob: jobId,
      data: { jobId }
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const sendPushNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('relatedJob', 'jobTitle');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendJobApplicationNotification = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userName, userEmail, userPhone } = req.body;
    const userId = req.user.id;


    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const employer = await User.findById(job.employer);
    if (!employer) {
      console.log("Employer not found");

      return res.status(200).json({ message: "Application submitted successfully" });
    }

    if (!employer.fcmToken) {
      console.log("Employer doesn't have FCM token");
    }

    const notification = await createNotification(
      "New Job Application",
      `${userName} has applied for your job: ${job.jobTitle}`,
      "JOB_APPLICATION",
      employer._id,
      jobId
    );

    if (employer.fcmToken) {
      await sendPushNotification(
        employer.fcmToken,
        "New Job Application",
        `${userName} has applied for your job: ${job.jobTitle}`,
        {
          type: "JOB_APPLICATION",
          jobId: jobId.toString(),
          applicantName: userName,
          applicantEmail: userEmail,
          applicantPhone: userPhone
        }
      );
    }

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error sending job application notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};