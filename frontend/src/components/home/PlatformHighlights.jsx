import React from 'react';
import './PlatformHighlights.css';

const PLATFORM_FEATURES = [
  {
    id: 'profiles',
    title: 'Comprehensive College Profiles',
    description:
      'Explore detailed college profiles, institutional information, campus facilities, accreditations, and available academic programmes.',
    tags: 'College Profiles · Campus Facilities · Institution Details',
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
    title: 'Courses & Specialisations',
    description:
      'Discover diverse academic programmes, course structures, specialisations, and emerging fields to find the right path for your future.',
    tags: 'Course Catalogues · Specialisations · Academic Pathways',
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
    title: 'Transparent Fee Information',
    description:
      'Understand available tuition fees, additional charges, and financial details to make informed education decisions.',
    tags: 'Tuition Fees · Fee Comparison · Financial Planning',
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
    title: 'Eligibility & Admission Insights',
    description:
      'Understand academic eligibility, admission requirements, qualification criteria, and available cut-off information.',
    tags: 'Eligibility Criteria · Admission Requirements · Cut-off Insights',
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
    title: 'Smart College Comparison',
    description:
      'Compare multiple colleges based on courses, fees, facilities, and other important factors before making your decision.',
    tags: 'College Comparison · Course Comparison · Smart Shortlisting',
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
    id: 'application',
    title: 'Simplified Application Process',
    description:
      'Create your student profile, submit application details, and manage your admission journey through one convenient platform.',
    tags: 'Student Profiles · Online Applications · Application Management',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V8L14 3Z" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" fill="#eff6ff" />
        <path d="M14 3V8H19" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 13H15M9 17H13" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'wishlist',
    title: 'Personalised College Wishlist',
    description:
      'Save your preferred colleges, organise your choices, and revisit shortlisted institutions whenever you need.',
    tags: 'Saved Colleges · Personal Wishlist · Easy Access',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 20.5C12 20.5 4 15.2 4 9.2C4 6.6 6.05 4.5 8.6 4.5C10.1 4.5 11.45 5.22 12 6.32C12.55 5.22 13.9 4.5 15.4 4.5C17.95 4.5 20 6.6 20 9.2C20 15.2 12 20.5 12 20.5Z"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="#eff6ff"
        />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Dedicated Student Support',
    description:
      'Get helpful guidance throughout your admission journey, from exploring colleges to understanding application requirements.',
    tags: 'Student Assistance · Admission Guidance · Application Support',
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
            <span className="platform-badge-pill">WHAT WE PROVIDE</span>
            <span className="platform-badge-line" />
          </div>

          <h2 className="platform-heading">
            Everything You Need for a <span className="text-royal-blue">Smarter Admission Journey</span>
          </h2>

          <p className="platform-subheading">
            Discover colleges, explore courses, understand eligibility, compare your options, and
            take confident steps towards your academic future — all in one platform.
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
              <div className="card-feature-tags">{item.tags}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}