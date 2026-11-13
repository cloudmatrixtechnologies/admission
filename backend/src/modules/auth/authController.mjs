
import { z } from "zod";

import {
  createOtp,
  verifyOtp,
  discardUndeliveredOtp,
} from "./otpService.mjs";

import { sendOtpSms } from "./smsService.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

const purposeSchema = z.enum([
  "registration",
  "login",
  "mobile_change",
]);

const mobileInputSchema = z
  .object({
    mobileNumber: z.string().trim().min(1).max(30),
    mobileCountry: z.string().trim().length(2).optional(),
  })
  .strict();

const verifySchema = mobileInputSchema
  .extend({
    otp: z.string().regex(/^\d{6}$/),
    purpose: purposeSchema,
  })
  .strict();

function getNormalizedMobile(input) {
  return normalizeMobile(
    input.mobileNumber,
    input.mobileCountry?.toUpperCase()
  );
}

export async function requestOtp(req, res, next) {
  try {
    const inputResult = mobileInputSchema.safeParse({
      mobileNumber: req.body?.mobileNumber,
      ...(req.body?.mobileCountry !== undefined
        ? { mobileCountry: req.body.mobileCountry }
        : {}),
    });

    if (!inputResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number.",
      });
    }

    const purposeResult = purposeSchema.safeParse(req.body?.purpose);

    if (!purposeResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request.",
      });
    }

    let mobile;

    try {
      mobile = getNormalizedMobile(inputResult.data);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number or country code.",
      });
    }

    const purpose = purposeResult.data;
    const result = await createOtp(mobile, purpose);

    try {
      await sendOtpSms(mobile, result.otpForDelivery);
    } catch {
      // Delete only this request's undelivered OTP.
      try {
        await discardUndeliveredOtp({
          otpRecordId: result.otpRecordId,
          otpHash: result.otpHash,
        });
      } catch {
        // Do not expose internal errors or OTP details.
      }

      return res.status(503).json({
        success: false,
        message: "SMS delivery is temporarily unavailable.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "If eligible, a verification code will be sent.",
    });
  } catch (error) {
    if (error.message === "OTP_RESEND_COOLDOWN") {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
      });
    }

    if (error.message === "SMS_PROVIDER_NOT_CONFIGURED") {
      return res.status(503).json({
        success: false,
        message: "SMS delivery is temporarily unavailable.",
      });
    }

    return next(error);
  }
}

export async function verifyOtpController(req, res, next) {
  try {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request.",
      });
    }

    const { otp, purpose } = parsed.data;

    let mobile;

    try {
      mobile = getNormalizedMobile(parsed.data);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number or country code.",
      });
    }

    const result = await verifyOtp(mobile, purpose, otp);

    if (!result.verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (purpose === "login") {
      return res.status(200).json({
        success: true,
        message: "Code verified.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mobile number verified.",
      verificationToken: result.verificationToken,
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    return next(error);
  }
}
