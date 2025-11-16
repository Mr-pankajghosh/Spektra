import express from "express";
import { login, logout, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requestOtp, verifyOtp, resendOtp } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/request-otp", requestOtp);           // Step 1: Request OTP
router.post("/verify-otp", verifyOtp);       // Step 2: Verify OTP & create user
router.post("/resend-otp", resendOtp);       // Step 3: Resend OTP

router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/logout", logout);
router.post("/onboarding", protectRoute, onboard);
router.get("/me", protectRoute, (req, res) =>
  res.status(200).json({ success: true, user: req.user })
);

export default router;
