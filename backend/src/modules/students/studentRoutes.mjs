
import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { allowRoles } from "../auth/roleMiddleware.mjs";

import { requireStudentProfileAccess } from "./studentAccessMiddleware.mjs";
import { addStudentController } from "./addStudentController.mjs";

import Student from "./studentModel.mjs";

const router = Router();

// Add another student profile.
// Only authenticated parent accounts are allowed.
router.post(
  "/",
  requireAuth,
  allowRoles("parent"),
  addStudentController
);

// Return only the student profiles linked to the logged-in user.
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let ownershipFilter;

    if (role === "parent") {
      ownershipFilter = { parentUser: userId };
    } else if (role === "student") {
      ownershipFilter = { studentUser: userId };
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access student profiles.",
      });
    }

    const students = await Student.find({
      ...ownershipFilter,
      status: "active",
    })
      .select(
        "fullName email dateOfBirth gender religion caste community motherTongue bloodGroup academic status createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Student profiles retrieved successfully.",
      count: students.length,
      students: students.map((student) => ({
        id: student._id.toString(),
        fullName: student.fullName,
        email: student.email,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        religion: student.religion,
        caste: student.caste,
        community: student.community,
        motherTongue: student.motherTongue,
        bloodGroup: student.bloodGroup,
        academic: student.academic,
        status: student.status,
        createdAt: student.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

// Retrieve one student profile after checking ownership.
router.get(
  "/:studentId",
  requireAuth,
  requireStudentProfileAccess,
  (req, res) => {
    const student = req.studentProfile;

    return res.status(200).json({
      success: true,
      message: "Student profile retrieved successfully.",
      student: {
        id: student._id.toString(),
        fullName: student.fullName,
        email: student.email,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        religion: student.religion,
        caste: student.caste,
        community: student.community,
        motherTongue: student.motherTongue,
        bloodGroup: student.bloodGroup,
        academic: student.academic,
        status: student.status,
      },
    });
  }
);

export default router;
