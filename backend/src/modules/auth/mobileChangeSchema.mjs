
import { z } from "zod";

const mobileFields = {
    mobileNumber: z.string().trim().min(1).max(30),

    mobileCountry: z.string().trim().length(2).optional(),
};

// 1. Request an OTP for the new mobile number.
export const mobileChangeRequestSchema = z
    .object(mobileFields)
    .strict();

// 2. Verify the OTP sent to the new mobile number.
export const mobileChangeVerifySchema = z
    .object({
        ...mobileFields,

        otp: z
            .string()
            .regex(/^\d{6}$/, "OTP must contain exactly 6 digits."),
    })
    .strict();

// 3. Confirm the mobile-number change.
export const mobileChangeConfirmSchema = z
    .object({
        ...mobileFields,

        verificationToken: z
            .string()
            .regex(/^[A-Za-z0-9_-]{43}$/),

        currentPassword: z
            .string()
            .min(1, "Current password is required.")
            .max(128, "Password is too long."),
    })
    .strict();
