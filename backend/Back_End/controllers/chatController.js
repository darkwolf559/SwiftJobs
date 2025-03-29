import Chat from "../models/chatModel.js";
import Application from "../models/application.js";
import User from "../models/user.js";
import { createNotification, sendPushNotification } from "./notificationController.js";

export const getOrCreateChat = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== 'Accepted') {
      return res.status(403).json({ 
        message: "Chat is only available for accepted applications" 
      });
    }
    const isEmployer = application.job.employer.toString() === userId;
    const isApplicant = application.applicant._id.toString() === userId;
    
    if (!isEmployer && !isApplicant) {
      return res.status(403).json({ 
        message: "Unauthorized: You are not associated with this application" 
      });
    }

    let chat = await Chat.findOne({ application: applicationId })
      .populate('employer', 'fullName profilePhotoUrl')
      .populate('applicant', 'fullName profilePhotoUrl');

    if (!chat) {
      chat = new Chat({
        application: applicationId,
        job: application.job._id,
        employer: application.job.employer,
        applicant: application.applicant._id,
        messages: []
      });
      
      await chat.save();

      chat = await Chat.findById(chat._id)
        .populate('employer', 'fullName profilePhotoUrl')
        .populate('applicant', 'fullName profilePhotoUrl');
    }
    
    res.json(chat);
  } catch (error) {
    console.error("Error getting/creating chat:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.employer.toString() !== userId && chat.applicant.toString() !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized: You are not a participant in this chat" 
      });
    }

    const newMessage = {
      sender: userId,
      content,
      readBy: [userId]
    };

    chat.messages.push(newMessage);
    chat.lastActivity = Date.now();
    await chat.save();

    const recipientId = chat.employer.toString() === userId 
      ? chat.applicant.toString() 
      : chat.employer.toString();
    
    const recipient = await User.findById(recipientId);
    const sender = await User.findById(userId);

    await createNotification(
      "New Message",
      `${sender.fullName || sender.username} sent you a message`,
      "CHAT_MESSAGE",
      recipientId,
      chat.job,
      {
        chatId: chat._id.toString(),
        applicationId: chat.application.toString(),
        message: content.substring(0, 100) + (content.length > 100 ? '...' : '')
      }
    );

    if (recipient.fcmToken) {
      try {
        await sendPushNotification(
          recipient.fcmToken,
          "New Message",
          `${sender.fullName || sender.username}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
          {
            type: "CHAT_MESSAGE",
            chatId: chat._id.toString(),
            applicationId: chat.application.toString()
          }
        );
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }

    res.status(201).json({
      message: "Message sent successfully",
      chat
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId)
      .populate('employer', 'fullName profilePhotoUrl')
      .populate('applicant', 'fullName profilePhotoUrl')
      .populate('messages.sender', 'fullName profilePhotoUrl');
    
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.employer._id.toString() !== userId && chat.applicant._id.toString() !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized: You are not a participant in this chat" 
      });
    }

    const updatedMessages = chat.messages.map(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
      }
      return message;
    });
    
    chat.messages = updatedMessages;
    await chat.save();
    
    res.json(chat);
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      $or: [
        { employer: userId },
        { applicant: userId }
      ]
    })
    .populate('employer', 'fullName profilePhotoUrl')
    .populate('applicant', 'fullName profilePhotoUrl')
    .populate('job', 'jobTitle')
    .populate('application')
    .sort({ lastActivity: -1 });

    const formattedChats = chats.map(chat => {
      const lastMessage = chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1] 
        : null;
      
      const unreadCount = chat.messages.filter(
        msg => msg.sender.toString() !== userId && !msg.readBy.includes(userId)
      ).length;

      const otherUser = chat.employer._id.toString() === userId 
        ? chat.applicant 
        : chat.employer;
      
      return {
        _id: chat._id,
        jobTitle: chat.job.jobTitle,
        applicationId: chat.application._id,
        otherUser: {
          _id: otherUser._id,
          fullName: otherUser.fullName,
          profilePhotoUrl: otherUser.profilePhotoUrl
        },
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          isFromMe: lastMessage.sender.toString() === userId
        } : null,
        unreadCount,
        lastActivity: chat.lastActivity
      };
    });
    
    res.json(formattedChats);
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    if (chat.employer.toString() !== userId && chat.applicant.toString() !== userId) {
      return res.status(403).json({ 
        message: "Unauthorized: You are not a participant in this chat" 
      });
    }
    const updated = await Chat.updateOne(
      { _id: chatId },
      { $addToSet: { "messages.$[].readBy": userId } }
    );
    
    res.json({ 
      message: "Messages marked as read", 
      updated: updated.modifiedCount > 0 
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};