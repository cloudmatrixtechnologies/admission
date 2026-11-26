// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USE_MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === 'true';

async function postJson(endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        (response.status === 429
          ? 'Too many requests. Please wait before trying again.'
          : 'Request failed. Please check your details and try again.')
    );
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

/**
 * Step 1 & Step 2: Request 6-digit OTP
 * Matches Dilep's payload: { mobileNumber, mobileCountry, purpose }
 */
export async function requestRegistrationOtp(mobileNumber, mobileCountry = '+91') {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      message: 'Offline test mode: enter any 6 digits (e.g., 123456).',
    };
  }

  return postJson('/auth/otp/request', {
    mobileNumber: mobileNumber.trim(),
    mobileCountry: mobileCountry || '+91',
    purpose: 'registration',
  });
}

/**
 * Step 1 & Step 2: Verify 6-digit OTP
 * Matches Dilep's payload: { mobileNumber, mobileCountry, otp, purpose }
 */
export async function verifyRegistrationOtp(mobileNumber, otp, mobileCountry = '+91') {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      verificationToken: `mock_token_${mobileNumber}_${Date.now()}`,
    };
  }

  const result = await postJson('/auth/otp/verify', {
    mobileNumber: mobileNumber.trim(),
    mobileCountry: mobileCountry || '+91',
    otp: otp.trim(),
    purpose: 'registration',
  });

  const verificationToken =
    result?.verificationToken ||
    result?.mobileVerificationToken ||
    result?.guardianVerificationToken ||
    result?.token ||
    result?.data?.verificationToken ||
    result?.data?.token ||
    '';

  if (!verificationToken) {
    throw new Error('OTP verified, but verification token was missing in server response.');
  }

  return {
    ...result,
    verificationToken,
  };
}

export async function resetStudentPassword({
  mobileNumber,
  mobileCountry = '+91',
  otp,
  newPassword,
  confirmPassword,
}) {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      message: 'OTP verified and new password saved.',
    };
  }
  return postJson('/auth/password/reset', {
    mobileNumber: mobileNumber.trim(),
    mobileCountry,
    otp: otp.trim(),
    newPassword,
    confirmPassword,
  });
}

/**
 * Step 5: Submit Student & Parent Registration (Case A: Same Number | Case B: Different Numbers)
 * Matches Dilep's payload: mobileNumber, mobileCountry, guardianMobile, guardianCountry,
 * parentRelationship, fullName, email, dateOfBirth, gender, password, confirmPassword,
 * mobileVerificationToken, guardianVerificationToken (Case B only)
 */
export async function registerStudentAccount(formData) {
  const studentCountry = formData.mobileCountry || '+91';
  const parentCountry = formData.guardianCountry || '+91';
  const isSameNumber =
    studentCountry === parentCountry &&
    formData.mobileNumber.trim() === formData.guardianMobile.trim();

  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Registration completed successfully.',
      accountType: isSameNumber ? 'parentOnly' : 'parentAndStudent',
      studentAccountCreated: !isSameNumber,
      studentProfileCreated: true,
    };
  }

  const payload = {
    mobileNumber: formData.mobileNumber.trim(),
    mobileCountry: studentCountry,
    guardianMobile: formData.guardianMobile.trim(),
    guardianCountry: parentCountry,
    parentRelationship: (formData.parentRelationship || 'father').toLowerCase(),
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    dateOfBirth: formData.dateOfBirth || formData.dob,
    gender: formData.gender.toLowerCase(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    mobileVerificationToken: formData.mobileVerificationToken,
    ...(!isSameNumber && formData.guardianVerificationToken
      ? { guardianVerificationToken: formData.guardianVerificationToken }
      : {}),
    ...(formData.religion ? { religion: formData.religion } : {}),
    ...(formData.caste ? { caste: formData.caste.trim() } : {}),
    ...(formData.community ? { community: formData.community } : {}),
    ...(formData.motherTongue ? { motherTongue: formData.motherTongue } : {}),
    ...(formData.bloodGroup ? { bloodGroup: formData.bloodGroup } : {}),
    ...(formData.currentAddress?.addressLine1
      ? {
          currentAddress: formData.currentAddress,
          isSameAsPermanent: Boolean(formData.isSameAsPermanent),
          permanentAddress: formData.isSameAsPermanent
            ? formData.currentAddress
            : formData.permanentAddress,
        }
      : {}),
  };

  return postJson('/auth/register', payload);
}

/**
 * Student / Parent Password Sign In
 * Matches Dilep's payload: { mobileNumber, mobileCountry, password }
 */
export async function loginStudent({ mobileNumber, mobileCountry = '+91', password }) {
  if (USE_MOCK_AUTH) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      data: {
        token: `mock_login_jwt_${Date.now()}`,
        fullName: 'Student User',
        studentIdDisplay: 'STU00124',
        role: 'STUDENT',
      },
    };
  }

  return postJson('/auth/login', {
    mobileNumber: mobileNumber.trim(),
    mobileCountry: mobileCountry || '+91',
    password,
  });
}