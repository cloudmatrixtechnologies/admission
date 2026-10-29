
import { Router } from "express";

import { requireAuth } from "../auth/authMiddleware.mjs";
import { requireStudentProfileAccess } from "./studentAccessMiddleware.mjs";

const router = Router();

// Retrieve one student profile only if the logged-in user owns or is
// linked to that profile.
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
