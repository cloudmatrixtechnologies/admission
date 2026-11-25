
import Family from "./familyModel.mjs";

export async function getFamilyDetails(studentId) {
  return Family.findOne({ student: studentId }).lean();
}

export async function upsertFamilyDetails(studentId, data) {
  const updateData = {};

  for (const [key, value] of Object.entries(data)) {
    // Preserve existing fields when only some parent/guardian
    // details are being updated.
    if (
      ["father", "mother", "guardian"].includes(key) &&
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        updateData[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      // Other fields, including siblings and guardian: null,
      // are updated as complete values.
      updateData[key] = value;
    }
  }

  const family = await Family.findOneAndUpdate(
    { student: studentId },
    {
      $set: updateData,
      $setOnInsert: { student: studentId },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return family;
}
