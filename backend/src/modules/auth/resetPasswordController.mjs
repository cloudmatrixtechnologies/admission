
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../users/userModel.mjs";
import resetPasswordSchema from "./resetPasswordSchema.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";
import { consumeVerificationGrant } from "./verificationGrantService.mjs";
import { revokeAllUserSessions } from "./sessionService.mjs";

export async function resetPasswordController(req, res) {
    let mongoSession;

    try {
        // 1. Validate the request.
        const result = resetPasswordSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid password reset details.",
                errors: result.error.flatten(),
            });
        }

        const {
            mobileNumber,
            mobileCountry,
            verificationToken,
            newPassword,
        } = result.data;

        // 2. Normalize the mobile number.
        let mobile;

        try {
            mobile = normalizeMobile(
                mobileNumber,
                mobileCountry?.toUpperCase()
            );
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number or country code.",
            });
        }

        // 3. Start a MongoDB transaction.
        mongoSession = await mongoose.startSession();

        let outcome = null;

        await mongoSession.withTransaction(async () => {
            // 4. Find the active account.
            const user = await User.findOne({
                mobileNumber: mobile,
                status: "active",
            }).session(mongoSession);

            if (!user) {
                outcome = "USER_NOT_FOUND";
                return;
            }

            // 5. Consume the password-reset verification grant.
            await consumeVerificationGrant({
                mobile,
                purpose: "passwordReset",
                token: verificationToken,
                session: mongoSession,
            });

            // 6. Hash the new password.
            const newPasswordHash = await bcrypt.hash(newPassword, 12);
            const now = new Date();

            // 7. Update the password only if the account is still active.
            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: user._id,
                    mobileNumber: mobile,
                    status: "active",
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
                outcome = "PASSWORD_RESET_FAILED";
                return;
            }

            // 8. Revoke all sessions in the same transaction.
            await revokeAllUserSessions(user._id, mongoSession);

            outcome = "SUCCESS";
        });

        if (outcome === "USER_NOT_FOUND") {
            return res.status(400).json({
                success: false,
                message: "Unable to reset password. Please verify your details.",
            });
        }

        if (outcome === "PASSWORD_RESET_FAILED") {
            return res.status(409).json({
                success: false,
                message: "Unable to reset password. Please try again.",
            });
        }

        if (outcome !== "SUCCESS") {
            throw new Error("Password reset transaction did not complete.");
        }

        // 9. Clear both authentication cookies after success.
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
            message: "Password reset successfully. Please log in again.",
        });
    } catch (error) {
        if (error.message === "VERIFICATION_GRANT_INVALID_OR_EXPIRED") {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification. Please verify your mobile number again.",
            });
        }

        console.error("Reset password failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password. Please try again later.",
        });
    } finally {
        if (mongoSession) {
            await mongoSession.endSession();
        }
    }
}
