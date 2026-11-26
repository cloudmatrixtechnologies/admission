// src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import StudentSignInModal from '../auth/StudentSignInModal';
import WishlistAuthModal from '../auth/WishlistAuthModal';
import './Navbar.css';

export default function Navbar({ wishlistCount = 0 }) {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [studentSession, setStudentSession] = useState(() => {
    try {
      const raw = localStorage.getItem('admizan_student_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Keep Navbar synced if student registers via the wishlist heart button on Home/Colleges
  useEffect(() => {
    const syncSession = () => {
      try {
        const raw = localStorage.getItem('admizan_student_session');
        setStudentSession(raw ? JSON.parse(raw) : null);
      } catch {
        setStudentSession(null);
      }
    };

    window.addEventListener('storage', syncSession);
    window.addEventListener('admizan-session-updated', syncSession);
    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('admizan-session-updated', syncSession);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('studentIdDisplay');
      localStorage.removeItem('admizan_student_session');
    } catch {
      // Ignore storage errors
    }
    setStudentSession(null);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Colleges', path: '/colleges' },
    { label: 'Courses', path: '/courses' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isItemActive = (item) => {
    if (item.path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(item.path);
  };

  const handlePlaceholderClick = (e, label) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    console.log(`${label} page is currently under development.`);
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-content">
          {/* Left: Brand Identity */}
          <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-icon-tile">
              <img src="/brand_logo.png" alt="ADMIZAN Logo" className="brand-logo-img" />
            </div>
            <div className="brand-text-group">
              <span className="brand-title">ADMIZAN</span>
              <span className="brand-subtitle">Your Choice Your College Your Future</span>
            </div>
          </Link>

          {/* Center: Frosted Glass Capsule */}
          <nav className="nav-pill-capsule" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = isItemActive(item);
              if (item.isPlaceholder) {
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={(e) => handlePlaceholderClick(e, item.label)}
                    className={`nav-capsule-link ${active ? 'active' : ''}`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="nav-active-bar" />}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`nav-capsule-link ${active ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  {active && <span className="nav-active-bar" />}
                </Link>
              );
            })}
          </nav>

          {/* Right: Wishlist + Auth Capsule (or Signed-In Student Badge) */}
          <div className="nav-controls">
            {/* Animated Wishlist Button */}
            <Link
              id="nav-wishlist-target"
              to="/wishlist"
              className="wishlist-btn-animated"
              title="View Saved Colleges"
            >
              <div className="flaticon-bookmark-wrapper">
                <svg
                  className="flaticon-bookmark-svg"
                  width="26"
                  height="26"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="navbarRibbonClip">
                      <path d="M 26 14 H 62 C 67 14 70 17 70 22 V 96 L 48 87 L 26 96 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z" />
                    </clipPath>
                  </defs>
                  <g className="always-unfolded-ribbon">
                    <path
                      d="M 26 14 H 62 C 67 14 70 17 70 22 V 76 L 48 68 L 26 76 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z"
                      fill="#52cde2"
                      stroke="#0d276b"
                      strokeWidth="6"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="68"
                      cy="46"
                      r="24"
                      fill="#38abbd"
                      clipPath="url(#navbarRibbonClip)"
                    />
                  </g>
                  <path
                    d="M 26 20 H 22 C 18 20 16 22 16 25.5 V 32 H 26 Z"
                    fill="#ffffff"
                    stroke="#0d276b"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                  <g className="bookmark-star-coin">
                    <circle
                      cx="68"
                      cy="46"
                      r="21"
                      fill="#ff8800"
                      stroke="#0d276b"
                      strokeWidth="6"
                    />
                    <path
                      d="M 68 35.5 L 71.5 42.8 L 79.5 44 L 73.7 49.7 L 75.1 57.6 L 68 53.8 L 60.9 57.6 L 62.3 49.7 L 56.5 44 L 64.5 42.8 Z"
                      fill="#ffd152"
                      stroke="#ffd152"
                      strokeWidth="2.8"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>

              <span className="wishlist-text-label">Wishlist</span>

              {wishlistCount > 0 && (
                <span className="wishlist-pill-animated">
                  <span className="pill-ping" />
                  <span className="pill-number">{wishlistCount}</span>
                </span>
              )}
            </Link>

            {/* Auth Capsule OR Signed-In Student Badge */}
            {studentSession?.isRegistered ? (
              <div className="auth-capsule student-session-capsule">
                <div className="student-session-badge" title={studentSession.fullName}>
                  <span className="student-avatar-dot">
                    {(studentSession.fullName || 'S').charAt(0).toUpperCase()}
                  </span>
                  <span className="student-session-name">{studentSession.fullName}</span>
                  {studentSession.studentIdDisplay && (
                    <span className="student-id-chip">{studentSession.studentIdDisplay}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-auth-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-capsule">
                <button
                  type="button"
                  className="btn-auth-login"
                  onClick={() => setIsSignInOpen(true)}
                >
                  <svg
                    className="auth-icon-user"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  className="btn-auth-register"
                  onClick={() => setIsRegisterOpen(true)}
                >
                  <span>Register</span>
                  <span className="register-arrow">→</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="nav-hamburger-btn"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-drawer">
            {navItems.map((item) => {
              const active = isItemActive(item);
              if (item.isPlaceholder) {
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={(e) => handlePlaceholderClick(e, item.label)}
                    className={`mobile-nav-link ${active ? 'active' : ''}`}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${active ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}

            {studentSession?.isRegistered ? (
              <div className="mobile-drawer-auth">
                <div className="student-session-badge">
                  <span className="student-avatar-dot">
                    {(studentSession.fullName || 'S').charAt(0).toUpperCase()}
                  </span>
                  <span className="student-session-name">{studentSession.fullName}</span>
                </div>
                <button
                  type="button"
                  className="mobile-btn-signin"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mobile-drawer-auth">
                <button
                  type="button"
                  className="mobile-btn-signin"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSignInOpen(true);
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="mobile-btn-register"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRegisterOpen(true);
                  }}
                >
                  Register →
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Portaled directly to document.body so fixed navbar blur never clips the modals */}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <StudentSignInModal
              isOpen={isSignInOpen}
              onClose={() => setIsSignInOpen(false)}
              onLoginSuccess={(sessionData) => setStudentSession(sessionData)}
              onSwitchToRegister={() => setIsRegisterOpen(true)}
            />

            <WishlistAuthModal
              isOpen={isRegisterOpen}
              onClose={() => setIsRegisterOpen(false)}
              pendingCollege={null}
              onRegistrationComplete={({ registrationResponse, studentSummary }) => {
                const sessionData = {
                  isRegistered: true,
                  fullName: studentSummary?.fullName || 'Student',
                  studentIdDisplay: registrationResponse?.data?.studentIdDisplay || 'STU00125',
                  accountType: registrationResponse?.accountType || 'parentOnly',
                  registeredAt: new Date().toISOString(),
                };
                try {
                  localStorage.setItem('admizan_student_session', JSON.stringify(sessionData));
                } catch {
                  // Ignore storage errors
                }
                setStudentSession(sessionData);
                setIsRegisterOpen(false);
              }}
            />
          </>,
          document.body
        )}
    </>
  );
}