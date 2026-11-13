
  import {
    generateStudentPhotoUrl,
  } from "../../services/storages/storageService.mjs";

  export async function getStudentPhotoController(req, res, next) {
    try {
      const student = req.studentProfile;

      if (
        !student.photo?.storageKey ||
        !student.photo?.format
      ) {
        return res.status(404).json({
          success: false,
          message: "Student photo not found.",
        });
      }

      const photoUrl = generateStudentPhotoUrl(
        student.photo.storageKey,
        student.photo.format
      );

      return res.redirect(302, photoUrl);
    } catch (error) {
      console.error("Student photo retrieval failed:", error);

      return next(
        Object.assign(
          new Error("Unable to retrieve student photo."),
          { statusCode: 502 }
        )
      );
    }
  }
