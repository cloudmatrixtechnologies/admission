
import { z } from "zod";

const optionalMobileSchema = z.preprocess(
  (value) =>
    typeof value === "string" && !value.trim()
      ? undefined
      : value,
  z
    .string()
    .trim()
    .min(1, "Student mobile number cannot be empty.")
    .max(30, "Invalid mobile number.")
    .optional()
);

const countrySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{2}$/, "Use a valid two-letter country code.")
  .transform((value) => value.toUpperCase())
  .optional();

const optionalVerificationTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43}$/, "Invalid verification token.")
  .optional();

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
  .strictObject({
    mobileNumber: optionalMobileSchema,
    mobileCountry: countrySchema,

    fullName: z
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

    dateOfBirth: z.string().refine(isValidPastDate, {
      message: "Enter a valid date of birth in YYYY-MM-DD format.",
    }),

    gender: z.enum(["male", "female", "other"]).optional(),
    religion: z.string().trim().max(100).optional(),
    caste: z.string().trim().max(100).optional(),
    community: z.enum(["OC", "BC", "MBC", "SC", "ST"]).optional(),
    motherTongue: z.string().trim().max(100).optional(),

    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional(),

    mobileVerificationToken: optionalVerificationTokenSchema,
  })
  .superRefine((data, ctx) => {
    if (data.mobileNumber && !data.mobileVerificationToken) {
      ctx.addIssue({
        code: "custom",
        path: ["mobileVerificationToken"],
        message: "Verify the student mobile number using OTP.",
      });
    }

    if (!data.mobileNumber && data.mobileVerificationToken) {
      ctx.addIssue({
        code: "custom",
        path: ["mobileNumber"],
        message:
          "Student mobile number is required when providing a verification token.",
      });
    }
  });
