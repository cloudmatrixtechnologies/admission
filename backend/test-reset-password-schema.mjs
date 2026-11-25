
import resetPasswordSchema from "./src/modules/auth/resetPasswordSchema.mjs";

const validData = {
  mobileNumber: "9360592000",
  mobileCountry: "IN",
  verificationToken: "A".repeat(43),
  newPassword: "Strong@123",
  confirmPassword: "Strong@123",
};

const tests = [
  {
    name: "Valid password",
    data: validData,
    expected: true,
  },
  {
    name: "Password shorter than 8 characters",
    data: { ...validData, newPassword: "Ab@123", confirmPassword: "Ab@123" },
    expected: false,
  },
  {
    name: "Password exceeding 72 UTF-8 bytes",
    data: {
      ...validData,
      newPassword: "Aa1@" + "é".repeat(35),
      confirmPassword: "Aa1@" + "é".repeat(35),
    },
    expected: false,
  },
  {
    name: "Missing uppercase letter",
    data: {
      ...validData,
      newPassword: "strong@123",
      confirmPassword: "strong@123",
    },
    expected: false,
  },
  {
    name: "Missing lowercase letter",
    data: {
      ...validData,
      newPassword: "STRONG@123",
      confirmPassword: "STRONG@123",
    },
    expected: false,
  },
  {
    name: "Missing number",
    data: {
      ...validData,
      newPassword: "Strong@abc",
      confirmPassword: "Strong@abc",
    },
    expected: false,
  },
  {
    name: "Missing special character",
    data: {
      ...validData,
      newPassword: "Strong123",
      confirmPassword: "Strong123",
    },
    expected: false,
  },
  {
    name: "Password confirmation mismatch",
    data: { ...validData, confirmPassword: "Different@123" },
    expected: false,
  },
  {
    name: "Invalid verification token",
    data: { ...validData, verificationToken: "invalid-token" },
    expected: false,
  },
  {
    name: "Unexpected field",
    data: { ...validData, extraField: "not-allowed" },
    expected: false,
  },
];

let passed = 0;

for (const test of tests) {
  const result = resetPasswordSchema.safeParse(test.data);
  const success = result.success === test.expected;

  console.log(`${success ? "PASS" : "FAIL"} - ${test.name}`);

  if (success) passed++;
  else console.log(result.error?.issues);
}

console.log(`\nResult: ${passed}/${tests.length} tests passed.`);
