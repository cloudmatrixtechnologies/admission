
import { z } from "zod";

const mobileSchema = z
  .string()
  .trim()
  .min(1, "Student mobile number is required.")
  .max(30, "Invalid mobile number.");

const countrySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{2}$/, "Use a valid two-letter country code.")
  .transform((value) => value.toUpperCase())
  .optional();

const verificationTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43}$/, "Invalid verification token.");

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

export const addStudentSchema = z
  .object({
    // Student mobile number.
    mobile_number: mobileSchema,
    mobile_country: countrySchema,

    // Student details.
    full_name: z
      .string()
      .trim()
      .min(1, "Student name is required.")
      .max(100, "Student name is too long."),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254, "Email address is too long.")
      .transform((value) => value.toLowerCase()),

    dob: z.string().refine(isValidPastDate, {
      message: "Enter a valid date of birth in YYYY-MM-DD format.",
    }),

    gender: z.enum(["male", "female", "other"]).optional(),

    religion: z.string().trim().max(100).optional(),
    caste: z.string().trim().max(100).optional(),

    community: z
      .enum(["OC", "BC", "MBC", "SC", "ST"])
      .optional(),

    mother_tongue: z.string().trim().max(100).optional(),

    blood_group: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),

    // Token returned after successful student mobile OTP verification.
    mobile_verification_token: verificationTokenSchema,
  })
  .strict();
