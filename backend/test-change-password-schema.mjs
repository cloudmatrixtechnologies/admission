
import changePasswordSchema from "./src/modules/auth/changePasswordSchema.mjs";

const tests = [
  {
    name: "Valid password",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    },
    expected: true,
  },
  {
    name: "Password shorter than 8 characters",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "Ab@123",
      confirmPassword: "Ab@123",
    },
    expected: false,
  },
  {
    name: "Password exceeds 72 bytes",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "A".repeat(71) + "a1@",
      confirmPassword: "A".repeat(71) + "a1@",
    },
    expected: false,
  },
  {
    name: "Password missing uppercase",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "newpassword@123",
      confirmPassword: "newpassword@123",
    },
    expected: false,
  },
  {
    name: "Password confirmation mismatch",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "NewPassword@123",
      confirmPassword: "DifferentPassword@123",
    },
    expected: false,
  },
  {
    name: "Unexpected field",
    data: {
      currentPassword: "OldPassword@123",
      newPassword: "NewPassword@123",
      confirmPassword: "NewPassword@123",
      role: "superAdmin",
    },
    expected: false,
  },
];

let failed = 0;

for (const test of tests) {
  const result = changePasswordSchema.safeParse(test.data);
  const passed = result.success === test.expected;

  console.log(`${passed ? "PASS" : "FAIL"} - ${test.name}`);

  if (!passed) failed++;
}

console.log(`\n${tests.length - failed}/${tests.length} tests passed.`);
process.exitCode = failed === 0 ? 0 : 1;
