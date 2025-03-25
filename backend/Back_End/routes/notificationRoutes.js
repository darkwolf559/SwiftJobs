import express from "express";
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getApplicationDetails
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/:notificationId/read", authMiddleware, markNotificationAsRead);
router.put("/read-all", authMiddleware, markAllNotificationsAsRead);
router.get("/:notificationId/application-details", authMiddleware, getApplicationDetails);

export default router;