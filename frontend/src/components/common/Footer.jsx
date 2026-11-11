import React from 'react';
import './Footer.css';

export default function Footer() {
  const handleUnbuiltLink = (e, name) => {
    e.preventDefault();
    // Keeps the page on the student layout without navigating to admin login
    console.log(`${name} page is coming soon.`);
  };

  return (
    <footer className="portal-footer">
      <div className="footer-container">
        <div className="footer-main-row">
          {/* Brand Info Column */}
          <div className="footer-brand-column">
            <div className="footer-logo">
              <span style={{ fontSize: '26px' }}>🎓</span>
              <span className="footer-brand-name">Admizan</span>
            </div>
            <p className="footer-tagline">
              Your trusted companion for discovering colleges, comparing courses and
              planning your future.
            </p>
            <div className="footer-location-chip">
              <span className="location-pin">📍</span>
              <span>Student Support • Tamil Nadu, India</span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-nav-grid">
            {/* 1. Explore (Routes directly to your existing /colleges page) */}
            <div className="footer-nav-column">
              <h4 className="footer-column-title">Explore</h4>
              <ul className="footer-links-list">
                <li><a href="/colleges">Engineering Colleges</a></li>
                <li><a href="/colleges">Arts & Science Colleges</a></li>
                <li><a href="/colleges">Medical & Allied Health</a></li>
                <li><a href="/colleges">Polytechnic</a></li>
              </ul>
            </div>

            {/* 2. Student Resources */}
            <div className="footer-nav-column">
              <h4 className="footer-column-title">Student Resources</h4>
              <ul className="footer-links-list">
                <li><a href="/colleges">College Directory</a></li>
                <li><a href="#eligibility" onClick={(e) => handleUnbuiltLink(e, 'Eligibility Guide')}>Eligibility Guide</a></li>
                <li><a href="#application-help" onClick={(e) => handleUnbuiltLink(e, 'Application Help')}>Application Help</a></li>
                <li><a href="#faqs" onClick={(e) => handleUnbuiltLink(e, 'FAQs')}>FAQs</a></li>
              </ul>
            </div>

            {/* 3. Discover */}
            <div className="footer-nav-column">
              <h4 className="footer-column-title">Discover</h4>
              <ul className="footer-links-list">
                <li><a href="/colleges">Browse Colleges</a></li>
                <li><a href="#courses" onClick={(e) => handleUnbuiltLink(e, 'Compare Courses')}>Compare Courses</a></li>
                <li><a href="#updates" onClick={(e) => handleUnbuiltLink(e, 'Admission Updates')}>Admission Updates</a></li>
                <li><a href="#scholarships" onClick={(e) => handleUnbuiltLink(e, 'Scholarships')}>Scholarships</a></li>
              </ul>
            </div>

            {/* 4. Support */}
            <div className="footer-nav-column">
              <h4 className="footer-column-title">Support</h4>
              <ul className="footer-links-list">
                <li><a href="#about" onClick={(e) => handleUnbuiltLink(e, 'About Us')}>About Us</a></li>
                <li><a href="#contact" onClick={(e) => handleUnbuiltLink(e, 'Contact Support')}>Contact Support</a></li>
                <li><a href="#privacy" onClick={(e) => handleUnbuiltLink(e, 'Privacy Policy')}>Privacy Policy</a></li>
                <li><a href="#terms" onClick={(e) => handleUnbuiltLink(e, 'Terms & Conditions')}>Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright-text">
            © 2026 Admizan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}