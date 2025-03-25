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

export const createNotification = async (title, body, type, recipientId, jobId = null, data = {}) => {
  try {
    const notification = new Notification({
      title,
      body,
      type,
      recipient: recipientId,
      relatedJob: jobId,
      data: data
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


export const getApplicationDetails = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId)
      .populate('relatedJob');
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    if (notification.type !== 'JOB_APPLICATION') {
      return res.status(400).json({ message: "This notification is not a job application" });
    }
    
    const applicantId = notification.data.applicantId;
    const applicant = await User.findById(applicantId).select('-password');
    
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    
    const applicantData = {
      id: applicant._id,
      name: applicant.fullName || applicant.username,
      email: applicant.email,
      phone: applicant.phoneNumber || applicant.mobileNumber,
      gender: applicant.gender,
      address: applicant.homeAddress,
      country: applicant.country,
      zipCode: applicant.zipCode,
      education: formatEducation(applicant),
      skills: applicant.skills ? applicant.skills.join(', ') : '',
      applicationDate: notification.createdAt,
      jobTitle: notification.relatedJob ? notification.relatedJob.jobTitle : 'Unknown Job'
    };

    if (applicant.profilePhoto && applicant.profilePhoto.length > 0) {
      applicantData.profilePhotoUrl = `data:${applicant.profilePhotoType || 'image/jpeg'};base64,${applicant.profilePhoto.toString('base64')}`;
    }

    if (applicant.resume && applicant.resume.length > 0) {
      applicantData.resumeUrl = `data:${applicant.resumeType || 'application/pdf'};base64,${applicant.resume.toString('base64')}`;
      applicantData.resumeName = applicant.resumeName || 'resume.pdf';
    }
    
    console.log('Applicant data prepared:', {
      id: applicantData.id,
      name: applicantData.name,
      hasPhoto: !!applicantData.profilePhotoUrl,
      hasResume: !!applicantData.resumeUrl,
      hasAddress: !!applicantData.address,
      hasEducation: !!applicantData.education,
      hasSkills: !!applicantData.skills
    });
    
    res.json(applicantData);
  } catch (error) {
    console.error("Error getting application details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

function formatEducation(applicant) {
  const educationParts = [];
  
  if (applicant.college) {
    educationParts.push(`College: ${applicant.college}`);
  }
  
  if (applicant.highSchool) {
    educationParts.push(`High School: ${applicant.highSchool}`);
  }
  
  if (applicant.higherSecondaryEducation) {
    educationParts.push(`Higher Secondary: ${applicant.higherSecondaryEducation}`);
  }
  
  return educationParts.join('\n');
}

export const sendJobApplicationNotification = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { 
      userName = user.fullName || user.username,
      userEmail = user.email,
      userPhone = user.phoneNumber || user.mobileNumber,
      userGender = user.gender,
      userAddress = user.homeAddress,
      userEducation,
      userSkills 
    } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const employer = await User.findById(job.employer);
    if (!employer) {
      console.log("Employer not found for job ID:", jobId);
      return res.status(404).json({ message: "Employer not found" });
    }

    const notificationData = {
      jobId: jobId.toString(),
      jobTitle: job.jobTitle,
      applicantId: userId.toString(), 
      applicantName: userName,
      applicantEmail: userEmail,
      applicantPhone: userPhone,
      applicantGender: userGender,
      applicantAddress: userAddress,
      applicantEducation: userEducation || formatEducation(user),
      applicantSkills: userSkills || (user.skills ? user.skills.join(', ') : '')
    };

    console.log("Creating job application notification with data:", {
      applicantId: notificationData.applicantId,
      jobId: notificationData.jobId,
      dataComplete: !!notificationData.applicantAddress && 
                  !!notificationData.applicantEducation && 
                  !!notificationData.applicantSkills
    });

    try {
      await createNotification(
        "New Job Application",
        `${userName} has applied for your job: ${job.jobTitle}`,
        "JOB_APPLICATION",
        employer._id,
        jobId,
        notificationData
      );
      console.log("Job application notification created in database");
    } catch (notificationError) {
      console.error("Failed to create notification in database:", notificationError);
    }
    
    if (employer.fcmToken) {
      try {
        await sendPushNotification(
          employer.fcmToken,
          "New Job Application",
          `${userName} has applied for your job: ${job.jobTitle}`,
          notificationData
        );
        console.log("Push notification sent to employer");
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    } else {
      console.log("Employer doesn't have FCM token - push notification not sent");
    }

    res.status(200).json({ 
      message: "Application submitted successfully"
    });
  } catch (error) {
    console.error("Error in job application notification process:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};