// src/components/auth/WishlistAuthModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  requestRegistrationOtp,
  verifyRegistrationOtp,
  registerStudentAccount,
} from '../../services/authService';
import { getCountryByDialCode, isValidPhoneForDialCode } from '../../services/countries';
import CountryPhoneInput from '../common/CountryPhoneInput';
import './WishlistAuthModal.css';

export default function WishlistAuthModal({
  isOpen,
  onClose,
  pendingCollege = null,
  onRegistrationComplete,
}) {
  const isWishlistFlow = Boolean(pendingCollege);

  const [step, setStep] = useState(1);

  // Memory-only sensitive auth states (NEVER saved to localStorage/sessionStorage or logged)
  const [mobileCountry, setMobileCountry] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentOtp, setStudentOtp] = useState('');
  const [studentOtpSent, setStudentOtpSent] = useState(false);
  const [mobileVerificationToken, setMobileVerificationToken] = useState('');

  const [guardianCountry, setGuardianCountry] = useState('+91');
  const [guardianMobile, setGuardianMobile] = useState('');
  const [parentRelationship, setParentRelationship] = useState('father');
  const [guardianOtp, setGuardianOtp] = useState('');
  const [guardianOtpSent, setGuardianOtpSent] = useState(false);
  const [guardianVerificationToken, setGuardianVerificationToken] = useState('');

  // Step 3: Student Details Page
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [community, setCommunity] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [motherTongue, setMotherTongue] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');

  // Step 4: Address Details Page (Optional / Skippable)
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(true);
  const [currentAddress, setCurrentAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    state: 'Tamil Nadu',
    district: '',
    city: '',
    pincode: '',
  });
  const [permanentAddress, setPermanentAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    state: 'Tamil Nadu',
    district: '',
    city: '',
    pincode: '',
  });

  // Step 5: Create Password Page
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI & Cooldown states
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  // 60-second resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset sensitive memory state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setStudentOtp('');
      setStudentOtpSent(false);
      setMobileVerificationToken('');
      setGuardianOtp('');
      setGuardianOtpSent(false);
      setGuardianVerificationToken('');
      setPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setInfoMsg('');
      setCooldown(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedStudentCountry = getCountryByDialCode(mobileCountry);
  const selectedGuardianCountry = getCountryByDialCode(guardianCountry);

  const isSameNumber =
    mobileCountry === guardianCountry &&
    isValidPhoneForDialCode(mobileNumber, mobileCountry) &&
    mobileNumber.trim() === guardianMobile.trim();

  /* -------------------- STEP 1: STUDENT MOBILE & OTP -------------------- */
  const handleSendStudentOtp = async (e) => {
  if (e) e.preventDefault();
  setErrorMsg('');
  setInfoMsg('');

  const selectedCountry = getCountryByDialCode(mobileCountry);
  if (!isValidPhoneForDialCode(mobileNumber, mobileCountry)) {
    setErrorMsg(
      `Please enter a valid ${selectedCountry.name} (${selectedCountry.dialCode}) mobile number.`
    );
    return;
  }

  setIsLoading(true);
  try {
    await requestRegistrationOtp(mobileNumber, mobileCountry);
    setStudentOtpSent(true);
    setCooldown(60);
    setInfoMsg(
      `6-digit OTP sent to ${selectedCountry.dialCode} ${mobileNumber} (valid for 5 minutes).`
    );
  } catch (err) {
    setErrorMsg(err?.message || 'Failed to send OTP. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleVerifyStudentOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!/^\d{6}$/.test(studentOtp)) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRegistrationOtp(mobileNumber, studentOtp, mobileCountry);
      setMobileVerificationToken(res.verificationToken);
      setStudentOtp('');
      setCooldown(0);
      setGuardianCountry(mobileCountry);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- STEP 2: PARENT MOBILE & RELATIONSHIP -------------------- */
  const handleParentStepAction = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!parentRelationship) {
      setErrorMsg('Please select your relationship with the parent/guardian.');
      return;
    }

    if (!isValidPhoneForDialCode(guardianMobile, guardianCountry)) {
      setErrorMsg(
        `Please enter a valid ${selectedGuardianCountry.name} (${selectedGuardianCountry.dialCode}) parent/guardian mobile number.`
      );
      return;
    }

    if (isSameNumber) {
      setGuardianVerificationToken('');
      setStep(3);
      return;
    }

    if (!guardianOtpSent) {
      setIsLoading(true);
      try {
        await requestRegistrationOtp(guardianMobile, guardianCountry);
        setGuardianOtpSent(true);
        setCooldown(60);
        setInfoMsg(
          `OTP sent to ${selectedGuardianCountry.dialCode} ${guardianMobile}.`
        );
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!/^\d{6}$/.test(guardianOtp)) {
      setErrorMsg('Please enter the 6-digit OTP sent to the parent number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRegistrationOtp(guardianMobile, guardianOtp, guardianCountry);
      setGuardianVerificationToken(res.verificationToken);
      setGuardianOtp('');
      setCooldown(0);
      setStep(3);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- STEP 3 -> STEP 4: VALIDATE STUDENT DETAILS -------------------- */
  const handleStudentDetailsNext = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter the student’s full name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!dateOfBirth) {
      setErrorMsg('Please select the date of birth.');
      return;
    }

    setStep(4);
  };

  /* -------------------- STEP 4 -> STEP 5: ADDRESS DETAILS (OR SKIP) -------------------- */
  const handleAddressNext = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (currentAddress.pincode && !/^\d{6}$/.test(currentAddress.pincode)) {
      setErrorMsg('Current address pincode must be 6 digits.');
      return;
    }
    if (
      !isSameAsPermanent &&
      permanentAddress.pincode &&
      !/^\d{6}$/.test(permanentAddress.pincode)
    ) {
      setErrorMsg('Permanent address pincode must be 6 digits.');
      return;
    }

    setStep(5);
  };

  const handleSkipAddress = () => {
    setErrorMsg('');
    setInfoMsg('');
    setCurrentAddress({
      addressLine1: '',
      addressLine2: '',
      state: 'Tamil Nadu',
      district: '',
      city: '',
      pincode: '',
    });
    setStep(5);
  };

  /* -------------------- STEP 5 -> STEP 6: CREATE PASSWORD & REGISTER -------------------- */
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerStudentAccount({
        mobileNumber,
        mobileCountry,
        guardianMobile,
        guardianCountry,
        parentRelationship,
        fullName,
        email,
        dateOfBirth,
        gender,
        password,
        confirmPassword,
        mobileVerificationToken,
        guardianVerificationToken,
        religion,
        caste,
        community,
        motherTongue,
        bloodGroup,
        currentAddress,
        isSameAsPermanent,
        permanentAddress,
      });

      setPassword('');
      setConfirmPassword('');
      setMobileVerificationToken('');
      setGuardianVerificationToken('');

      setRegistrationResult(response);
      setStep(6);

      if (onRegistrationComplete) {
        onRegistrationComplete({
          college: pendingCollege || null,
          registrationResponse: response,
          studentSummary: {
            fullName: fullName.trim(),
            mobileNumber: mobileNumber.trim(),
            mobileCountry,
            guardianMobile: guardianMobile.trim(),
            guardianCountry,
            parentRelationship,
            preferredCollegeId: pendingCollege?.collegeId || null,
            leadSource: 'WEBSITE',
            leadStatus: 'NEW',
          },
        });
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="wl-modal-backdrop" onClick={onClose}>
      <div
        className={`wl-modal-shell ${
          step === 4 && !isSameAsPermanent ? 'wl-allow-scroll' : 'wl-lock-scroll'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="wl-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        

        {/* RIGHT COLUMN */}
        <section className="wl-form-pane">
          {errorMsg && <div className="wl-alert wl-alert-error">{errorMsg}</div>}
          {infoMsg && <div className="wl-alert wl-alert-info">{infoMsg}</div>}

<div className="wl-brand-header">
            <div className="wl-brand-logo-wrap">
              <img
                src="/brand_logo.png"
                alt="ADMIZAN"
                className="wl-brand-logo"
              />
            </div>
            <h2 className="wl-brand-heading">
              <span className="wl-brand-name">ADMIZAN</span>
              <br />
              Registration
            </h2>
          </div>

          {step === 1 ? (
            /* ==================== STEP 1: STUDENT MOBILE & OTP ==================== */
            <form
              onSubmit={studentOtpSent ? handleVerifyStudentOtp : handleSendStudentOtp}
              className="wl-step-content"
            >
              
              <h2>Verify Student Mobile</h2>
              <p className="wl-step-desc">
               Enter your mobile number to Register in the ADMIZAN.
              </p>

              <label className="wl-label">Student Mobile Number *</label>
              <CountryPhoneInput
                id="reg-student-mobile"
                country={mobileCountry}
                onCountryChange={(iso) => {
                  setMobileCountry(iso);
                  setErrorMsg('');
                }}
                value={mobileNumber}
                onChange={(val) => setMobileNumber(val)}
                disabled={studentOtpSent}
                required
                rightAction={
                  studentOtpSent ? (
                    <button
                      type="button"
                      className="wl-text-link"
                      onClick={() => {
                        setStudentOtpSent(false);
                        setStudentOtp('');
                        setCooldown(0);
                      }}
                    >
                      Edit
                    </button>
                  ) : null
                }
              />

              {studentOtpSent && (
                <>
                  <div className="wl-label-between">
                    <label className="wl-label">Enter 6-Digit OTP *</label>
                    {cooldown > 0 ? (
                      <span className="wl-timer">Resend in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        className="wl-text-link"
                        disabled={isLoading}
                        onClick={() => handleSendStudentOtp()}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="wl-input wl-otp-input"
                    placeholder="• • • • • •"
                    value={studentOtp}
                    onChange={(e) => setStudentOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </>
              )}

              <button type="submit" className="wl-primary-btn" disabled={isLoading}>
                {isLoading
                  ? 'Please wait...'
                  : studentOtpSent
                  ? 'Verify & Continue →'
                  : 'Send OTP'}
              </button>
            </form>
          ) : step === 2 ? (
            /* ==================== STEP 2: PARENT MOBILE & RELATIONSHIP ==================== */
            <form onSubmit={handleParentStepAction} className="wl-step-content">
              
              <h2>Parent / Guardian Mobile</h2>
              <p className="wl-step-desc">
                Select relationship and enter your parent or guardian’s mobile number. If it matches your verified
                number, no second OTP is needed.
              </p>


              <label className="wl-label">Parent / Guardian Mobile Number *</label>
              <CountryPhoneInput
                id="reg-guardian-mobile"
                country={guardianCountry}
                onCountryChange={(iso) => {
                  setGuardianCountry(iso);
                  setGuardianOtpSent(false);
                  setGuardianOtp('');
                  setErrorMsg('');
                }}
                value={guardianMobile}
                onChange={(val) => {
                  setGuardianMobile(val);
                  setGuardianOtpSent(false);
                  setGuardianOtp('');
                }}
                disabled={guardianOtpSent}
                required
              />

              {isSameNumber && (
                <div className="wl-case-badge wl-case-same">
                  ✓ Same as student mobile — second OTP skipped automatically.
                </div>
              )}

              {!isSameNumber &&
                isValidPhoneForDialCode(guardianMobile, guardianCountry) &&
                !guardianOtpSent && (
                  <div className="wl-case-badge wl-case-diff">
                    Different number detected — we will send a quick verification OTP to your
                    parent’s mobile.
                  </div>
                )}

              {!isSameNumber && guardianOtpSent && (
                <>
                  <div className="wl-label-between">
                    <label className="wl-label">Parent 6-Digit OTP *</label>
                    {cooldown > 0 ? (
                      <span className="wl-timer">Resend in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        className="wl-text-link"
                        disabled={isLoading}
                        onClick={() => handleParentStepAction({ preventDefault: () => {} })}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="wl-input wl-otp-input"
                    placeholder="• • • • • •"
                    value={guardianOtp}
                    onChange={(e) => setGuardianOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </>
              )}

              <div className="wl-btn-row">
                <button
                  type="button"
                  className="wl-secondary-btn"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  ← Back
                </button>
                <button type="submit" className="wl-primary-btn" disabled={isLoading}>
                  {isLoading
                    ? 'Processing...'
                    : isSameNumber
                    ? 'Next: Student Details →'
                    : guardianOtpSent
                    ? 'Verify Parent OTP →'
                    : 'Send Parent OTP'}
                </button>
              </div>
            </form>
          ) : step === 3 ? (
            /* ==================== STEP 3: STUDENT DETAILS PAGE ==================== */
            <form onSubmit={handleStudentDetailsNext} className="wl-step-content">
             
              <h2>Student Details</h2>
              <p className="wl-step-desc">
                Enter your personal details below. Demographic fields are optional and can also
                be updated later in your profile.
              </p>

              

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="wl-input"
                    placeholder="Student full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="wl-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="wl-input"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="wl-label">Parent / Guardian Relationship *</label>
                <select
                  className="wl-input"
                  value={parentRelationship}
                  onChange={(e) => setParentRelationship(e.target.value)}
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    className="wl-input"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div>
                  <label className="wl-label">Gender *</label>
                  <select
                    className="wl-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="wl-grid-3">
                <div>
                  <label className="wl-label">Community</label>
                  <select
                    className="wl-input"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="OC">OC</option>
                    <option value="BC">BC</option>
                    <option value="MBC">MBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="wl-label">Blood Group</label>
                  <select
                    className="wl-input"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="wl-label">Mother Tongue</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="e.g. Tamil"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                  />
                </div>
              </div>

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">Religion </label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="Enter religion"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="wl-label">Caste</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="Enter caste"
                    value={caste}
                    onChange={(e) => setCaste(e.target.value)}
                  />
                </div>
              </div>

              <div className="wl-btn-row">
                <button
                  type="button"
                  className="wl-secondary-btn"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <button type="submit" className="wl-primary-btn">
                  Next: Address Details →
                </button>
              </div>
            </form>
          ) : step === 4 ? (
            /* ==================== STEP 4: ADDRESS DETAILS PAGE (SKIPPABLE) ==================== */
            <form onSubmit={handleAddressNext} className="wl-step-content">
              <div className="wl-step-header-row">
               
                <button
                  type="button"
                  className="wl-skip-link"
                  onClick={handleSkipAddress}
                >
                  Skip this step →
                </button>
              </div>

              <h2>Address Details</h2>
              <p className="wl-step-desc">
                Provide your residential address now, or skip and update it later in your
                student dashboard.
              </p>

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">Current Address Line 1</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="Door No, Street Name"
                    value={currentAddress.addressLine1}
                    onChange={(e) =>
                      setCurrentAddress({ ...currentAddress, addressLine1: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="wl-label">Address Line 2 (Locality)</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="Area, Landmark (Optional)"
                    value={currentAddress.addressLine2}
                    onChange={(e) =>
                      setCurrentAddress({ ...currentAddress, addressLine2: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">State</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="Tamil Nadu"
                    value={currentAddress.state}
                    onChange={(e) =>
                      setCurrentAddress({ ...currentAddress, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="wl-label">District</label>
                  <input
                    type="text"
                    className="wl-input"
                    placeholder="e.g. Salem"
                    value={currentAddress.district}
                    onChange={(e) =>
                      setCurrentAddress({ ...currentAddress, district: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="wl-grid-2">
                
                <div>
                  <label className="wl-label">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="wl-input"
                    placeholder="636001"
                    value={currentAddress.pincode}
                    onChange={(e) =>
                      setCurrentAddress({
                        ...currentAddress,
                        pincode: e.target.value.replace(/\D/g, ''),
                      })
                    }
                  />
                </div>
              </div>

              <label className="wl-checkbox-row">
                <input
                  type="checkbox"
                  checked={isSameAsPermanent}
                  onChange={(e) => setIsSameAsPermanent(e.target.checked)}
                />
                <span>Permanent address is the same as current address</span>
              </label>

              {!isSameAsPermanent && (
                <div className="wl-perm-card">
                  <div className="wl-perm-title">Permanent Address</div>
                  <div className="wl-grid-2">
                    <div>
                      <label className="wl-label">Permanent Address Line 1</label>
                      <input
                        type="text"
                        className="wl-input"
                        placeholder="Door No, Street Name"
                        value={permanentAddress.addressLine1}
                        onChange={(e) =>
                          setPermanentAddress({
                            ...permanentAddress,
                            addressLine1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="wl-label">District</label>
                      <input
                        type="text"
                        className="wl-input"
                        placeholder="District"
                        value={permanentAddress.district}
                        onChange={(e) =>
                          setPermanentAddress({
                            ...permanentAddress,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="wl-grid-2">
                    
                    <div>
                      <label className="wl-label">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        className="wl-input"
                        placeholder="636001"
                        value={permanentAddress.pincode}
                        onChange={(e) =>
                          setPermanentAddress({
                            ...permanentAddress,
                            pincode: e.target.value.replace(/\D/g, ''),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="wl-btn-row">
                <button
                  type="button"
                  className="wl-secondary-btn"
                  onClick={() => setStep(3)}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="wl-secondary-btn"
                  onClick={handleSkipAddress}
                >
                  Skip & Next →
                </button>
                <button type="submit" className="wl-primary-btn">
                  Next: Create Password →
                </button>
              </div>
            </form>
          ) : step === 5 ? (
            /* ==================== STEP 5: CREATE PASSWORD PAGE ==================== */
            <form onSubmit={handleRegistrationSubmit} className="wl-step-content">
              
              <h2>Create Your Password</h2>
              <p className="wl-step-desc">
                {isWishlistFlow ? (
                  <>
                    Set a strong password to secure your account and save{' '}
                    <strong>{pendingCollege.collegeName}</strong> to your wishlist.
                  </>
                ) : (
                  'Set a strong password to secure your student account.'
                )}
              </p>

              <div className={`wl-case-badge ${isSameNumber ? 'wl-case-same' : 'wl-case-diff'}`}>
                {isSameNumber
                  ? 'Account Mode: Parent Account + Linked Student Profile (Same Mobile)'
                  : 'Account Mode: Parent & Student Accounts Linked (Separate Mobiles)'}
              </div>

              <div className="wl-grid-2">
                <div>
                  <label className="wl-label">Create Password *</label>
                  <div className="wl-pass-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className="wl-input"
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="wl-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="wl-label">Confirm Password *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    className="wl-input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="wl-password-rules">
                <div className="wl-rules-title">Password Requirements:</div>
                <ul>
                  <li>Minimum 8 characters (e.g., TestPass@123)</li>
                  <li>Include at least one letter and one number</li>
                  <li>Both Password and Confirm Password fields must match</li>
                </ul>
              </div>

              <div className="wl-btn-row">
                <button
                  type="button"
                  className="wl-secondary-btn"
                  onClick={() => setStep(4)}
                  disabled={isLoading}
                >
                  ← Back
                </button>
                <button type="submit" className="wl-primary-btn" disabled={isLoading}>
                  {isLoading
                    ? 'Creating Account...'
                    : isWishlistFlow
                    ? 'Complete Registration & Save ❤️'
                    : 'Complete Registration'}
                </button>
              </div>
            </form>
          ) : (
            /* ==================== STEP 6: CONFIRMATION SCREEN ==================== */
            <div className="wl-step-content wl-success-view">
              <div className="wl-success-icon">{isWishlistFlow ? '❤️' : '🎓'}</div>
              <h2>{isWishlistFlow ? 'Added to Your Wishlist!' : 'Registration Successful!'}</h2>
              <p className="wl-step-desc">
                {registrationResult?.message || 'Registration completed successfully.'}{' '}
                {isWishlistFlow ? (
                  <>
                    <strong>{pendingCollege.collegeName}</strong> has been saved to your
                    shortlist.
                  </>
                ) : (
                  'Your student account is ready. You can now shortlist colleges anytime with one click.'
                )}
              </p>

              <div className="wl-account-pill">
                Account Type:{' '}
                <strong>
                  {registrationResult?.accountType === 'parentAndStudent' ||
                  registrationResult?.studentAccountCreated
                    ? 'Parent & Student Accounts Created'
                    : 'Parent Account + Student Profile Created'}
                </strong>
              </div>

              <div className="wl-btn-row">
                <button type="button" className="wl-secondary-btn" onClick={onClose}>
                  {isWishlistFlow ? 'Continue Exploring' : 'Done'}
                </button>
                <a
                  href={isWishlistFlow ? '/wishlist' : '/colleges'}
                  className="wl-primary-btn wl-link-cta"
                >
                  {isWishlistFlow ? 'View My Wishlist →' : 'Explore Colleges →'}
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>,
    document.body
  );
}