
import { familyUpdateSchema } from "./familyValidation.mjs";
import {
  getFamilyDetails,
  upsertFamilyDetails,
} from "./familyService.mjs";

export async function getFamilyDetailsController(req, res, next) {
  try {
    const studentId = req.studentProfile._id;

    const family = await getFamilyDetails(studentId);

    return res.status(200).json({
      success: true,
      message: "Family details retrieved successfully.",
      family: family
        ? {
            id: family._id.toString(),
            student: family.student.toString(),
            father: family.father,
            mother: family.mother,
            guardian: family.guardian ?? null,
            siblings: family.siblings,
            annualFamilyIncome: family.annualFamilyIncome,
            totalFamilyMembers: family.totalFamilyMembers,
            residentialAddress: family.residentialAddress,
            district: family.district,
            state: family.state,
            pincode: family.pincode,
            createdAt: family.createdAt,
            updatedAt: family.updatedAt,
          }
        : null,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateFamilyDetailsController(req, res, next) {
  try {
    const parsed = familyUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid family details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const studentId = req.studentProfile._id;

    const family = await upsertFamilyDetails(studentId, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Family details saved successfully.",
      family: {
        id: family._id.toString(),
        student: family.student.toString(),
        father: family.father,
        mother: family.mother,
        guardian: family.guardian ?? null,
        siblings: family.siblings,
        annualFamilyIncome: family.annualFamilyIncome,
        totalFamilyMembers: family.totalFamilyMembers,
        residentialAddress: family.residentialAddress,
        district: family.district,
        state: family.state,
        pincode: family.pincode,
        createdAt: family.createdAt,
        updatedAt: family.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}
