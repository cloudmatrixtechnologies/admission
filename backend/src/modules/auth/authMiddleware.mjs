
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

export async function requireAuth(req, res, next) {
  try {
    // 1. Read the access token from the cookie.
    const token = req.cookies?.token;

    if (!token) {
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

    // IMPORTANT:
    // This middleware does not update lastActivityAt.
    // Meaningful activity will be handled by our separate
    // activity endpoint later.

    return next();
  } catch (error) {
    if (
      ["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session. Please log in again.",
      });
    }

    return next(error);
  }
}
