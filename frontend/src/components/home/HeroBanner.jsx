// src/components/home/HeroBanner.jsx
import React from 'react';
import './HeroBanner.css';

const POPULAR_SEARCHES = ['Engineering', 'Arts & Science', 'Diploma', 'ITI', 'Medical'];

export default function HeroBanner({
  searchQuery = '',
  setSearchQuery = () => {},
  onSearchSubmit = (e) => e?.preventDefault(),
}) {
  return (
    <section className="hero-banner">
      <div className="hero-inner">
        
        {/* Top Tag */}
        <span className="hero-badge">ADMISSION GUIDANCE</span>

        {/* Dual-Tone Serif Heading */}
        <h1 className="hero-heading">
          Choose Degree, Pick Campus <br />
          <span className="hero-heading-gold">Start Your Story</span>
        </h1>

        {/* Floating High-Contrast Search Pill */}
        <form className="hero-search-form" onSubmit={onSearchSubmit}>
          <div className="search-input-group">
            <svg
              className="search-icon-svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by college name, course, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button type="submit" className="hero-btn-submit">
            Search
          </button>
        </form>

        {/* Dot-less Elevated Quick-Filter Chips */}
        <div className="hero-popular-searches">
          <span className="popular-label">Popular:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              className="popular-chip"
              onClick={() => setSearchQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}