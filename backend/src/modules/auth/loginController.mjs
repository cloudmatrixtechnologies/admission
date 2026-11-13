
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import User from "../users/userModel.mjs";
import loginSchema from "./loginSchema.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

import {
  createSession,
  revokeSession,
} from "./sessionService.mjs";

import {
  generateRefreshToken,
  hashRefreshToken,
} from "./sessionTokenService.mjs";

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN = "10m";
const ACCESS_COOKIE_MAX_AGE = 10 * 60 * 1000;
const ABSOLUTE_SESSION_MAX_AGE = 8 * 60 * 60 * 1000;

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

export async function loginController(req, res) {
  let createdSessionId = null;

  try {
    // 1. Validate the incoming login data.
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details.",
        errors: result.error.flatten(),
      });
    }

    // 2. Check whether the JWT secret is configured correctly.
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is temporarily unavailable.",
      });
    }

    const { mobileNumber, mobileCountry, password } = result.data;

    // 3. Normalize the mobile number.
    let normalizedMobile;

    try {
      normalizedMobile = normalizeMobile(
        mobileNumber,
        mobileCountry
      );
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number.",
      });
    }

    // 4. Find the user.
    const user = await User.findOne({
      mobileNumber: normalizedMobile,
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile number or password.",
      });
    }

    // 5. Verify the password.
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid mobile number or password.",
      });
    }

    // 6. Check the account status.
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active.",
      });
    }

    if (!user.mobileVerifiedAt) {
      return res.status(403).json({
        success: false,
        message: "Please verify your mobile number before logging in.",
      });
    }

    // 7. Generate a new refresh token.
    // The raw token will only be sent in the HttpOnly cookie.
    const refreshToken = generateRefreshToken();

    // 8. Store only the SHA-256 hash in MongoDB.
    const refreshTokenHash = hashRefreshToken(refreshToken);

    // 9. Create a separate server-side session for this login/device.
    const session = await createSession(
      user._id,
      refreshTokenHash
    );

    createdSessionId = session._id;

    // 10. Create an access JWT linked to this session.
    const accessToken = jwt.sign(
      {
        sub: user._id.toString(),
        role: user.role,
        sid: session._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: "admission-panel-api",
        audience: "admission-panel-client",
        algorithm: "HS256",
      }
    );

    // 11. Calculate the remaining absolute session lifetime.
    const refreshCookieMaxAge = Math.min(
      ABSOLUTE_SESSION_MAX_AGE,
      new Date(session.absoluteExpiresAt).getTime() - Date.now()
    );

    // 12. Set the access and refresh cookies.
    res.cookie(
      "token",
      accessToken,
      getAccessCookieOptions()
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      getRefreshCookieOptions(refreshCookieMaxAge)
    );

    // 13. Return the normal login response.
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
    });
  } catch (error) {
    // If session creation succeeded but a later step failed,
    // revoke that newly created session.
    if (createdSessionId) {
      try {
        await revokeSession(createdSessionId);
      } catch (revokeError) {
        console.error(
          "Failed to revoke incomplete login session:",
          revokeError.message
        );
      }
    }

    console.error("Login failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
}
