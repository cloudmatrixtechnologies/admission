
import mongoose from "mongoose";
import Student from "./studentModel.mjs";

export async function requireStudentProfileAccess(req, res, next) {
  try {
    const studentId = req.params.studentId;

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student profile ID.",
      });
    }

    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

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

    const student = await Student.findOne({
      _id: studentId,
      ...ownershipFilter,
    });

    if (!student || student.status !== "active") {
      // Do not reveal whether another user's profile exists.
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    req.studentProfile = student;

    return next();
  } catch (error) {
    return next(error);
  }
}
