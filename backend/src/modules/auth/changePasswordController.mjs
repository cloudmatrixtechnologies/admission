
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../users/userModel.mjs";
import changePasswordSchema from "./changePasswordSchema.mjs";
import { revokeAllUserSessions } from "./sessionService.mjs";

export async function changePasswordController(req, res) {
  let mongoSession;

  try {
    // 1. Validate the request.
    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid password details.",
        errors: result.error.flatten(),
      });
    }

    const { currentPassword, newPassword } = result.data;

    // 2. Start a MongoDB transaction.
    mongoSession = await mongoose.startSession();

    let outcome = null;

    await mongoSession.withTransaction(async () => {
      // 3. Find the authenticated user and retrieve the password hash.
      const user = await User.findById(req.user.id)
        .select("+passwordHash")
        .session(mongoSession);

      if (!user || user.status !== "active") {
        outcome = "USER_NOT_FOUND";
        return;
      }

      // 4. Verify the current password.
      const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!passwordMatches) {
        outcome = "INCORRECT_PASSWORD";
        return;
      }

      // 5. Hash the new password.
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      const now = new Date();

      // 6. Update only if the old password hash is still unchanged.
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: user._id,
          passwordHash: user.passwordHash,
        },
        {
          $set: {
            passwordHash: newPasswordHash,
            passwordChangedAt: now,
          },
        },
        {
          returnDocument: "after",
          session: mongoSession,
        }
      );

      if (!updatedUser) {
        outcome = "PASSWORD_CHANGED_CONCURRENTLY";
        return;
      }

      // 7. Revoke every session in the same transaction.
      await revokeAllUserSessions(user._id, mongoSession);

      outcome = "SUCCESS";
    });

    if (outcome === "USER_NOT_FOUND") {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in again.",
      });
    }

    if (outcome === "INCORRECT_PASSWORD") {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (outcome === "PASSWORD_CHANGED_CONCURRENTLY") {
      return res.status(409).json({
        success: false,
        message: "Password was changed by another request. Please log in again.",
      });
    }

    if (outcome !== "SUCCESS") {
      throw new Error("Password change transaction did not complete.");
    }

    // 8. Clear both authentication cookies after transaction success.
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

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Change password failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to change password. Please try again later.",
    });
  } finally {
    if (mongoSession) {
      await mongoSession.endSession();
    }
  }
}
