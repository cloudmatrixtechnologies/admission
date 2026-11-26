// src/components/auth/StudentSignInModal.jsx
import React, { useState, useEffect } from 'react';
import {
  loginStudent,
  requestRegistrationOtp,
  resetStudentPassword,
} from '../../services/authService';
import CountryPhoneInput from '../common/CountryPhoneInput';
import { getCountryByDialCode, isValidPhoneForDialCode } from '../../services/countries';
import './StudentSignInModal.css';

export default function StudentSignInModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) {
  const [mobileCountry, setMobileCountry] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password + OTP reset states (kept in memory only)
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsForgotMode(false);
      setForgotOtpSent(false);
      setForgotOtp('');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrorMessage('');
      setInfoMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCountry = getCountryByDialCode(mobileCountry);

  const handleOpenForgotMode = () => {
    setErrorMessage('');
    setInfoMessage('');
    setIsForgotMode(true);
    setForgotOtpSent(false);
    setForgotOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleSendForgotOtp = async () => {
    setErrorMessage('');
    setInfoMessage('');

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!isValidPhoneForDialCode(cleanMobile, mobileCountry)) {
      setErrorMessage(
        `Please enter a valid ${selectedCountry.name} (${selectedCountry.dialCode}) mobile number.`
      );
      return;
    }

    setIsLoading(true);
    try {
      await requestRegistrationOtp(cleanMobile, mobileCountry);
      setForgotOtpSent(true);
      setInfoMessage(
        `OTP sent to ${selectedCountry.dialCode} ${cleanMobile}. Enter the 6-digit OTP and your new password below.`
      );
    } catch (err) {
      setErrorMessage(err?.message || 'Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!isValidPhoneForDialCode(cleanMobile, mobileCountry)) {
      setErrorMessage(
        `Please enter a valid ${selectedCountry.name} (${selectedCountry.dialCode}) mobile number.`
      );
      return;
    }

    if (isForgotMode) {
      if (!/^\d{6}$/.test(forgotOtp)) {
        setErrorMessage('Please type the 6-digit OTP.');
        return;
      }
      if (newPassword.length < 8) {
        setErrorMessage('New password must be at least 8 characters.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('New password and confirm password do not match.');
        return;
      }

      setIsLoading(true);
      try {
        await resetStudentPassword({
          mobileNumber: cleanMobile,
          mobileCountry,
          otp: forgotOtp,
          newPassword,
          confirmPassword: confirmNewPassword,
        });

        setIsForgotMode(false);
        setForgotOtpSent(false);
        setForgotOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPassword('');
        setInfoMessage('OTP verified and new password saved! Please sign in with your new password.');
      } catch (err) {
        setErrorMessage(err?.message || 'Invalid OTP or password reset failed.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginStudent({
        mobileNumber: cleanMobile,
        mobileCountry,
        password,
      });

      const userData = result?.data || result || {};
      const token = userData.token || result?.token || '';
      const sessionPayload = {
        isRegistered: true,
        fullName: userData.fullName || 'Student',
        studentIdDisplay: userData.studentIdDisplay || 'STU00124',
        role: userData.role || 'STUDENT',
        loggedInAt: new Date().toISOString(),
      };

      try {
        if (token) localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', sessionPayload.role);
        localStorage.setItem('studentIdDisplay', sessionPayload.studentIdDisplay);
        localStorage.setItem('admizan_student_session', JSON.stringify(sessionPayload));
      } catch {
        // Ignore storage errors
      }

      setPassword('');
      if (onLoginSuccess) {
        onLoginSuccess(sessionPayload);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err?.message || 'Invalid mobile number or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="signin-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="signin-modal-close"
          onClick={onClose}
          aria-label="Close sign in modal"
        >
          ✕
        </button>

        <div className="signin-modal-body">
          <div className="signin-brand-logo-wrap">
            <img
              src="/brand_logo.png"
              alt="ADMIZAN"
              className="signin-brand-logo"
            />
          </div>

          <h2 className="signin-heading">
            <span className="signin-admizan">ADMIZAN</span>
            <br />
            {isForgotMode ? 'Reset Password' : 'Sign in'}
          </h2>

          {errorMessage && <div className="signin-alert-error">{errorMessage}</div>}
          {infoMessage && <div className="signin-alert-info">{infoMessage}</div>}

          <form onSubmit={handleSubmit} className="signin-form-fields">
            {!isForgotMode ? (
              <>
                <div className="signin-input-group">
                  <label className="signin-label" htmlFor="student-login-id">
                    Mobile Number
                  </label>
                  <CountryPhoneInput
                    id="student-login-id"
                    country={mobileCountry}
                    onCountryChange={(dial) => {
                      setMobileCountry(dial);
                      setErrorMessage('');
                    }}
                    value={mobileNumber}
                    onChange={(val) => setMobileNumber(val)}
                    required
                  />
                </div>

                <div className="signin-input-group">
                  <div className="signin-password-header">
                    <label className="signin-label" htmlFor="student-login-pass">
                      Password
                    </label>
                    <button
                      type="button"
                      className="signin-forgot-link"
                      onClick={handleOpenForgotMode}
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="signin-input-field">
                    <span className="signin-field-icon" aria-hidden="true">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="student-login-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="signin-show-text-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="signin-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Please wait...' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div className="signin-input-group">
                  <div className="signin-password-header">
                    <label className="signin-label" htmlFor="forgot-mobile-id">
                      Mobile Number
                    </label>
                    <button
                      type="button"
                      className="signin-forgot-link"
                      onClick={() => {
                        setIsForgotMode(false);
                        setForgotOtpSent(false);
                        setForgotOtp('');
                        setErrorMessage('');
                        setInfoMessage('');
                      }}
                    >
                      Back to Sign In
                    </button>
                  </div>
                  <CountryPhoneInput
                    id="forgot-mobile-id"
                    country={mobileCountry}
                    onCountryChange={(dial) => {
                      setMobileCountry(dial);
                      setErrorMessage('');
                    }}
                    value={mobileNumber}
                    onChange={(val) => setMobileNumber(val)}
                    disabled={forgotOtpSent}
                    required
                  />
                </div>

                {!forgotOtpSent ? (
                  <button
                    type="button"
                    className="signin-submit-btn"
                    onClick={handleSendForgotOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                ) : (
                  <>
                    <div className="signin-input-group">
                      <label className="signin-label" htmlFor="forgot-otp-input">
                        Enter 6-Digit OTP *
                      </label>
                      <div className="signin-input-field">
                        <input
                          id="forgot-otp-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          placeholder="Type the 6-digit OTP"
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>

                    <div className="signin-input-group">
                      <label className="signin-label" htmlFor="forgot-new-pass">
                        New Password *
                      </label>
                      <div className="signin-input-field">
                        <input
                          id="forgot-new-pass"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="signin-show-text-btn"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div className="signin-input-group">
                      <label className="signin-label" htmlFor="forgot-confirm-pass">
                        Confirm New Password *
                      </label>
                      <div className="signin-input-field">
                        <input
                          id="forgot-confirm-pass"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Re-enter new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="signin-show-text-btn"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="signin-submit-btn" disabled={isLoading}>
                      {isLoading ? 'Please wait...' : 'Verify OTP & Save Password'}
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}