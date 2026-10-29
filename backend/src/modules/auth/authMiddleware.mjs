
import jwt from "jsonwebtoken";
import User from "../users/userModel.mjs";

const JWT_ISSUER = "admission-panel-api";
const JWT_AUDIENCE = "admission-panel-client";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      console.error("JWT_SECRET is missing or too short.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is temporarily unavailable.",
      });
    }

    const payload = jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please log in again.",
      });
    }

    // Confirm the account still exists and is allowed to log in.
    const user = await User.findById(payload.sub)
      .select("_id mobile_number role status mobile_verified_at");

    if (
      !user ||
      user.status !== "active" ||
      !user.mobile_verified_at ||
      user.role !== payload.role
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid. Please log in again.",
      });
    }

    // Attach the verified database user to this request.
    req.user = {
      id: user._id.toString(),
      mobile_number: user.mobile_number,
      role: user.role,
    };

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session. Please log in again.",
      });
    }

    return next(error);
  }
}
