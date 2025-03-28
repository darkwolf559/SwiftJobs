import Application from "../models/application.js";
import Job from "../models/job.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { createNotification, sendPushNotification } from "./notificationController.js";

// Create a new job application
export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    // Check if user has already applied to this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });
    
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job"
      });
    }
    
    // Get user and job info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    // Extract data from request or default to user profile
    const { 
      userName = user.fullName || user.username,
      userEmail = user.email,
      userPhone = user.phoneNumber || user.mobileNumber,
      userGender = user.gender,
      userAddress = user.homeAddress,
      userEducation,
      userSkills 
    } = req.body;
    
    // Create application
    const application = new Application({
      job: jobId,
      applicant: userId,
      applicantName: userName,
      applicantEmail: userEmail,
      applicantPhone: userPhone,
      applicantGender: userGender,
      applicantAddress: userAddress,
      applicantEducation: userEducation,
      applicantSkills: userSkills,
      status: 'Pending'
    });
    
    // Save application
    await application.save();
    
    // Create notification for employer
    const employer = await User.findById(job.employer);
    if (!employer) {
      console.log("Employer not found for job ID:", jobId);
      return res.status(200).json({ 
        message: "Application submitted successfully",
        application
      });
    }
    
    // Notification data
    const notificationData = {
      jobId: jobId.toString(),
      jobTitle: job.jobTitle,
      applicantId: userId.toString(), 
      applicantName: userName,
      applicantEmail: userEmail,
      applicantPhone: userPhone,
      applicantGender: userGender,
      applicantAddress: userAddress,
      applicantEducation: userEducation,
      applicantSkills: userSkills
    };
    
    // Create notification in database
    const notification = await createNotification(
      "New Job Application",
      `${userName} has applied for your job: ${job.jobTitle}`,
      "JOB_APPLICATION",
      employer._id,
      jobId,
      notificationData
    );
    
    // Update application with notification reference
    application.relatedNotification = notification._id;
    await application.save();
    
    // Send push notification if possible
    if (employer.fcmToken) {
      try {
        await sendPushNotification(
          employer.fcmToken,
          "New Job Application",
          `${userName} has applied for your job: ${job.jobTitle}`,
          {
            ...notificationData,
            type: "JOB_APPLICATION",
            notificationId: notification._id.toString()
          }
        );
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }
    
    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications for a job
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify the job exists and the user is the employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You are not the employer for this job" });
    }
    
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'fullName email phoneNumber gender homeAddress profilePhotoUrl')
      .populate('job', 'jobTitle')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications for the current employer
export const getEmployerApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all jobs created by this employer
    const employerJobs = await Job.find({ employer: userId });
    const jobIds = employerJobs.map(job => job._id);
    
    if (jobIds.length === 0) {
      return res.json([]);
    }
    
    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'fullName email phoneNumber gender homeAddress profilePhotoUrl')
      .populate('job', 'jobTitle employerName location')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("Error fetching employer applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications made by the current user
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const applications = await Application.find({ applicant: userId })
      .populate('job', 'jobTitle employerName location jobCategory payment')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get specific application details
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    
    const application = await Application.findById(applicationId)
      .populate('applicant', 'fullName email phoneNumber gender homeAddress profilePhotoUrl')
      .populate('job', 'jobTitle employerName location jobCategory payment');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    // Only allow the applicant or the employer to view
    const job = await Job.findById(application.job._id);
    if (
      application.applicant._id.toString() !== userId && 
      job.employer.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized to view this application" });
    }
    
    res.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.id;
    
    // Find the application
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    // Check if the user is the employer
    const job = await Job.findById(application.job._id);
    if (job.employer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Only the employer can update application status" });
    }
    
    // Update the application
    application.status = status;
    if (feedback) {
      application.feedback = feedback;
    }
    
    await application.save();
    
    // Send notification to the applicant
    await createNotification(
      `Application ${status}`,
      `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
      "APPLICATION_STATUS",
      application.applicant._id,
      job._id,
      { status, feedback }
    );
    
    // Send push notification if possible
    if (application.applicant.fcmToken) {
      try {
        await sendPushNotification(
          application.applicant.fcmToken,
          `Application ${status}`,
          `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
          {
            type: "APPLICATION_STATUS",
            jobId: job._id.toString(),
            status,
            feedback
          }
        );
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }
    
    res.json({
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application status from notification
export const updateApplicationStatusFromNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.id;
    
    // Find the notification
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Check if this is actually a job application notification
    if (notification.type !== 'JOB_APPLICATION') {
      return res.status(400).json({ message: "This notification is not related to a job application" });
    }
    
    // Find the related job and verify employer
    const job = await Job.findById(notification.relatedJob);
    if (!job) {
      return res.status(404).json({ message: "Related job not found" });
    }
    
    if (job.employer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Only the employer can update application status" });
    }
    
    // Find the application using notification data
    let application = await Application.findOne({
      relatedNotification: notificationId
    });
    
    if (!application) {
      // Try to find by job and applicant from notification data
      application = await Application.findOne({
        job: notification.relatedJob,
        applicant: notification.data.applicantId
      });
      
      if (!application) {
        // Create a new application record if one doesn't exist (for legacy notifications)
        application = new Application({
          job: notification.relatedJob,
          applicant: notification.data.applicantId,
          applicantName: notification.data.applicantName,
          applicantEmail: notification.data.applicantEmail,
          applicantPhone: notification.data.applicantPhone,
          applicantGender: notification.data.applicantGender,
          applicantAddress: notification.data.applicantAddress,
          applicantEducation: notification.data.applicantEducation,
          applicantSkills: notification.data.applicantSkills,
          relatedNotification: notificationId
        });
      } else {
        // Update the existing application with the notification reference
        application.relatedNotification = notificationId;
      }
    }
    
    // Update status and feedback
    application.status = status;
    if (feedback) {
      application.feedback = feedback;
    }
    
    await application.save();
    
    // Send notification to the applicant
    await createNotification(
      `Application ${status}`,
      `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
      "APPLICATION_STATUS",
      application.applicant,
      job._id,
      { status, feedback, jobTitle: job.jobTitle }
    );
    
    // Mark the notification as read
    notification.read = true;
    await notification.save();
    
    // Send push notification if possible
    const applicant = await User.findById(application.applicant);
    if (applicant && applicant.fcmToken) {
      try {
        await sendPushNotification(
          applicant.fcmToken,
          `Application ${status}`,
          `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
          {
            type: "APPLICATION_STATUS",
            jobId: job._id.toString(),
            status,
            feedback
          }
        );
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }
    
    res.json({
      message: `Application status updated to ${status}`,
      application
    });
  } catch (error) {
    console.error("Error updating application status from notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};