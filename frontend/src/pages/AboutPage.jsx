// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const STATS_BAR = [
  {
    id: 'colleges',
    icon: '🏛️',
    accentBg: '#eff6ff',
    accentColor: '#1d63ed',
    value: '10,000+',
    label: 'Colleges Listed',
  },
  {
    id: 'courses',
    icon: '📖',
    accentBg: '#eff6ff',
    accentColor: '#1d63ed',
    value: '1,500+',
    label: 'Courses Available',
  },
  {
    id: 'students',
    icon: '👥',
    accentBg: '#fff7ed',
    accentColor: '#f59e0b',
    value: '2M+',
    label: 'Students Guided',
  },
  {
    id: 'verified',
    icon: '🛡️',
    accentBg: '#fff1f2',
    accentColor: '#e11d48',
    value: 'Verified Information',
    label: 'From Trusted Sources',
  },
];

const PURPOSE_CARDS = [
  {
    id: 'students',
    icon: '👤',
    iconBg: '#e0edff',
    iconColor: '#1d63ed',
    title: 'For Students',
    desc: 'Explore colleges, compare courses and check eligibility easily.',
  },
  {
    id: 'parents',
    icon: '👨‍👩‍👧',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'For Parents',
    desc: 'Get trusted information to make the right education decisions.',
  },
  {
    id: 'colleges',
    icon: '🏛️',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
    title: 'For Colleges',
    desc: 'Reach genuine students and showcase courses and facilities.',
  },
  {
    id: 'future',
    icon: '🎓',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48',
    title: 'For a Better Future',
    desc: 'Help more students get the right education and opportunities.',
  },
];

const PLATFORM_FEATURES = [
  {
    id: 'college-info',
    icon: '🏛️',
    iconBg: '#e0edff',
    iconColor: '#1d63ed',
    title: 'College Information',
    desc: 'Detailed information about colleges, including courses, fees, eligibility, facilities and accreditations.',
  },
  {
    id: 'course-details',
    icon: '📖',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Course Details',
    desc: 'Explore a wide range of courses with eligibility criteria, duration, fees and career opportunities.',
  },
  {
    id: 'eligibility',
    icon: '📋',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
    title: 'Eligibility Guidance',
    desc: 'Check course eligibility based on your education background like 10th, 12th, Diploma or ITI.',
  },
  {
    id: 'admission-process',
    icon: '📄',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48',
    title: 'Simple Admission Process',
    desc: 'Easy application process with clear steps and document requirements.',
  },
  {
    id: 'compare',
    icon: '⚖️',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Compare Options',
    desc: 'Compare colleges and courses to choose the best option for your future.',
  },
  {
    id: 'trusted-info',
    icon: '🛡️',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48',
    title: 'Trusted & Updated Information',
    desc: 'Information verified and regularly updated from trusted sources.',
  },
  {
    id: 'statewide',
    icon: '📍',
    iconBg: '#e0edff',
    iconColor: '#1d63ed',
    title: 'State-wide Coverage',
    desc: 'Colleges and courses across Tamil Nadu and beyond.',
  },
  {
    id: 'user-friendly',
    icon: '💻',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'User-friendly Experience',
    desc: 'Simple and easy to use for students and parents.',
  },
];

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      {/* 1. Hero Banner + Floating Stats Strip */}
      <section className="about-hero-section">
        <div className="about-hero-banner">
          <div className="about-hero-inner">
            <nav className="about-breadcrumbs" aria-label="Breadcrumb">
              <Link className="about-crumb-link" to="/">
                Home
              </Link>
              <span className="about-crumb-sep">&gt;</span>
              <span className="about-crumb-current">About</span>
            </nav>

            <h1 className="about-hero-title">
              About <span className="about-hero-highlight">ADMIZAN</span>
            </h1>
            <p className="about-hero-desc">
              ADMIZAN is an education-focused platform that helps students and parents
              find the right colleges and courses across Tamil Nadu and beyond, with accurate
              information, eligibility details and a simple admission process.
            </p>
          </div>
          <div className="about-hero-campus-bg" aria-hidden="true" />
        </div>

        {/* Floating 4-Column Stats Strip */}
        <div className="about-stats-container">
          <div className="about-stats-card">
            {STATS_BAR.map((stat) => (
              <div key={stat.id} className="about-stat-item">
                <div
                  className="about-stat-icon"
                  style={{ backgroundColor: stat.accentBg, color: stat.accentColor }}
                  aria-hidden="true"
                >
                  {stat.icon}
                </div>
                <div className="about-stat-text">
                  <strong className="about-stat-value">{stat.value}</strong>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Why We Built This — Our Purpose */}
      <section className="about-purpose-section">
        <div className="about-purpose-box">
          <div className="about-purpose-intro">
            <span className="about-pill-badge">Why We Built This</span>
            <h2 className="about-section-title">
              Our <span className="about-hero-highlight">Purpose</span>
            </h2>
            <p className="about-purpose-desc">
              Finding the right college and course can be confusing for many students and parents.
              ADMIZAN was created to bring all important information in one place and make the
              admission process simple, transparent and accessible for everyone.
            </p>
          </div>

          <div className="about-purpose-grid">
            {PURPOSE_CARDS.map((card) => (
              <div key={card.id} className="about-purpose-card">
                <div
                  className="about-purpose-icon"
                  style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
                <h3 className="about-purpose-card-title">{card.title}</h3>
                <p className="about-purpose-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What We Provide — Our Platform Details (4x2 Grid) */}
      <section className="about-platform-section">
        <div className="about-platform-header">
          <span className="about-pill-badge">What We Provide</span>
          <h2 className="about-section-title">
            Our <span className="about-hero-highlight">Platform Details</span>
          </h2>
          <p className="about-platform-subtitle">
            Complete information and tools to support your admission journey.
          </p>
        </div>

        <div className="about-platform-grid">
          {PLATFORM_FEATURES.map((item) => (
            <div key={item.id} className="about-feature-card">
              <div
                className="about-feature-icon"
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <div className="about-feature-body">
                <h3 className="about-feature-title">{item.title}</h3>
                <p className="about-feature-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}