
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  requestOtp,
  verifyOtpController,
} from "./authController.mjs";

import { registerController } from "./registrationController.mjs";
import { loginController } from "./loginController.mjs";
import { refreshController } from "./refreshController.mjs";
import { requireAuth } from "./authMiddleware.mjs";

import {
  revokeSession,
  updateSessionActivity,
} from "./sessionService.mjs";

const router = Router();

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
  },
});

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many refresh attempts. Please try again later.",
  },
});

// Clear both authentication cookies.
function clearAuthCookies(res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth/refresh",
  });
}

// OTP routes
router.post("/otp/request", otpRequestLimiter, requestOtp);
router.post("/otp/verify", otpVerifyLimiter, verifyOtpController);

// Registration and login
router.post("/register", registrationLimiter, registerController);
router.post("/login", loginLimiter, loginController);

// Session refresh
router.post("/refresh", refreshLimiter, refreshController);

// Authenticated user
router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully.",
    user: req.user,
  });
});
// Update meaningful activity for the current authenticated session.
router.post("/activity", requireAuth, async (req, res) => {
  try {
    const session = await updateSessionActivity(req.sessionId);

    // The session may have expired between authentication and this update.
    if (!session) {
      await revokeSession(req.sessionId);

      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session activity updated successfully.",
    });
  } catch (error) {
    console.error("Session activity update failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update session activity.",
    });
  }
});

// Secure logout: revoke only the current device's session.
router.post("/logout", requireAuth, async (req, res) => {
  try {
    await revokeSession(req.sessionId);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout failed:", error.message);

    clearAuthCookies(res);

    return res.status(500).json({
      success: false,
      message: "Unable to complete logout. Please try again.",
    });
  }
});

export default router;
