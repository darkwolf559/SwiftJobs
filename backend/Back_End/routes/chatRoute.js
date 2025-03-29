import express from "express";
import {
  getOrCreateChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  markMessagesAsRead
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/application/:applicationId", authMiddleware, getOrCreateChat);
router.get("/", authMiddleware, getUserChats);
router.get("/:chatId", authMiddleware, getChatMessages);
router.post("/:chatId/messages", authMiddleware, sendMessage);
router.put("/:chatId/read", authMiddleware, markMessagesAsRead);

export default router;