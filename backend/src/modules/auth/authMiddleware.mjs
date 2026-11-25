
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../users/userModel.mjs";
import Session from "./sessionModel.mjs";

import {
  getSessionExpiryReason,
  revokeSession,
} from "./sessionService.mjs";

const JWT_ISSUER = "admission-panel-api";
const JWT_AUDIENCE = "admission-panel-client";

// Clear only the access cookie.
// Keep the refresh cookie so the frontend can renew the access token.
function clearAccessCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
}

// Clear both cookies when the database session is no longer valid.
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

export async function requireAuth(req, res, next) {
  try {
    // 1. Read the access token from the cookie.
    const token = req.cookies?.token;

    if (!token) {
      // Do not clear the refresh cookie here.
      // The frontend may use it to obtain a new access token.
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // 2. Check the JWT secret.
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is temporarily unavailable.",
      });
    }

    // 3. Verify the JWT signature and standard claims.
    const payload = jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    // 4. Validate the required JWT fields.
    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.sid !== "string" ||
      !mongoose.isValidObjectId(payload.sub) ||
      !mongoose.isValidObjectId(payload.sid)
    ) {
      clearAccessCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please log in again.",
      });
    }

    // 5. Find the exact session belonging to this user.
    const session = await Session.findOne({
      _id: payload.sid,
      user: payload.sub,
    });

    if (!session) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your session is invalid. Please log in again.",
      });
    }

    // 6. Check whether the session is revoked or expired.
    const expiryReason = getSessionExpiryReason(session);

    if (expiryReason) {
      // Mark expired sessions as revoked.
      if (expiryReason !== "SESSION_REVOKED") {
        await revokeSession(session._id);
      }

      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    // 7. Find and validate the user account.
    const user = await User.findById(payload.sub).select(
      "_id mobileNumber role status mobileVerifiedAt"
    );

    if (
      !user ||
      user.status !== "active" ||
      !user.mobileVerifiedAt ||
      user.role !== payload.role
    ) {
      await revokeSession(session._id);
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your session is invalid. Please log in again.",
      });
    }

    // 8. Attach authenticated information to the request.
    req.user = {
      id: user._id.toString(),
      mobileNumber: user.mobileNumber,
      role: user.role,
    };

    req.sessionId = session._id.toString();

    // Meaningful activity is handled by the separate activity endpoint.
    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      // The access token is invalid or expired.
      // Preserve the refresh cookie so a valid session can be refreshed.
      clearAccessCookie(res);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired session. Please log in again.",
      });
    }

    // Database and unexpected server errors go to centralized error handling.
    return next(error);
  }
}
