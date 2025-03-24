import Review from '../models/review.js';
import Job from '../models/job.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

// Add a review to a job
export const addReview = async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already reviewed this job
    const existingReview = await Review.findOne({ jobId, userId });
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      
      return res.status(200).json({ 
        message: 'Review updated successfully', 
        review: existingReview 
      });
    }

    // Create new review
    const newReview = new Review({
      jobId,
      userId,
      rating,
      comment
    });

    await newReview.save();

    res.status(201).json({ 
      message: 'Review added successfully', 
      review: newReview 
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews for a job
export const getJobReviews = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const reviews = await Review.find({ jobId })
      .populate('userId', 'username fullName profilePhoto profilePhotoType')
      .sort({ createdAt: -1 });
    
    // Process reviews to add profile photo URL if available
    const processedReviews = reviews.map(review => {
      const reviewObj = review.toObject();
      if (reviewObj.userId && reviewObj.userId.profilePhoto) {
        reviewObj.userId.profilePhotoUrl = `data:${reviewObj.userId.profilePhotoType};base64,${reviewObj.userId.profilePhoto.toString('base64')}`;
        delete reviewObj.userId.profilePhoto;
        delete reviewObj.userId.profilePhotoType;
      }
      return reviewObj;
    });
    
    res.json(processedReviews);
  } catch (error) {
    console.error('Error getting job reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get random testimonials for homepage
export const getRandomTestimonials = async (req, res) => {
  try {
    // Get random reviews with high ratings (4 or 5)
    const reviews = await Review.aggregate([
      { $match: { 
        rating: { $gte: 4 },
        showInTestimonials: true
      }},
      { $sample: { size: 3 } } // Get 3 random reviews
    ]);
    
    // Get user information for these reviews
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findById(review.userId);
        const job = await Job.findById(review.jobId);
        
        if (!user || !job) return null;
        
        // Prepare user photo if available
        let userPhoto = null;
        if (user.profilePhoto) {
          userPhoto = `data:${user.profilePhotoType};base64,${user.profilePhoto.toString('base64')}`;
        }
        
        return {
          id: review._id,
          name: user.fullName || user.username,
          role: job.jobTitle, // Use job title as "role"
          image: userPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', // Fallback image
          text: review.comment,
          rating: review.rating,
          date: new Date(review.createdAt).toLocaleDateString()
        };
      })
    );
    
    // Filter out any null values and return
    const validReviews = reviewsWithUserInfo.filter(review => review !== null);
    
    res.json(validReviews);
  } catch (error) {
    console.error('Error getting testimonials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
    try {
      // Get all reviews, sort by newest first
      const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'username fullName profilePhoto profilePhotoType')
        .populate('jobId', 'jobTitle');
      
      // Process reviews to include necessary information
      const processedReviews = await Promise.all(reviews.map(async (review) => {
        const reviewObj = review.toObject();
        
        // Add profile photo URL if available
        if (reviewObj.userId && reviewObj.userId.profilePhoto) {
          reviewObj.userId.profilePhotoUrl = `data:${reviewObj.userId.profilePhotoType};base64,${reviewObj.userId.profilePhoto.toString('base64')}`;
          delete reviewObj.userId.profilePhoto;
          delete reviewObj.userId.profilePhotoType;
        }
        
        // Format review for the response
        return {
          id: reviewObj._id,
          jobId: reviewObj.jobId._id,
          name: reviewObj.userId ? (reviewObj.userId.fullName || reviewObj.userId.username) : 'Anonymous User',
          role: reviewObj.jobId ? reviewObj.jobId.jobTitle : 'Unknown Job',
          image: reviewObj.userId && reviewObj.userId.profilePhotoUrl ? reviewObj.userId.profilePhotoUrl : null,
          text: reviewObj.comment,
          rating: reviewObj.rating,
          date: new Date(reviewObj.createdAt).toLocaleDateString()
        };
      }));
      
      res.json(processedReviews);
    } catch (error) {
      console.error('Error getting all reviews:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };