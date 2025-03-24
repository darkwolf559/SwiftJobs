import express from "express";
import { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePhoto,
  updateCoverPhoto,
  updateResume,
  uploadProfilePhoto, 
  uploadCoverPhoto, 
  uploadResume, 
  uploadBothPhotos,
  updateFcmToken
} from "../controllers/usercontrol.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", authMiddleware, getUserProfile);
router.put("/", authMiddleware, updateUserProfile);


router.put("/profile-photo", authMiddleware, updateProfilePhoto);
router.put("/cover-photo", authMiddleware, updateCoverPhoto);
router.put("/resume", authMiddleware, updateResume);

router.put("/upload/profile-photo", authMiddleware, uploadProfilePhoto, updateUserProfile);
router.put("/upload/cover-photo", authMiddleware, uploadCoverPhoto, updateUserProfile);
router.put("/upload/resume", authMiddleware, uploadResume, updateUserProfile);
router.put("/upload/photos", authMiddleware, uploadBothPhotos, updateUserProfile);
router.post("/fcm-token", authMiddleware, updateFcmToken);
export default router;