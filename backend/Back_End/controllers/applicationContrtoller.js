import Application from "../models/application.js";
import Job from "../models/job.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { createNotification, sendPushNotification } from "./notificationController.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });
    
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
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

    await application.save();

    const employer = await User.findById(job.employer);
    if (!employer) {
      console.log("Employer not found for job ID:", jobId);
      return res.status(200).json({ 
        message: "Application submitted successfully",
        application
      });
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
      applicantEducation: userEducation,
      applicantSkills: userSkills
    };

    const notification = await createNotification(
      "New Job Application",
      `${userName} has applied for your job: ${job.jobTitle}`,
      "JOB_APPLICATION",
      employer._id,
      jobId,
      notificationData
    );

    application.relatedNotification = notification._id;
    await application.save();

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

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You are not the employer for this job" });
    }
    
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'fullName email phoneNumber gender homeAddress profilePhotoUrl resume resumeType resumeName')
      .populate('job', 'jobTitle')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const employerJobs = await Job.find({ employer: userId });
    const jobIds = employerJobs.map(job => job._id);
    
    if (jobIds.length === 0) {
      return res.json([]);
    }

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'fullName email phoneNumber gender homeAddress profilePhotoUrl resume resumeType resumeName')
      .populate('job', 'jobTitle employerName location')
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error("Error fetching employer applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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

export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    
    const application = await Application.findById(applicationId)
      .populate('applicant')  // Fully populate to get access to all fields
      .populate('job', 'jobTitle employerName location jobCategory payment');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.job._id);
    if (
      application.applicant._id.toString() !== userId && 
      job.employer.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized to view this application" });
    }
    
    // Format profile photo and resume
    const formattedApplication = {...application.toObject()};
    
    // Format profile photo
    if (application.applicant.profilePhoto && application.applicant.profilePhoto.length > 0) {
      formattedApplication.applicant.profilePhotoUrl = 
        `data:${application.applicant.profilePhotoType || 'image/jpeg'};base64,${application.applicant.profilePhoto.toString('base64')}`;
    }
    
    // Format resume
    if (application.applicant.resume && application.applicant.resume.length > 0) {
      formattedApplication.applicant.resumeUrl = 
        `data:${application.applicant.resumeType || 'application/pdf'};base64,${application.applicant.resume.toString('base64')}`;
      formattedApplication.applicant.resumeName = application.applicant.resumeName || 'resume.pdf';
    }
    
    res.json(formattedApplication);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.id;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.job._id);
    if (job.employer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Only the employer can update application status" });
    }

    application.status = status;
    if (feedback) {
      application.feedback = feedback;
    }
    
    await application.save();

    await createNotification(
      `Application ${status}`,
      `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
      "APPLICATION_STATUS",
      application.applicant._id,
      job._id,
      { status, feedback }
    );

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

export const updateApplicationStatusFromNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status, feedback } = req.body;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.type !== 'JOB_APPLICATION') {
      return res.status(400).json({ message: "This notification is not related to a job application" });
    }

    const job = await Job.findById(notification.relatedJob);
    if (!job) {
      return res.status(404).json({ message: "Related job not found" });
    }
    
    if (job.employer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Only the employer can update application status" });
    }

    let application = await Application.findOne({
      relatedNotification: notificationId
    });
    
    if (!application) {
      application = await Application.findOne({
        job: notification.relatedJob,
        applicant: notification.data.applicantId
      });
      
      if (!application) {
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
        application.relatedNotification = notificationId;
      }
    }

    application.status = status;
    if (feedback) {
      application.feedback = feedback;
    }
    
    await application.save();

    await createNotification(
      `Application ${status}`,
      `Your application for ${job.jobTitle} has been ${status.toLowerCase()}`,
      "APPLICATION_STATUS",
      application.applicant,
      job._id,
      { status, feedback, jobTitle: job.jobTitle }
    );

    notification.read = true;
    await notification.save();

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