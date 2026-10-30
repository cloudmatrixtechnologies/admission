
import mongoose from "mongoose";

import User from "../users/userModel.mjs";
import Student from "./studentModel.mjs";

import { addStudentSchema } from "./addStudentSchema.mjs";
import { consumeVerificationGrant } from "../auth/verificationGrantService.mjs";
import { normalizeMobile } from "../../utils/normalizeMobile.mjs";

export async function addStudentController(req, res, next) {
  let session;

  try {
    // 1. Only an authenticated parent can add a student.
    const parentUserId = req.user?.id;

    if (!parentUserId || req.user?.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Only parent accounts can add student profiles.",
      });
    }

    if (!mongoose.isValidObjectId(parentUserId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid authenticated user.",
      });
    }

    // 2. Validate the submitted student details.
    const parsed = addStudentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;

    // 3. Normalize the student mobile number.
    let studentMobile;

    try {
      studentMobile = normalizeMobile(
        data.mobile_number,
        data.mobile_country
      );
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid student mobile number or country selection.",
      });
    }

    const studentDob = new Date(
      `${data.dob}T00:00:00.000Z`
    );

    // 4. Start the MongoDB transaction.
    session = await mongoose.startSession();

    let responseData;

    try {
      await session.withTransaction(async () => {
        // 5. Consume the OTP verification grant.
        // This token must belong to the submitted student mobile.
        await consumeVerificationGrant({
          mobile: studentMobile,
          purpose: "registration",
          token: data.mobile_verification_token,
          session,
        });

        // 6. Do not silently link an existing account.
        // Student mobile numbers must be new.
        const existingUser = await User.findOne({
          mobile_number: studentMobile,
        })
          .select("_id")
          .session(session)
          .lean();

        if (existingUser) {
          throw new Error("STUDENT_MOBILE_ALREADY_EXISTS");
        }

        // Also prevent duplicate student profiles.
        const existingStudent = await Student.findOne({
          studentMobile,
        })
          .select("_id")
          .session(session)
          .lean();

        if (existingStudent) {
          throw new Error("STUDENT_PROFILE_ALREADY_EXISTS");
        }

        // 7. Create only a student profile.
        // Do not create another parent or student login account.
        const studentProfile = new Student({
          parentUser: parentUserId,
          studentUser: null,

          studentMobile,

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

        // 8. Prepare the response.
        responseData = {
          success: true,
          message: "Student profile added successfully.",
          student: {
            id: studentProfile._id,
            fullName: studentProfile.fullName,
            email: studentProfile.email,
            dateOfBirth: studentProfile.dateOfBirth,
            studentMobile: studentProfile.studentMobile,
            status: studentProfile.status,
            createdAt: studentProfile.createdAt,
          },
        };
      });
    } finally {
      await session.endSession();
      session = null;
    }

    return res.status(201).json(responseData);
  } catch (error) {
    if (
      error.message === "STUDENT_MOBILE_ALREADY_EXISTS" ||
      error.message === "STUDENT_PROFILE_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number is already associated with an existing account or student profile.",
      });
    }

    if (
      error.message === "VERIFICATION_GRANT_INVALID_OR_EXPIRED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student mobile verification has expired or is invalid. Please verify again.",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number is already associated with an existing account or student profile.",
      });
    }

    return next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
