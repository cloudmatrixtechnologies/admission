// src/services/countries.js
export const COUNTRIES = [
  { name: 'India', dialCode: '+91', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'United Arab Emirates', dialCode: '+971', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Saudi Arabia', dialCode: '+966', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Qatar', dialCode: '+974', minLen: 8, maxLen: 8, placeholder: 'Enter 8-digit mobile number' },
  { name: 'Oman', dialCode: '+968', minLen: 8, maxLen: 8, placeholder: 'Enter 8-digit mobile number' },
  { name: 'Kuwait', dialCode: '+965', minLen: 8, maxLen: 8, placeholder: 'Enter 8-digit mobile number' },
  { name: 'Bahrain', dialCode: '+973', minLen: 8, maxLen: 8, placeholder: 'Enter 8-digit mobile number' },
  { name: 'Singapore', dialCode: '+65', minLen: 8, maxLen: 8, placeholder: 'Enter 8-digit mobile number' },
  { name: 'Malaysia', dialCode: '+60', minLen: 9, maxLen: 10, placeholder: 'Enter 9–10 digit mobile number' },
  { name: 'United States', dialCode: '+1', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'United Kingdom', dialCode: '+44', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'Canada', dialCode: '+1', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'Australia', dialCode: '+61', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'New Zealand', dialCode: '+64', minLen: 8, maxLen: 10, placeholder: 'Enter 8–10 digit mobile number' },
  { name: 'Germany', dialCode: '+49', minLen: 10, maxLen: 11, placeholder: 'Enter 10–11 digit mobile number' },
  { name: 'France', dialCode: '+33', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Italy', dialCode: '+39', minLen: 9, maxLen: 10, placeholder: 'Enter 9–10 digit mobile number' },
  { name: 'Spain', dialCode: '+34', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Netherlands', dialCode: '+31', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Switzerland', dialCode: '+41', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Japan', dialCode: '+81', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'South Korea', dialCode: '+82', minLen: 9, maxLen: 10, placeholder: 'Enter 9–10 digit mobile number' },
  { name: 'Sri Lanka', dialCode: '+94', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
  { name: 'Nepal', dialCode: '+977', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'Bangladesh', dialCode: '+880', minLen: 10, maxLen: 10, placeholder: 'Enter 10-digit mobile number' },
  { name: 'South Africa', dialCode: '+27', minLen: 9, maxLen: 9, placeholder: 'Enter 9-digit mobile number' },
];

export function getCountryByDialCode(dialCode = '+91') {
  return COUNTRIES.find((c) => c.dialCode === dialCode) || COUNTRIES[0];
}

export function isValidPhoneForDialCode(number, dialCode = '+91') {
  const digits = String(number || '').replace(/\D/g, '');
  const country = getCountryByDialCode(dialCode);
  if (dialCode === '+91') {
    return /^[6-9]\d{9}$/.test(digits);
  }
  return digits.length >= country.minLen && digits.length <= country.maxLen;
}