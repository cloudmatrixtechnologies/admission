// src/components/common/Navbar.jsx
import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'colleges', label: 'Colleges', path: '/colleges' },
  { id: 'courses', label: 'Courses', path: '/courses' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export default function Navbar({ wishlistCount = 0 }) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <header className="navbar-container">
      <div className="navbar-content">

        {/* Far-Left: Brand with Matching Dual-Tone Title */}
        <a href="/" className="navbar-brand">
          <div className="brand-icon-tile">
            <span className="brand-icon">🎓</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">
              <span className="title-admission">Admission </span>
              <span className="title-panel">Panel</span>
            </span>
            <span className="brand-subtitle">Find Your Right College</span>
          </div>
        </a>

        {/* Center: Frosted Glass Capsule Pill */}
        <nav className="nav-pill-capsule" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <a
                key={item.id}
                href={item.path}
                className={`nav-pill-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.label);
                }}
              >
                <span>{item.label}</span>
                {isActive && <span className="nav-pill-indicator" />}
              </a>
            );
          })}
        </nav>

        {/* Far-Right: Unrolling Wishlist + Unified Single Auth Field */}
        <div className="nav-controls">

          {/* Animated Wishlist Button (Downward Unrolling Ribbon) */}
          <a href="/wishlist" className="wishlist-btn-animated" title="View Saved Colleges">
            <div className="flaticon-bookmark-wrapper">
              <svg
                className="flaticon-bookmark-svg"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="unfoldedRibbonClip">
                    <path d="M 26 14 H 62 C 67 14 70 17 70 22 V 96 L 48 87 L 26 96 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z" />
                  </clipPath>
                </defs>

                {/* Downward Unrolling Ribbon */}
                <g className="always-unfolded-ribbon">
                  <path
                    d="M 26 14 H 62 C 67 14 70 17 70 22 V 76 L 48 68 L 26 76 V 32 H 16 C 13 32 11 30 11 27 V 23 C 11 17 16 14 22 14 Z"
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="68"
                    cy="46"
                    r="24"
                    fill="#0284c7"
                    clipPath="url(#unfoldedRibbonClip)"
                  />
                </g>

                <path
                  d="M 26 20 H 22 C 18 20 16 22 16 25.5 V 32 H 26 Z"
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />

                <g className="bookmark-star-coin">
                  <circle
                    cx="68"
                    cy="46"
                    r="21"
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="5"
                  />
                  <path
                    d="M 68 35.5 L 71.5 42.8 L 79.5 44 L 73.7 49.7 L 75.1 57.6 L 68 53.8 L 60.9 57.6 L 62.3 49.7 L 56.5 44 L 64.5 42.8 Z"
                    fill="#fef08a"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>

            <span className="wishlist-text-label">Wishlist</span>

            {wishlistCount > 0 && (
              <span className="wishlist-pill-animated">
                <span className="pill-ping"></span>
                <span className="pill-number">{wishlistCount}</span>
              </span>
            )}
          </a>

          {/* Unified Single Auth Field: Both Sign In & Sign Up inside One Capsule */}
          <div className="auth-single-field">
            <a href="/login" className="field-signin-btn">
              <svg
                className="auth-user-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Sign In</span>
            </a>

            {/* Sharp Sign Up with Diagonal Sliding Glare & Arrow Motion */}
            <a href="/register" className="field-signup-btn">
              <span className="sliding-glare"></span>
              <span>Sign Up</span>
              <span className="signup-chevron">›</span>
            </a>
          </div>

        </div>

      </div>
    </header>
  );
}