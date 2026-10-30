import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

// 5 Admin Roles Dummy Credentials
const MOCK_CREDENTIALS = [
  { username: 'superadmin', email: 'superadmin@admission.com', password: '1234', role: 'SUPER_ADMIN' },
  { username: 'manageradmin', email: 'manager@admission.com', password: '1234', role: 'MANAGER_ADMIN' },
  { username: 'keerthana01', email: 'telecaller01@admission.com', password: '1234', role: 'TELECALLER' },
  { username: 'ramesh_col', email: 'collegeadmin@abc.edu', password: '1234', role: 'COLLEGE_ADMIN' },
  { username: 'priya_cons', email: 'consultant@career.com', password: '1234', role: 'CONSULTATION_ADMIN' },
];

export default function AdminLoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMsg('Username matrum Password enter pannavum');
      return;
    }

    // Check credentials
    const foundUser = MOCK_CREDENTIALS.find(
      (acc) =>
        (acc.username.toLowerCase() === trimmedUser.toLowerCase() ||
          acc.email.toLowerCase() === trimmedUser.toLowerCase()) &&
        acc.password === trimmedPass
    );

    if (foundUser) {
      if (onLoginSuccess) {
        onLoginSuccess(foundUser);
      }

      // Role-based Navigation
      if (foundUser.role === 'SUPER_ADMIN') {
        navigate('/superadmin');
      }
      else if (foundUser.role === 'MANAGER_ADMIN') {
  navigate('/manager');
} else {
        alert(`Logged in as ${foundUser.role}`);
      }
    } else {
      setErrorMsg('Invalid Username / Email or Password!');
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card">
        {/* Top Royal Blue Squircle Badge */}
        <div className="login-badge">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="login-title">Admission Panel</h1>

        {/* Error message */}
        {errorMsg && (
          <div style={{ color: '#ef4444', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Username / Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
                className="login-input"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="login-input has-toggle"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-btn"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-.722-3.25" />
                    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                    <path d="m20 15-1.726-2.05" />
                    <path d="m4 15 1.726-2.05" />
                    <path d="m9 18 .722-3.25" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="login-forgot-wrapper">
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('Forgot Password clicked');
              }}
              className="login-forgot-link"
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-submit-btn">
            <span>Login</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}