// src/components/home/StreamCategories.jsx
import React from 'react';

const CATEGORIES = [
  {
    id: 'Engineering',
    name: 'Engineering',
    subtext: 'B.E / B.Tech & Mech',
    accentColor: '#2563eb',
    bgColor: '#eff6ff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  },
  {
    id: 'Arts & Science',
    name: 'Arts & Science',
    subtext: 'B.Sc, B.Com, B.A & PG',
    accentColor: '#7c3aed',
    bgColor: '#f5f3ff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"/>
      </svg>
    ),
  },
  {
    id: 'Medical',
    name: 'Medical',
    subtext: 'MBBS, BDS & Allied',
    accentColor: '#059669',
    bgColor: '#ecfdf5',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    ),
  },
  {
    id: 'Diploma',
    name: 'Diploma',
    subtext: 'Polytechnic & Tech',
    accentColor: '#0284c7',
    bgColor: '#f0f9ff',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="12" y1="6" x2="16" y2="6"/>
        <line x1="12" y1="10" x2="16" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'ITI',
    name: 'ITI',
    subtext: 'Vocational & Trades',
    accentColor: '#ea580c',
    bgColor: '#fff7ed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

export default function StreamCategories({ selectedStream = '', onSelectStream }) {
  return (
    <section className="stream-section">
      <div className="section-title-wrap">
        <div>
          <h2 className="stream-section-heading">Explore by College Type</h2>
          <p className="stream-section-sub">Select a category to filter institutions across Tamil Nadu</p>
        </div>
        <a href="/colleges" className="section-view-all">
          View All Colleges →
        </a>
      </div>

      <div className="stream-tile-grid">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedStream.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              className={`stream-tile-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectStream(cat.id)}
            >
              <div
                className="stream-tile-icon-wrap"
                style={{
                  backgroundColor: isSelected ? 'rgba(116, 112, 112, 0.2)' : cat.bgColor,
                  color: isSelected ? '#ffffff8c' : cat.accentColor,
                }}
              >
                {cat.icon}
              </div>

              <div className="stream-tile-text">
                <span className="stream-tile-name">{cat.name}</span>
                <span className="stream-tile-subtext">{cat.subtext}</span>
              </div>

              <div className="stream-tile-footer">
                <span className="stream-tile-link-text">Explore</span>
                <span className="stream-tile-arrow">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}