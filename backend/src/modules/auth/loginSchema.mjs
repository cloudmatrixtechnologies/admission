
import { z } from "zod";

const loginSchema = z.strictObject({
  mobile_number: z
    .string()
    .trim()
    .min(1, "Mobile number is required.")
    .max(30, "Invalid mobile number."),

  country: z
    .string()
    .trim()
    .length(2, "Country must be a two-letter ISO code.")
    .toUpperCase()
    .optional(),

  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password is too long."),
});

export default loginSchema;
