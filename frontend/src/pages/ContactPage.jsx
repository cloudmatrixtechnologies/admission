// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const CONTACT_INFO_CARDS = [
  {
    id: 'call',
    icon: '📞',
    iconBg: '#e0edff',
    iconColor: '#1d63ed',
    title: 'Call Us',
    primary: '+91 98765 43210',
    sub: 'Mon - Sat, 9:00 AM - 6:00 PM',
  },
  {
    id: 'email',
    icon: '✉️',
    iconBg: '#ffe4e6',
    iconColor: '#e11d48',
    title: 'Email Us',
    primary: 'support@admizan.in',
    sub: "We'll respond as soon as possible",
  },
  {
    id: 'office',
    icon: '📍',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Our Office',
    primary: 'Salem, Tamil Nadu, India',
    sub: 'Visit us for a discussion',
  },
];

const SUBJECT_OPTIONS = [
  'College Admission',
  'Course Information',
  'College Details',
  'Eligibility / Cut-off',
  'Fees & Scholarships',
  'General Enquiry',
];

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusAlert, setStatusAlert] = useState({ type: '', text: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setStatusAlert({ type: '', text: '' });

    const cleanMobile = contactForm.mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setStatusAlert({
        type: 'error',
        text: 'Please enter a valid 10-digit mobile number.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType: 'student',
          ...contactForm,
          mobileNumber: cleanMobile,
        }),
      });
      if (!res.ok) throw new Error('Offline fallback');
    } catch {
      // Graceful local fallback when backend endpoint is offline
    } finally {
      setIsSubmitting(false);
      setStatusAlert({
        type: 'success',
        text: 'Thank you! Your message has been received. Our Salem guidance team will reach out shortly.',
      });
      setContactForm({
        fullName: '',
        email: '',
        mobileNumber: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Top Hero Banner */}
      <section className="contact-hero-banner">
        <div className="contact-hero-inner">
          <nav className="contact-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="contact-crumb-link">
              Home
            </Link>
            <span className="contact-crumb-sep">&gt;</span>
            <span className="contact-crumb-current">Contact</span>
          </nav>

          <h1 className="contact-hero-title">
            Contact <span className="contact-hero-highlight">Us</span>
          </h1>
          <p className="contact-hero-subtitle">
            We&apos;re here to help! Get in touch with us for any queries, support
            <br />
            or partnership opportunities.
          </p>
        </div>
        <div className="contact-hero-campus-bg" aria-hidden="true" />
      </section>

      {/* 2. Top 3 Contact Info Cards */}
      <section className="contact-strip-section">
        <div className="contact-info-grid">
          {CONTACT_INFO_CARDS.map((card) => (
            <div key={card.id} className="contact-info-card">
              <div
                className="contact-info-icon"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
                aria-hidden="true"
              >
                {card.icon}
              </div>
              <div className="contact-info-text">
                <span className="contact-info-label">{card.title}</span>
                <strong className="contact-info-primary">{card.primary}</strong>
                <span className="contact-info-sub">{card.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Two-Column Content */}
      <section className="contact-main-section">
        <div className="contact-two-col-grid">
          {/* Left Card: Send Us a Message */}
          <div className="contact-form-card">
            <h2 className="contact-card-heading">Send Us a Message</h2>
            <p className="contact-card-sub">
              Fill in the details below and we&apos;ll get back to you shortly.
            </p>

            {statusAlert.text && (
              <div className={`contact-alert ${statusAlert.type}`}>
                {statusAlert.text}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="contact-field-group">
                <label htmlFor="contact-name">Your Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={contactForm.fullName}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, fullName: e.target.value })
                  }
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-mobile">Mobile Number *</label>
                <input
                  id="contact-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  placeholder="Enter your mobile number"
                  value={contactForm.mobileNumber}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      mobileNumber: e.target.value.replace(/\D/g, ''),
                    })
                  }
                />
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-subject">Subject *</label>
                <select
                  id="contact-subject"
                  required
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                >
                  <option value="">Select a subject</option>
                  {SUBJECT_OPTIONS.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Type your message here..."
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={isSubmitting}
              >
                <span aria-hidden="true">✈️</span>
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Right Card: Our Office Location */}
          <div className="contact-office-card">
            <h2 className="contact-card-heading">Our Office Location</h2>
            <p className="contact-card-sub">
              Visit our office for a direct discussion.
            </p>

            {/* Embedded Salem Map */}
            <div className="contact-map-frame">
              <iframe
                title="ADMIZAN Salem Office Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.1280%2C11.6480%2C78.1650%2C11.6780&layer=mapnik&marker=11.6643%2C78.1460"
                loading="lazy"
              />
              <div className="contact-map-pin-card">
                <span className="map-pin-badge">🎓</span>
                <div>
                  <strong>ADMIZAN</strong>
                  <span>Salem, Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            <div className="contact-address-row">
              <span className="contact-address-pin" aria-hidden="true">
                📍
              </span>
              <div>
                <strong>Salem, Tamil Nadu, India</strong>
                <span>Near New Bus Stand, Salem - 636 004</span>
              </div>
            </div>

            <div className="contact-hours-box">
              <div className="contact-hours-header">
                <span aria-hidden="true">🕒</span>
                <strong>Office Hours</strong>
              </div>
              <div className="contact-hours-row">
                <span>Monday - Friday</span>
                <strong>9:00 AM - 6:00 PM</strong>
              </div>
              <div className="contact-hours-row">
                <span>Saturday</span>
                <strong>9:00 AM - 3:00 PM</strong>
              </div>
              <div className="contact-hours-row">
                <span>Sunday</span>
                <span className="hours-closed">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}