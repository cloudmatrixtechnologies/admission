// src/components/home/CollegeCard.jsx
import React from 'react';

const DEFAULT_CAMPUS_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';

export default function CollegeCard({ college = {}, onToggleWishlist }) {
  const {
    collegeId,
    collegeName = 'Unnamed Institution',
    thumbnailImage,
    rating = 0,
    reviewCount = 0,
    institutionType = 'Institution',
    accreditations = [],
    feeRange = { minFee: 0, maxFee: 0 },
    totalSeats = 0,
    city = 'Tamil Nadu',
    state = 'India',
    isWishlisted = false,
    featuredBadge,
  } = college;

  const displayImage = thumbnailImage || DEFAULT_CAMPUS_IMAGE;

  return (
    <div className="college-card">
      {/* Top Media: Image, Badge, and Wishlist Toggle */}
      <div className="card-top-media">
        <img
          src={displayImage}
          alt={collegeName}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null; // Prevents infinite loop if fallback fails
            e.currentTarget.src = DEFAULT_CAMPUS_IMAGE;
          }}
        />

        {featuredBadge && (
          <span className="card-featured-pill">★ {featuredBadge}</span>
        )}

        <button
          type="button"
          aria-label="Wishlist toggle"
          className="card-wishlist-toggle"
          onClick={() => onToggleWishlist && onToggleWishlist(collegeId)}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Card Body */}
      <div className="card-content-body">
        <div className="card-location-meta">
          📍 {city}, {state}
        </div>

        <h3 className="card-institution-name" title={collegeName}>
          {collegeName}
        </h3>

        <div className="card-rating-strip">
          <span className="rating-score">★ {rating ? rating.toFixed(1) : 'New'}</span>
          <span className="review-count">({reviewCount} reviews)</span>
          <span className="institution-type-tag">{institutionType}</span>
        </div>

        <div className="card-badges-list">
          {accreditations &&
            accreditations.map((badge, idx) => (
              <span key={idx} className="accreditation-pill">
                {badge}
              </span>
            ))}
        </div>

        {/* Specs: Annual Fee and Seats */}
        <div className="card-specs-footer">
          <div>
            <span className="specs-label">ANNUAL FEE</span>
            <span className="specs-val">
              {feeRange?.minFee ? `₹${feeRange.minFee.toLocaleString()}` : 'N/A'}
              {feeRange?.maxFee ? ` - ₹${feeRange.maxFee.toLocaleString()}` : ''}
            </span>
          </div>
          <div className="specs-right">
            <span className="specs-label">SEATS</span>
            <span className="specs-val">
              {totalSeats ? `${totalSeats}+` : 'Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="card-button-actions">
        <a href={`/colleges/${collegeId}`} className="btn-card-details">
          View Details
        </a>
        <a href={`/colleges/${collegeId}/courses`} className="btn-card-courses">
          View Courses
        </a>
      </div>
    </div>
  );
}