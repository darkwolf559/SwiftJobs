// This is pehan's part

import express from "express";
import { 
  addBookmark, 
  removeBookmark, 
  getUserBookmarks,
  checkBookmarkStatus
} from "../controllers/bookmarkController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();


router.use(authMiddleware);

router.post("/", addBookmark);
router.delete("/:jobId", removeBookmark);
router.get("/", getUserBookmarks);
router.get("/status/:jobId", checkBookmarkStatus);

export default router;