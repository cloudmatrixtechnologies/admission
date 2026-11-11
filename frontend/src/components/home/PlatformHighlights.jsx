import React from 'react';
import './PlatformHighlights.css';

const PLATFORM_FEATURES = [
  {
    id: 'profiles',
    title: 'Comprehensive College Profiles',
    description: 'Explore verified details, facilities, approvals and campus information.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 21V10L12 5L19 10V21" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 21V15H15V21" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" fill="#dbeafe" />
        <path d="M9 10H9.01M15 10H15.01" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 2V5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 2L15 3.5L12 5" fill="#2563eb" />
      </svg>
    ),
  },
  {
    id: 'courses',
    title: 'Courses & Specializations',
    description: 'Compare programs, branches, duration and career pathways.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" fill="#eff6ff" />
        <path d="M6 12.5V17C6 19 8.686 20.5 12 20.5C15.314 20.5 18 19 18 17V12.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 10V16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'fees',
    title: 'Transparent Fee Details',
    description: 'Understand tuition fees, additional charges and scholarships.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="7" rx="8" ry="3.5" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <path d="M4 7V12C4 13.93 7.58 15.5 12 15.5C16.42 15.5 20 13.93 20 12V7" stroke="#2563eb" strokeWidth="2" />
        <path d="M4 12V17C4 18.93 7.58 20.5 12 20.5C16.42 20.5 20 18.93 20 17V12" stroke="#2563eb" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Cut-off Insights',
    description: 'Review admission criteria, cut-offs and eligibility requirements.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <path d="M9 2H15V5H9V2Z" stroke="#2563eb" strokeWidth="2" fill="#ffffff" />
        <path d="M9 13L11 15L15 11" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'comparison',
    title: 'Side-by-Side Comparison',
    description: 'Compare colleges by fees, courses, facilities and placements.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="8" height="14" rx="2" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <rect x="13" y="5" width="8" height="14" rx="2" stroke="#2563eb" strokeWidth="2" fill="#ffffff" />
        <path d="M6 14L7 9L8 14M6.4 12.5H7.6" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 9H17.5C18.3 9 18.3 10.2 17.5 10.2H16V14H17.8C18.6 14 18.6 12.8 17.8 12.8" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'verified',
    title: 'Verified Information',
    description: 'Make informed decisions with trusted institutional sources.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22S4 18 4 11V5L12 2L20 5V11C20 18 12 22 12 22Z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" fill="#eff6ff" />
        <path d="M9 12L11 14L15 10" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'network',
    title: 'Tamil Nadu College Network',
    description: 'Discover institutions across engineering and higher education.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C16 17 19 13.4 19 9.5C19 5.36 15.86 2 12 2C8.14 2 5 5.36 5 9.5C5 13.4 8 17 12 21Z" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <circle cx="12" cy="9.5" r="3" stroke="#2563eb" strokeWidth="2" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: 'guidance',
    title: 'Personalised Guidance',
    description: 'Get support with shortlisting, applications and next steps.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <rect x="2" y="13" width="4" height="6" rx="2" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <rect x="18" y="13" width="4" height="6" rx="2" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
        <path d="M19 19C19 20.1 18.1 21 17 21H13" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function PlatformHighlights() {
  return (
    <section className="platform-section-container">
      <div className="platform-content-wrap">
        {/* Top Header */}
        <div className="platform-intro-block">
          <div className="platform-badge-wrapper">
            <span className="platform-badge-line" />
            <span className="platform-badge-pill">WHY CHOOSE US</span>
            <span className="platform-badge-line" />
          </div>

          <h2 className="platform-heading">
            Everything You Need to <span className="text-royal-blue">Make the Right Choice</span>
          </h2>

          <p className="platform-subheading">
            Verified college information, transparent comparisons, and guidance at every step.
          </p>
        </div>

        {/* 4x2 Feature Grid */}
        <div className="platform-cards-grid">
          {PLATFORM_FEATURES.map((item) => (
            <div key={item.id} className="platform-feature-card">
              <div className="card-top-row">
                <div className="card-icon-bubble">{item.icon}</div>
                <h3 className="card-feature-title">{item.title}</h3>
              </div>
              <p className="card-feature-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}