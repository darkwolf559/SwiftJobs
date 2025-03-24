import express from "express";
import { 
  addReview, 
  getJobReviews, 
  getRandomTestimonials,
  getAllReviews 
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, addReview);
router.get("/job/:jobId", getJobReviews);
router.get("/testimonials", getRandomTestimonials);
router.get("/", getAllReviews);

export default router;