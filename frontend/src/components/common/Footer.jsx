// src/components/common/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Brand & Overview */}
        <div className="footer-brand-box">
          <div className="footer-title">
            <span className="footer-logo-icon">🎓</span>
            <span>Admission Panel</span>
          </div>
          <p className="footer-tagline">
            An integrated admission guidance portal assisting students and parents across Tamil Nadu with authentic institutional data, transparent fee structures, and verified course details.
          </p>
          <div className="footer-meta-info">
            <div className="footer-meta-item">
              <span className="meta-icon">📍</span>
              <span>Central Helpdesk: Tamil Nadu, India</span>
            </div>
            <div className="footer-meta-item">
              <span className="meta-icon">✉️</span>
              <span>support@admissionpanel.org</span>
            </div>
            <div className="footer-meta-item">
              <span className="meta-icon">🕒</span>
              <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Academic Streams */}
        <div className="footer-links-col">
          <h4>Program Streams</h4>
          <ul>
            <li><a href="/colleges?stream=engineering">Engineering Colleges</a></li>
            <li><a href="/colleges?stream=arts_science">Arts & Science Colleges</a></li>
            <li><a href="/colleges?stream=medical">Medical & Allied Health</a></li>
            <li><a href="/colleges?stream=diploma">Polytechnic / Diploma</a></li>
            <li><a href="/colleges?stream=iti">ITI Vocational Institutes</a></li>
            <li><a href="/courses">Course Curriculum Directory</a></li>
          </ul>
        </div>

        {/* Guidance Resources */}
        <div className="footer-links-col">
          <h4>Student Resources</h4>
          <ul>
            <li><a href="/colleges">College Directory</a></li>
            <li><a href="/about">Eligibility Guidelines</a></li>
            <li><a href="/wishlist">Saved Wishlist</a></li>
            <li><a href="/contact">Counselling Helpdesk</a></li>
            <li><a href="/about">Scholarship Guidance</a></li>
            <li><a href="/contact">Document Checklists</a></li>
          </ul>
        </div>

        {/* Major District Hubs */}
        <div className="footer-links-col">
          <h4>Colleges by District</h4>
          <ul>
            <li><a href="/colleges?district=chennai">Chennai Region</a></li>
            <li><a href="/colleges?district=coimbatore">Coimbatore Zone</a></li>
            <li><a href="/colleges?district=madurai">Madurai Zone</a></li>
            <li><a href="/colleges?district=trichy">Tiruchirappalli</a></li>
            <li><a href="/colleges?district=erode">Erode & Kongu Belt</a></li>
            <li><a href="/colleges?district=tirunelveli">Southern Districts</a></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="footer-links-col">
          <h4>Support & Legal</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Support</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/contact">Institution Partnerships</a></li>
            <li><a href="/about">Grievance Desk</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© Admission Panel. All rights reserved.</p>
          <div className="footer-trust-notes">
            <span>Official Council Verified</span>
            <span className="dot-divider">•</span>
            <span>Transparent Student Guidance</span>
            <span className="dot-divider">•</span>
            <span>Real-time Data Synchronized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}