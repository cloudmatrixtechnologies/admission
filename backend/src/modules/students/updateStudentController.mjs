
import { updateStudentSchema } from "./updateStudentSchema.mjs";

export async function updateStudentController(req, res, next) {
  try {
    // 1. Get the authenticated user and authorized student profile.
    const role = req.user?.role;
    const studentProfile = req.studentProfile;

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    if (role !== "parent" && role !== "student") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update student profiles.",
      });
    }

    // 2. Validate the submitted fields.
    const parsed = updateStudentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student update details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;

    // 3. Only parents can change their relationship to the student.
    if (
      role === "student" &&
      Object.hasOwn(data, "parentRelationship")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only parent accounts can update this relationship.",
      });
    }

    // 4. Update only the permitted personal fields.
    const personalFields = [
      "parentRelationship",
      "fullName",
      "email",
      "dateOfBirth",
      "gender",
      "religion",
      "caste",
      "community",
      "motherTongue",
      "bloodGroup",
    ];

    for (const field of personalFields) {
      if (Object.hasOwn(data, field)) {
        if (field === "dateOfBirth") {
          studentProfile.set(
            field,
            new Date(`${data[field]}T00:00:00.000Z`)
          );
        } else {
          studentProfile.set(field, data[field]);
        }
      }
    }

    // 5. Update academic fields individually.
    // Existing academic values remain unchanged.
    if (data.academic) {
      for (const [field, value] of Object.entries(data.academic)) {
        studentProfile.set(`academic.${field}`, value);
      }
    }

    // 6. Save the updated student profile.
    await studentProfile.save();

    // 7. Return the updated profile.
    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully.",
      student: {
        id: studentProfile._id.toString(),
        parentRelationship: studentProfile.parentRelationship,
        fullName: studentProfile.fullName,
        email: studentProfile.email,
        dateOfBirth: studentProfile.dateOfBirth,
        gender: studentProfile.gender,
        religion: studentProfile.religion,
        caste: studentProfile.caste,
        community: studentProfile.community,
        motherTongue: studentProfile.motherTongue,
        bloodGroup: studentProfile.bloodGroup,
        academic: studentProfile.academic,
        status: studentProfile.status,
        updatedAt: studentProfile.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}
