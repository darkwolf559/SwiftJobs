import Bookmark from '../models/Bookmark.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

// Add a bookmark
export const addBookmark = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Validate ObjectId format for both userId and jobId
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

// Remove a bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

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
    const { userId } = req.params;

    // Validate ObjectId format
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
    const { userId, jobId } = req.params;

    // Validate that both IDs are valid ObjectIds
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
    // Don't fail the request, just return not bookmarked
    res.status(200).json({
      success: true,
      isBookmarked: false,
      error: error.message
    });
  }
};

// Get total bookmark count for a job
export const getJobBookmarkCount = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate ObjectId format
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid job ID format" 
      });
    }

    const count = await Bookmark.countDocuments({ job: jobId });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error("Get job bookmark count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get bookmark count",
      error: error.message
    });
  }
};