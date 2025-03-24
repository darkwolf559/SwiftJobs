import Bookmark from '../models/Bookmark.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

// Add a bookmark
export const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from authenticated user
    const { jobId } = req.body;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID or job ID format" 
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ 
      user: userId, 
      job: jobId 
    });

    if (existingBookmark) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already bookmarked this job" 
      });
    }

    // Create new bookmark
    const newBookmark = new Bookmark({
      user: userId,
      job: jobId
    });

    await newBookmark.save();

    res.status(201).json({
      success: true,
      message: "Job bookmarked successfully",
      data: newBookmark
    });
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bookmark job",
      error: error.message
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { jobId } = req.params; 

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID or job ID format" 
      });
    }

    const result = await Bookmark.findOneAndDelete({ 
      user: userId, 
      job: jobId 
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully"
    });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
      error: error.message
    });
  }
};

// Get all bookmarks for a user
export const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id; // Changed to get from auth token

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

    const bookmarks = await Bookmark.find({ user: userId })
      .populate('job')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    console.error("Get user bookmarks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get bookmarks",
      error: error.message
    });
  }
};

// Check if a job is bookmarked by a user
export const checkBookmarkStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Changed to get from auth token
    const { jobId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: "Invalid user ID format"
      });
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(200).json({
        success: true,
        isBookmarked: false,
        message: "Invalid job ID format"
      });
    }

    const bookmark = await Bookmark.findOne({ 
      user: userId, 
      job: jobId 
    });

    res.status(200).json({
      success: true,
      isBookmarked: bookmark ? true : false
    });
  } catch (error) {
    console.error("Check bookmark error:", error);

    res.status(200).json({
      success: true,
      isBookmarked: false,
      error: error.message
    });
  }
};