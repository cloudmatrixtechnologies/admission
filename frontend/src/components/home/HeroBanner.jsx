// src/components/home/HeroBanner.jsx
import React, { useState } from 'react';
import './HeroBanner.css';

const POPULAR_SEARCHES = ['Engineering', 'Arts & Science', 'Diploma', 'ITI', 'Medical'];

export default function HeroBanner({
  searchQuery = '',
  onSearchSubmit = () => {},
  onSelectStream = () => {},
}) {
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    onSearchSubmit(localInput.trim());
  };

  const handlePopularClick = (streamName) => {
    setLocalInput(streamName);
    onSearchSubmit(streamName);
    if (onSelectStream) {
      onSelectStream(streamName);
    }
  };

  return (
    <section className="hero-banner">
      <div className="hero-inner">
        <span className="hero-badge">ADMISSION GUIDANCE</span>

        <h1 className="hero-heading">
          Choose Degree, Pick Campus <br />
          <span className="hero-heading-gold">Start Your Story</span>
        </h1>

        {/* Single-Row Elevated Search Capsule */}
        <form className="hero-search-form" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <svg
              className="search-icon-svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by college name, course, or specialization..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
            />
          </div>

          <button type="submit" className="hero-btn-submit">
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="hero-popular-searches">
          <span className="popular-label">Popular:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              className="popular-chip"
              onClick={() => handlePopularClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}