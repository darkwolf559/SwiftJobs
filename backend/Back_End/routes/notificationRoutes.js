import express from "express";
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getApplicationDetails,
  
} from "../controllers/notificationController.js";
import { updateApplicationStatusFromNotification } from "../controllers/applicationContrtoller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserNotifications);
router.put("/:notificationId/read", authMiddleware, markNotificationAsRead);
router.put("/read-all", authMiddleware, markAllNotificationsAsRead);
router.get("/:notificationId/application-details", authMiddleware, getApplicationDetails);
router.put("/:notificationId/application-status", authMiddleware, updateApplicationStatusFromNotification);
export default router;