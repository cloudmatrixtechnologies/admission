// src/components/home/CollegeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_CAMPUS_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';

export default function CollegeCard({ college = {}, onToggleWishlist }) {
  // Resolves collegeId across both numbering schemes (e.g., col_arts_01 or col_003)
  const targetId =
    college.collegeId ||
    college.id ||
    college._id ||
    college.collegeCode ||
    'col_001';

  const {
    collegeName = 'Unnamed Institution',
    collegeCode,
    thumbnailImage,
    coverImage,
    rating = 0,
    reviewCount = 0,
    collegeType,
    institutionType = 'Institution',
    affiliatedUniversity,
    approvedBy,
    accreditations = [],
    featuredBadge,
    shortDescription,
    placementSupport,
    feeRange = { minFee: 0, maxFee: 0 },
    totalSeats = 0,
    coursesOffered = [],
    city = 'Salem',
    state = 'Tamil Nadu',
    establishedYear,
    isWishlisted = false,
  } = college;

  const displayImage = thumbnailImage || coverImage || DEFAULT_CAMPUS_IMAGE;

  const calculatedSeats =
    totalSeats ||
    (Array.isArray(coursesOffered) && coursesOffered.length > 0
      ? coursesOffered.reduce((sum, item) => sum + (Number(item?.seats) || 0), 0)
      : null);

  const badgesList = [
    ...(Array.isArray(accreditations) ? accreditations : []),
    ...(approvedBy && !accreditations?.includes(approvedBy) ? [`${approvedBy} Approved`] : []),
    ...(affiliatedUniversity ? [`Affil. ${affiliatedUniversity}`] : []),
    ...(placementSupport ? [`🎯 ${placementSupport}`] : []),
  ].filter(Boolean);

  return (
    <div className="college-card">
      <div className="card-top-media">
        <img
          src={displayImage}
          alt={collegeName}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
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
          onClick={() => onToggleWishlist && onToggleWishlist(targetId)}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="card-content-body">
        <div className="card-location-meta">
          📍 {city}, {state} {establishedYear ? `• Est. ${establishedYear}` : ''}
        </div>

        <h3 className="card-institution-name" title={collegeName}>
          {collegeName} {collegeCode ? `(${collegeCode})` : ''}
        </h3>

        <div className="card-rating-strip">
          <span className="rating-score">
            ★ {rating ? Number(rating).toFixed(1) : 'New'}
          </span>
          <span className="review-count">({reviewCount} reviews)</span>
          <span className="institution-type-tag">
            {institutionType || collegeType || 'Institution'}
          </span>
        </div>

        {shortDescription && (
          <p
            style={{
              fontSize: '12px',
              color: '#64748b',
              lineHeight: '1.4',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={shortDescription}
          >
            {shortDescription}
          </p>
        )}

        <div className="card-badges-list">
          {badgesList.slice(0, 4).map((badge, idx) => (
            <span key={idx} className="accreditation-pill">
              {badge}
            </span>
          ))}
        </div>

        <div className="card-specs-footer">
          <div>
            <span className="specs-label">ANNUAL FEE</span>
            <span className="specs-val">
              {feeRange?.minFee ? `₹${Number(feeRange.minFee).toLocaleString()}` : 'N/A'}
              {feeRange?.maxFee ? ` - ₹${Number(feeRange.maxFee).toLocaleString()}` : ''}
            </span>
          </div>
          <div className="specs-right">
            <span className="specs-label">SEATS</span>
            <span className="specs-val">
              {calculatedSeats ? `${calculatedSeats}+` : 'Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Passes exact college data through router state for instant zero-lag rendering */}
      <div className="card-button-actions">
        <Link
          to={`/colleges/${targetId}`}
          state={{ college }}
          className="btn-card-details"
        >
          View Details
        </Link>
        <Link
          to={`/colleges/${targetId}/courses`}
          state={{ college }}
          className="btn-card-courses"
        >
          View Courses
        </Link>
      </div>
    </div>
  );
}