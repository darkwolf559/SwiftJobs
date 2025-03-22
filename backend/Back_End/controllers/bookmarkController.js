import Bookmark from "../models/bookmark.js";
import Job from "../models/job.js";

// Add a bookmark
export const addBookmark = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

   
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });
    if (existingBookmark) {
      return res.status(400).json({ message: "Job already bookmarked" });
    }

    
    const bookmark = new Bookmark({
      user: userId,
      job: jobId
    });

    await bookmark.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Job bookmarked successfully",
      bookmarkId: bookmark._id
    });
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const deleted = await Bookmark.findOneAndDelete({ user: userId, job: jobId });
    
    if (!deleted) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ success: true, message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: 'job',
        select: 'jobTitle jobDescription payment location duration jobCategory requiredSkills employerName',
        populate: {
          path: 'createdBy',
          select: 'fullName email'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const checkBookmarkStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOne({ user: userId, job: jobId });
    
    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    console.error("Check bookmark error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};