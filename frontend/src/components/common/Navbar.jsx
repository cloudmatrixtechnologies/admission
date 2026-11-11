// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ wishlistCount = 0, onOpenAuth }) {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Colleges', path: '/colleges' },
    { label: 'Courses', path: '/courses', isPlaceholder: true },
    { label: 'About', path: '/about', isPlaceholder: true },
    { label: 'Contact', path: '/contact', isPlaceholder: true },
  ];

  const isItemActive = (item) => {
    if (item.path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(item.path);
  };

  const handlePlaceholderClick = (e, label) => {
    e.preventDefault();
    console.log(`${label} page is currently under development.`);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        
        {/* Left: Brand Tile & ADMIZAN Typography */}
       <Link to="/" className="navbar-brand">
  <div className="brand-icon-tile">
    <img
      src="/brand_logo.png"
      alt="ADMIZAN Logo"
      className="brand-logo-img"
    />
  </div>
  <div className="brand-text-group">
    <span className="brand-title">ADMIZAN</span>
    <span className="brand-subtitle">Find Your Right College</span>
  </div>
</Link>

        {/* Center: Horizontally Centered Frosted Capsule */}
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

        {/* Right: Animated Wishlist & Unified Auth Capsule */}
        <div className="nav-controls">
          
          {/* Wishlist Button: Downward Unrolling Ribbon + Star Coin */}
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

          {/* Unified Auth Capsule: Sign In (Text Link) + Register (Solid Pill) */}
          <div className="auth-capsule">
            <Link
              to="/student/login"
              className="btn-auth-login"
              onClick={(e) => {
                if (onOpenAuth) {
                  e.preventDefault();
                  onOpenAuth('signin');
                }
              }}
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
            </Link>

            <Link
              to="/student/login"
              className="btn-auth-register"
              onClick={(e) => {
                if (onOpenAuth) {
                  e.preventDefault();
                  onOpenAuth('register');
                }
              }}
            >
              <span>Register</span>
              <span className="register-arrow">→</span>
            </Link>
          </div>

        </div>

      </div>
    </header>
  );
}