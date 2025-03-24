import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job',
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true
  },
  // Field to track if this review should be shown in testimonials
  showInTestimonials: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Prevent multiple reviews from the same user for the same job
reviewSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;