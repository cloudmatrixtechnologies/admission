
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../users/userModel.mjs";
import Student from "../students/studentModel.mjs";

import { registrationSchema } from "./registrationSchema.mjs";
import { consumeVerificationGrant } from "./verificationGrantService.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

export async function registerController(req, res, next) {
  let session;

  try {
    // 1. Validate all details submitted at the end of signup.
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;

    // bcrypt only uses up to 72 UTF-8 bytes.
    if (Buffer.byteLength(data.password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must not exceed 72 UTF-8 bytes.",
      });
    }

    // 2. Normalize student A and parent B.
    let studentMobile;
    let guardianMobile;

    try {
      studentMobile = normalizeMobile(
        data.mobile_number,
        data.mobile_country
      );

      guardianMobile = normalizeMobile(
        data.guardian_mobile,
        data.guardian_country
      );
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number or country selection.",
      });
    }

    // Compare normalized numbers, not raw input strings.
    const sameNumber = studentMobile === guardianMobile;

    // 3. A different parent number must have its own token.
    if (
      !sameNumber &&
      !data.guardian_verification_token
    ) {
      return res.status(400).json({
        success: false,
        message: "Parent mobile verification is required.",
      });
    }

    const studentDob = new Date(
      `${data.dob}T00:00:00.000Z`
    );

    // 4. Hash the password before writing account records.
    // Separate accounts get separate password hashes.
    const parentPasswordHash = await bcrypt.hash(
      data.password,
      12
    );

    const studentPasswordHash = sameNumber
      ? null
      : await bcrypt.hash(data.password, 12);

    session = await mongoose.startSession();

    let responseData;

    try {
      // 5. All account and profile writes happen atomically.
      await session.withTransaction(async () => {
        // Verify and consume the student's verification token.
        await consumeVerificationGrant({
          mobile: studentMobile,
          purpose: "registration",
          token: data.mobile_verification_token,
          session,
        });

        // Verify and consume the parent's token only when
        // the parent number differs from the student number.
        if (!sameNumber) {
          await consumeVerificationGrant({
            mobile: guardianMobile,
            purpose: "registration",
            token: data.guardian_verification_token,
            session,
          });
        }

        // 6. Do not create duplicate accounts for either number.
        const mobileNumbers = sameNumber
          ? [guardianMobile]
          : [studentMobile, guardianMobile];

        const existingUsers = await User.find({
          mobile_number: { $in: mobileNumbers },
        })
          .select("mobile_number")
          .session(session)
          .lean();

        if (existingUsers.length > 0) {
          const error = new Error("ACCOUNT_ALREADY_EXISTS");
          throw error;
        }

        const verifiedAt = new Date();

        // 7. Create the parent account.
        // Parent name and additional details are collected later.
        const parentUser = new User({
          mobile_number: guardianMobile,
          role: "parent",
          password_hash: parentPasswordHash,
          mobile_verified_at: verifiedAt,
          status: "active",
        });

        await parentUser.save({ session });

        // 8. Create a separate student login only when A != B.
        let studentUser = null;

        if (!sameNumber) {
          studentUser = new User({
            mobile_number: studentMobile,
            full_name: data.full_name,
            role: "student",
            password_hash: studentPasswordHash,
            mobile_verified_at: verifiedAt,
            status: "active",
          });

          await studentUser.save({ session });
        }

        // 9. Create the student profile in both cases.
        const studentProfile = new Student({
          parentUser: parentUser._id,
          studentUser: studentUser?._id ?? null,

          fullName: data.full_name,
          email: data.email,
          dateOfBirth: studentDob,
          gender: data.gender,
          religion: data.religion,
          caste: data.caste,
          community: data.community,
          motherTongue: data.mother_tongue,
          bloodGroup: data.blood_group,
        });

        await studentProfile.save({ session });

        responseData = {
          success: true,
          message: "Registration completed successfully.",
          account_type: sameNumber
            ? "parent_only"
            : "parent_and_student",
          student_account_created: !sameNumber,
          student_profile_created: true,
        };
      });
    } finally {
      await session.endSession();
      session = null;
    }

    return res.status(201).json(responseData);
  } catch (error) {
    if (error.message === "ACCOUNT_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists for one of these mobile numbers.",
      });
    }

    if (
      error.message === "VERIFICATION_GRANT_INVALID_OR_EXPIRED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mobile verification has expired or is invalid. Please verify again.",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists for this mobile number.",
      });
    }

    return next(error);
  } finally {
    // Ensure a session is closed if an error occurs before
    // the transaction's inner cleanup block.
    if (session) {
      await session.endSession();
    }
  }
}
