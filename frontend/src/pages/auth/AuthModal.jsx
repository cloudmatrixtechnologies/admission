// src/pages/auth/AuthModal.jsx
import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState(initialMode); // 'signin' | 'register'
  
  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [registerRole, setRegisterRole] = useState('STUDENT'); // 'STUDENT' | 'PARENT'
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  if (!isOpen) return null;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (onAuthSuccess) {
      onAuthSuccess({ loginIdentifier, role: 'STUDENT' });
    }
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (onAuthSuccess) {
      onAuthSuccess({ fullName, mobileNumber, role: registerRole });
    }
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

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
          /* Sign In Screen */
          <div className="auth-form-wrapper">
            <h2 className="auth-heading">Welcome Back</h2>
            <p className="auth-subheading">
              Sign in to continue and add colleges to your wishlist.
            </p>

            <form onSubmit={handleSignInSubmit} className="auth-form">
              <div className="auth-field-group">
                <label className="auth-label">Mobile Number / Email ID</label>
                <div className="auth-input-wrapper">
                  <span className="auth-field-icon">👤</span>
                  <input
                    type="text"
                    required
                    placeholder="Enter mobile number or email ID"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <div className="auth-label-row">
                  <label className="auth-label">Password</label>
                  <a href="/forgot-password" className="auth-forgot-link">
                    Forgot Password?
                  </a>
                </div>
                <div className="auth-input-wrapper">
                  <span className="auth-field-icon">🔒</span>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary">
                Sign In
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-bottom-callout">
              <h4>New to Admission Panel?</h4>
              <p>Create an account to track applications and cut-offs.</p>
              <button
                type="button"
                className="auth-btn-outline"
                onClick={() => setActiveTab('register')}
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          /* Register Screen */
          <div className="auth-form-wrapper">
            <h2 className="auth-heading">Create Account</h2>
            <p className="auth-subheading">
              Register as a student or parent to access admission guidance.
            </p>

            <form onSubmit={handleRegisterSubmit} className="auth-form">
              {/* Role Toggle */}
              <div className="auth-role-segmented">
                <button
                  type="button"
                  className={`auth-role-pill ${registerRole === 'STUDENT' ? 'selected' : ''}`}
                  onClick={() => setRegisterRole('STUDENT')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`auth-role-pill ${registerRole === 'PARENT' ? 'selected' : ''}`}
                  onClick={() => setRegisterRole('PARENT')}
                >
                  Parent
                </button>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <span className="auth-field-icon">🎓</span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Mobile Number</label>
                <div className="auth-input-wrapper">
                  <span className="auth-field-icon">📱</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-label">Create Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-field-icon">🔒</span>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary">
                Register
              </button>
            </form>

            <div className="auth-bottom-callout-simple">
              <span>Already have an account?</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}