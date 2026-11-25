
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../users/userModel.mjs";

import {
    createOtp,
    verifyOtp,
    discardUndeliveredOtp,
} from "./otpService.mjs";

import { sendOtpSms } from "./smsService.mjs";

import {
    mobileChangeRequestSchema,
    mobileChangeVerifySchema,
    mobileChangeConfirmSchema,
} from "./mobileChangeSchema.mjs";

import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

import { consumeVerificationGrant } from "./verificationGrantService.mjs";

import { revokeAllUserSessions } from "./sessionService.mjs";

// Request an OTP for the new registered login mobile number.
export async function requestMobileChangeOtp(req, res) {
    try {
        const result = mobileChangeRequestSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile-number details.",
                errors: result.error.flatten(),
            });
        }

        const { mobileNumber, mobileCountry } = result.data;

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

        // The new number must differ from the current login number.
        if (mobile === req.user.mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "The new mobile number must be different from your current number.",
            });
        }

        // A registered number cannot be assigned to another account.
        const existingUser = await User.exists({
            mobileNumber: mobile,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered.",
            });
        }

        // Create an OTP using the existing OTP service.
        const otpData = await createOtp(mobile, "mobileChange");

        try {
            await sendOtpSms(mobile, otpData.otpForDelivery);
        } catch (error) {
            // Delete only the OTP associated with this failed delivery.
            await discardUndeliveredOtp({
                otpRecordId: otpData.otpRecordId,
                otpHash: otpData.otpHash,
            });

            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "If the mobile number is eligible, an OTP has been sent.",
            expiresAt: otpData.expiresAt,
        });
    } catch (error) {
        if (error.message === "OTP_RESEND_COOLDOWN") {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP.",
            });
        }

        if (error.message === "SMS_PROVIDER_NOT_CONFIGURED") {
            return res.status(503).json({
                success: false,
                message: "OTP delivery is currently unavailable.",
            });
        }

        console.error("Mobile change OTP request failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to request mobile verification. Please try again later.",
        });
    }
}

// Verify the OTP sent to the new mobile number.
export async function verifyMobileChangeOtp(req, res) {
    try {
        const result = mobileChangeVerifySchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile verification details.",
                errors: result.error.flatten(),
            });
        }

        const {
            mobileNumber,
            mobileCountry,
            otp,
        } = result.data;

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

        if (mobile === req.user.mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "The new mobile number must be different from your current number.",
            });
        }

        // Check availability again because another account
        // might have registered this number after the OTP request.
        const existingUser = await User.exists({
            mobileNumber: mobile,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered.",
            });
        }

        const verification = await verifyOtp(
            mobile,
            "mobileChange",
            otp
        );

        if (!verification.verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Please try again.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Mobile number verified successfully.",
            verificationToken: verification.verificationToken,
            expiresAt: verification.expiresAt,
        });
    } catch (error) {
        console.error("Mobile change OTP verification failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to verify mobile number. Please try again later.",
        });
    }
}

// Confirm the registered login mobile-number change.
export async function confirmMobileChange(req, res) {
    let mongoSession;

    try {
        const result = mobileChangeConfirmSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile-change confirmation details.",
                errors: result.error.flatten(),
            });
        }

        const {
            mobileNumber,
            mobileCountry,
            verificationToken,
            currentPassword,
        } = result.data;

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

        if (mobile === req.user.mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "The new mobile number must be different from your current number.",
            });
        }

        mongoSession = await mongoose.startSession();

        let outcome = null;

        await mongoSession.withTransaction(async () => {
            // Find the same account and current mobile number
            // that were authenticated by the middleware.
            const user = await User.findOne({
                _id: req.user.id,
                mobileNumber: req.user.mobileNumber,
                status: "active",
            })
                .select("+passwordHash")
                .session(mongoSession);

            if (!user) {
                outcome = "ACCOUNT_CHANGED";
                return;
            }

            // Verify the current password before consuming the grant.
            const passwordMatches = await bcrypt.compare(
                currentPassword,
                user.passwordHash
            );

            if (!passwordMatches) {
                outcome = "INVALID_CURRENT_PASSWORD";
                return;
            }

            // Check whether another account already owns this number.
            const existingUser = await User.findOne({
                mobileNumber: mobile,
                _id: { $ne: user._id },
            }).session(mongoSession);

            if (existingUser) {
                outcome = "MOBILE_ALREADY_REGISTERED";
                return;
            }

            // Consume the OTP verification grant inside this transaction.
            await consumeVerificationGrant({
                mobile,
                purpose: "mobileChange",
                token: verificationToken,
                session: mongoSession,
            });

            const now = new Date();

            // Only update if the account still has the same
            // mobile number and password hash we just verified.
            const updatedUser = await User.findOneAndUpdate(
                {
                    _id: user._id,
                    mobileNumber: user.mobileNumber,
                    passwordHash: user.passwordHash,
                    status: "active",
                },
                {
                    $set: {
                        mobileNumber: mobile,
                        mobileVerifiedAt: now,
                    },
                },
                {
                    returnDocument: "after",
                    runValidators: true,
                    session: mongoSession,
                }
            );

            // Throwing aborts the transaction, including grant consumption.
            if (!updatedUser) {
                const error = new Error("MOBILE_CHANGE_CONCURRENT_UPDATE");
                error.code = "MOBILE_CHANGE_CONCURRENT_UPDATE";
                throw error;
            }

            // Revoke every session belonging to this account.
            // Other linked accounts are not affected.
            await revokeAllUserSessions(
                user._id,
                mongoSession
            );

            outcome = "SUCCESS";
        });

        if (outcome === "INVALID_CURRENT_PASSWORD") {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        if (outcome === "MOBILE_ALREADY_REGISTERED") {
            return res.status(409).json({
                success: false,
                message: "This mobile number is already registered.",
            });
        }

        if (outcome === "ACCOUNT_CHANGED") {
            return res.status(409).json({
                success: false,
                message: "Your account details have changed. Please log in again.",
            });
        }

        if (outcome !== "SUCCESS") {
            return res.status(409).json({
                success: false,
                message: "Unable to complete the mobile-number change. Please try again.",
            });
        }

        // The mobile number has changed and all account sessions
        // have been revoked. Clear both authentication cookies.
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
            message: "Mobile number changed successfully. Please log in again.",
        });
    } catch (error) {
        if (error.message === "VERIFICATION_GRANT_INVALID_OR_EXPIRED") {
            return res.status(400).json({
                success: false,
                message: "Mobile verification has expired or is invalid. Please verify the new number again.",
            });
        }

        if (
            error.code === 11000 ||
            error.code === "MOBILE_CHANGE_CONCURRENT_UPDATE"
        ) {
            return res.status(409).json({
                success: false,
                message: "This mobile number could not be assigned. Please try again.",
            });
        }

        console.error("Mobile number change failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to change mobile number. Please try again later.",
        });
    } finally {
        if (mongoSession) {
            await mongoSession.endSession();
        }
    }
}
