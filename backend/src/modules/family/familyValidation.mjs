
import { z } from "zod";

const optionalName = z.string()
    .trim()
    .min(1, "Name cannot be empty.")
    .max(100, "Name is too long.")
    .optional();

const optionalMobile = z.string()
    .trim()
    .min(7, "Mobile number is too short.")
    .max(20, "Mobile number is too long.")
    .optional();

const optionalOccupation = z.string()
    .trim()
    .max(100, "Occupation is too long.")
    .optional();

const optionalEducation = z.string()
    .trim()
    .max(100, "Education is too long.")
    .optional();

const optionalIncome = z.number()
    .min(0, "Income cannot be negative.")
    .max(1000000000, "Income is too high.")
    .optional();

const parentDetailsSchema = z.strictObject({
    fullName: optionalName,
    mobileNumber: optionalMobile,
    occupation: optionalOccupation,
    annualIncome: optionalIncome,
    education: optionalEducation,
});

const guardianDetailsSchema = z.strictObject({
    fullName: optionalName,
    relationship: z.string().trim().min(1).max(50).optional(),
    mobileNumber: optionalMobile,
    occupation: optionalOccupation,
});

const siblingSchema = z.strictObject({
    fullName: z.string()
        .trim()
        .min(1, "Sibling name is required.")
        .max(100),
    age: z.number().int().min(0).max(120).optional(),
    education: optionalEducation,
    occupation: optionalOccupation,
});

const familyUpdateSchema = z.strictObject({
    father: parentDetailsSchema.optional(),
    mother: parentDetailsSchema.optional(),
    guardian: guardianDetailsSchema.nullable().optional(),
    siblings: z.array(siblingSchema).max(30).optional(),



    annualFamilyIncome: optionalIncome,

    totalFamilyMembers: z.number()
        .int()
        .min(1)
        .max(100)
        .optional(),



    residentialAddress: z.string()
        .trim()
        .min(1)
        .max(500)
        .optional(),

    district: z.string()
        .trim()
        .max(100)
        .optional(),

    state: z.string()
        .trim()
        .max(100)
        .optional(),

    pincode: z.string()
        .trim()
        .max(10)
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Provide at least one family detail to save.",
    }
);

export { familyUpdateSchema };
