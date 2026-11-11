// src/pages/auth/StudentSignInPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './StudentSignIn.css';

export default function StudentSignInPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab switch: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState('signin');

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const intentCollegeId = queryParams.get('intentCollegeId') || '';

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginIdentifier: loginIdentifier.trim(),
          password,
          role: 'STUDENT',
          intentCollegeId: intentCollegeId || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('auth_token', result.data?.token || 'mock_jwt_token');
        localStorage.setItem('user_role', 'STUDENT');
        localStorage.setItem('studentIdDisplay', result.data?.studentIdDisplay || 'STU00124');

        if (intentCollegeId) {
          navigate(`/colleges/${intentCollegeId}`);
        } else {
          navigate('/');
        }
      } else {
        setErrorMessage(result.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      // Offline fallback for development
      localStorage.setItem('auth_token', 'dev_mock_student_token');
      localStorage.setItem('user_role', 'STUDENT');
      localStorage.setItem('studentIdDisplay', 'STU00124');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="student-auth-page">
      <div className="student-auth-container">
        <div className="student-auth-card">
          {/* Top Segmented Tab Switcher */}
          <div className="auth-tab-bar">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'signin' ? (
            <div className="auth-body">
              <h2 className="auth-heading" style={{ marginBottom: '20px' }}>Welcome to <br/>ADMIZAN</h2>

              {errorMessage && <div className="auth-alert-error">{errorMessage}</div>}

              <form onSubmit={handleSignInSubmit} className="auth-form-fields">
                {/* Mobile / Email Input */}
                <div className="auth-input-group">
                  <label className="auth-label">Mobile Number</label>
                  <div className="auth-input-field">
                    <span className="auth-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Enter mobile number or email ID"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="auth-input-group">
                  <div className="auth-password-header">
                    <label className="auth-label">Password</label>
                    <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                      Forgot Password?
                    </a>
                  </div>
                  <div className="auth-input-field">
                    <span className="auth-field-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="auth-eye-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            /* Register Mode */
            <div className="auth-body">
              <h2 className="auth-heading">Create Account</h2>
              <p className="auth-subheading">
                Register as a Student or Parent to apply for admissions.
              </p>
              <div className="auth-register-callout">
                <button
                  type="button"
                  className="auth-outline-btn"
                  onClick={() => setActiveTab('signin')}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}