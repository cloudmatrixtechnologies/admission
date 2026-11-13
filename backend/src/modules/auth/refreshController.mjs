
import jwt from "jsonwebtoken";

import User from "../users/userModel.mjs";

import {
  rotateRefreshToken,
} from "./sessionRefreshService.mjs";

import {
  revokeSession,
} from "./sessionService.mjs";

const JWT_ISSUER = "admission-panel-api";
const JWT_AUDIENCE = "admission-panel-client";

const JWT_EXPIRES_IN = "10m";
const ACCESS_COOKIE_MAX_AGE = 10 * 60 * 1000;

function getAccessCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  };
}

function getRefreshCookieOptions(maxAge) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge,
  };
}

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

export async function refreshController(req, res) {
  let rotatedSessionId = null;

  try {
    // 1. Read the refresh token from its HttpOnly cookie.
    const presentedToken = req.cookies?.refreshToken;

    if (!presentedToken) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Refresh token missing. Please log in again.",
      });
    }

    // 2. Validate JWT configuration.
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is temporarily unavailable.",
      });
    }

    // 3. Ask the session service to validate and rotate the token.
    const result = await rotateRefreshToken(presentedToken);

    // 4. Handle an early refresh attempt.
    // Do not clear cookies or modify the current session.
    if (result.status === "REFRESH_TOO_EARLY") {
      const retryAfterSeconds = Math.ceil(
        result.retryAfterMs / 1000
      );

      res.set("Retry-After", String(retryAfterSeconds));

      return res.status(429).json({
        success: false,
        message: "Session refresh attempted too early. Please try again later.",
        retryAfterSeconds,
      });
    }

    // 5. Handle invalid, reused, revoked or expired refresh tokens.
    if (result.status !== "ROTATED") {
      clearAuthCookies(res);

      const messages = {
        INVALID_TOKEN: "Invalid refresh token. Please log in again.",
        TOKEN_REUSE_DETECTED: "Refresh token reuse detected. Please log in again.",
        SESSION_REVOKED: "Your session has been revoked. Please log in again.",
        SESSION_EXPIRED: "Your session has expired. Please log in again.",
      };

      return res.status(401).json({
        success: false,
        message:
          messages[result.status] ||
          "Session could not be refreshed. Please log in again.",
      });
    }

    // The old refresh token has already been rotated.
    // If a later step fails, revoke this session rather than
    // leaving the user with an unknown replacement token.
    const session = result.session;
    rotatedSessionId = session._id;

    // 6. Check that the account is still active and verified.
    const user = await User.findById(session.user).select(
      "_id mobileNumber role status mobileVerifiedAt"
    );

    if (
      !user ||
      user.status !== "active" ||
      !user.mobileVerifiedAt
    ) {
      await revokeSession(session._id);
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your account is no longer eligible for this session. Please log in again.",
      });
    }

    // 7. Create a new access JWT linked to the same session.
    const accessToken = jwt.sign(
      {
        sub: user._id.toString(),
        role: user.role,
        sid: session._id.toString(),
      },
      secret,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        algorithm: "HS256",
      }
    );

    // 8. Preserve the original eight-hour absolute expiry.
    // Never give the refresh cookie another full eight hours.
    const remainingSessionMs =
      new Date(session.absoluteExpiresAt).getTime() - Date.now();

    if (remainingSessionMs <= 0) {
      await revokeSession(session._id);
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    // 9. Set the new access and refresh cookies.
    res.cookie(
      "token",
      accessToken,
      getAccessCookieOptions()
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      getRefreshCookieOptions(remainingSessionMs)
    );

    // 10. Return success without exposing either raw token.
    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
      user: {
        id: user._id.toString(),
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
    });
  } catch (error) {
    if (rotatedSessionId) {
      try {
        await revokeSession(rotatedSessionId);
      } catch (revokeError) {
        console.error(
          "Failed to revoke incomplete refresh session:",
          revokeError.message
        );
      }
    }

    console.error("Session refresh failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to refresh your session. Please try again later.",
    });
  }
}
