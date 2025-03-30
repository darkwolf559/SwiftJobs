import express from "express";
import { requestPasswordReset, resetPassword ,verifyResetCode } from "../controllers/usercontrol.js";

const router = express.Router();

router.post("/request", requestPasswordReset);

router.post("/reset", resetPassword);

router.post("/verify-code", verifyResetCode);
export default router;