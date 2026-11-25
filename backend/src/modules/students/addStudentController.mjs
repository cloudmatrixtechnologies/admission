
import mongoose from "mongoose";

import User from "../users/userModel.mjs";
import Student from "./studentModel.mjs";
import Family from "../family/familyModel.mjs";

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

    // 3. Normalize the student mobile number only when provided.
    let studentMobile = null;

    if (data.mobileNumber) {
      try {
        studentMobile = normalizeMobile(
          data.mobileNumber,
          data.mobileCountry
        );
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid student mobile number or country selection.",
        });
      }
    }

    const studentDob = new Date(
      `${data.dateOfBirth}T00:00:00.000Z`
    );

    // 4. Start the MongoDB transaction.
    session = await mongoose.startSession();

    let responseData;

    try {
      await session.withTransaction(async () => {
        // 5. Retrieve the parent's registered mobile number.
        const parentUser = await User.findById(parentUserId)
          .select("mobileNumber")
          .session(session)
          .lean();

        if (!parentUser) {
          throw new Error("PARENT_ACCOUNT_NOT_FOUND");
        }

        // 6. Verify the student mobile only when provided.
        if (studentMobile) {
          await consumeVerificationGrant({
            mobile: studentMobile,
            purpose: "registration",
            token: data.mobileVerificationToken,
            session,
          });

          // Do not silently link an existing account.
          const existingUser = await User.findOne({
            mobileNumber: studentMobile,
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
        }

        // 7. Create the student profile.
        const studentProfile = new Student({
          parentUser: parentUserId,
          studentUser: null,
          parentRelationship: data.parentRelationship,
          studentMobile: studentMobile || undefined,

          fullName: data.fullName,
          email: data.email,
          dateOfBirth: studentDob,
          gender: data.gender,
          religion: data.religion,
          caste: data.caste,
          community: data.community,
          motherTongue: data.motherTongue,
          bloodGroup: data.bloodGroup,
        });

        await studentProfile.save({ session });

        // 8. Put the parent's registered number
        // into the field matching their relationship.
        const familyData = {
          student: studentProfile._id,
        };

        if (data.parentRelationship === "father") {
          familyData.father = {
            mobileNumber: parentUser.mobileNumber,
          };
        } else if (data.parentRelationship === "mother") {
          familyData.mother = {
            mobileNumber: parentUser.mobileNumber,
          };
        } else if (data.parentRelationship === "guardian") {
          familyData.guardian = {
            mobileNumber: parentUser.mobileNumber,
          };
        }

        const familyProfile = new Family(familyData);

        await familyProfile.save({ session });

        // 9. Prepare the response.
        responseData = {
          success: true,
          message: "Student profile added successfully.",
          student: {
            id: studentProfile._id.toString(),
            fullName: studentProfile.fullName,
            parentRelationship: studentProfile.parentRelationship,
            email: studentProfile.email,
            dateOfBirth: studentProfile.dateOfBirth,
            studentMobile: studentProfile.studentMobile ?? null,
            studentUser: studentProfile.studentUser ?? null,
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
    if (error.message === "PARENT_ACCOUNT_NOT_FOUND") {
      return res.status(401).json({
        success: false,
        message: "Parent account not found.",
      });
    }

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
