import {
  apiRequest,
  USE_MOCK_AUTH,
  saveAuthToken,
  removeAuthToken,
} from './mobileApiClient';

export async function requestRegistrationOtp(mobileNumber) {
  if (USE_MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      success: true,
      message: 'Dev OTP sent (enter any 6 digits, e.g. 123456).',
    };
  }

  return apiRequest('/auth/otp/request', {
    method: 'POST',
    body: {
      mobileNumber: mobileNumber.trim(),
      country: 'IN',
      purpose: 'registration',
    },
  });
}

export async function verifyRegistrationOtp(mobileNumber, otp) {
  if (USE_MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      success: true,
      verificationToken: `dev_verify_${mobileNumber}_${Date.now()}`,
    };
  }

  const result = await apiRequest('/auth/otp/verify', {
    method: 'POST',
    body: {
      mobileNumber: mobileNumber.trim(),
      country: 'IN',
      otp: otp.trim(),
      purpose: 'registration',
    },
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
    throw new Error('OTP verified, but verification token was missing.');
  }

  return { ...result, verificationToken };
}

export async function registerStudentAccount(formData) {
  const isSameNumber =
    formData.mobileNumber.trim() === formData.guardianMobile.trim();

  if (USE_MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 450));
    const mockToken = `mock_jwt_${Date.now()}`;
    await saveAuthToken(mockToken);
    return {
      success: true,
      token: mockToken,
      accountType: isSameNumber ? 'parentOnly' : 'parentAndStudent',
      user: {
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        guardianMobile: formData.guardianMobile.trim(),
        email: formData.email.trim(),
        accountType: isSameNumber ? 'parentOnly' : 'parentAndStudent',
      },
    };
  }

  const payload = {
    mobileNumber: formData.mobileNumber.trim(),
    mobileCountry: 'IN',
    guardianMobile: formData.guardianMobile.trim(),
    guardianCountry: 'IN',
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    dob: formData.dob.trim(),
    gender: formData.gender.toLowerCase(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    mobileVerificationToken: formData.mobileVerificationToken,
    ...(!isSameNumber && formData.guardianVerificationToken
      ? { guardianVerificationToken: formData.guardianVerificationToken }
      : {}),
  };

  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });

  const token = result?.token || result?.data?.token;
  if (token) await saveAuthToken(token);

  return result;
}

export async function loginStudentAccount({ mobileNumber, password }) {
  if (USE_MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 400));
    const mockToken = `mock_jwt_${Date.now()}`;
    await saveAuthToken(mockToken);
    return {
      success: true,
      token: mockToken,
      user: {
        fullName: 'Student User',
        mobileNumber: mobileNumber.trim(),
        email: 'student@admizan.in',
        accountType: 'parentAndStudent',
      },
    };
  }

  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      mobileNumber: mobileNumber.trim(),
      password,
    },
  });

  const token = result?.token || result?.data?.token;
  if (token) await saveAuthToken(token);

  return result;
}

export async function logoutStudentAccount() {
  await removeAuthToken();
}