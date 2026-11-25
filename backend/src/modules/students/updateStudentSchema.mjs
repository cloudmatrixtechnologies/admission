
import { z } from "zod";

// Validate that the date is a real calendar date in the past.
function isValidPastDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date < new Date()
  );
}

// Academic fields can be updated independently.
const academicUpdateSchema = z
  .strictObject({
    currentClass: z.string().trim().max(50).optional(),

    board: z.string().trim().max(100).optional(),

    passingYear: z
      .number()
      .int("Passing year must be a whole number.")
      .min(1950, "Passing year cannot be earlier than 1950.")
      .max(2100, "Passing year cannot be later than 2100.")
      .optional(),

    marksPercentage: z
      .number()
      .min(0, "Marks percentage cannot be below 0.")
      .max(100, "Marks percentage cannot exceed 100.")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one academic field to update.",
    }
  );

// Student profile partial update validation.
export const updateStudentSchema = z
  .strictObject({
    parentRelationship: z
      .enum(["father", "mother", "guardian"])
      .optional(),

    fullName: z
      .string()
      .trim()
      .min(1, "Student name cannot be empty.")
      .max(100, "Student name is too long.")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long.")
      .transform((value) => value.toLowerCase())
      .optional(),

    dateOfBirth: z
      .string()
      .refine(isValidPastDate, {
        message: "Enter a valid past date of birth in YYYY-MM-DD format.",
      })
      .optional(),

    gender: z
      .enum(["male", "female", "other"])
      .optional(),

    religion: z
      .string()
      .trim()
      .max(100)
      .optional(),

    caste: z
      .string()
      .trim()
      .max(100)
      .optional(),

    community: z
      .enum(["OC", "BC", "MBC", "SC", "ST"])
      .optional(),

    motherTongue: z
      .string()
      .trim()
      .max(100)
      .optional(),

    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),

    academic: academicUpdateSchema.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update.",
    }
  );
