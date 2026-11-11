import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

export default function WishlistPage({ onWishlistUpdate }) {
  // Start with real localStorage items only (starts as empty array [] if none added)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('admizan_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedStream, setSelectedStream] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync state and navbar count on mount
    try {
      const stored = localStorage.getItem('admizan_wishlist');
      const items = stored ? JSON.parse(stored) : [];
      setWishlistItems(items);
      if (onWishlistUpdate) onWishlistUpdate(items.length);
    } catch {
      setWishlistItems([]);
      if (onWishlistUpdate) onWishlistUpdate(0);
    }
  }, []);

  // Remove an item directly from wishlist and localStorage
  const handleRemoveItem = (collegeId) => {
    const updated = wishlistItems.filter(
      (item) => (item.collegeId || item.id) !== collegeId
    );
    setWishlistItems(updated);

    try {
      localStorage.setItem('admizan_wishlist', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (onWishlistUpdate) {
      onWishlistUpdate(updated.length);
    }
  };

  // Clear all saved colleges
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved colleges from your wishlist?')) {
      setWishlistItems([]);
      try {
        localStorage.removeItem('admizan_wishlist');
      } catch (e) {
        console.error(e);
      }
      if (onWishlistUpdate) {
        onWishlistUpdate(0);
      }
    }
  };

  const availableStreams = useMemo(() => {
    const streams = new Set(wishlistItems.map((item) => item.collegeType).filter(Boolean));
    return ['ALL', ...Array.from(streams)];
  }, [wishlistItems]);

  const filteredItems = useMemo(() => {
    return wishlistItems
      .filter((item) => {
        const matchesStream = selectedStream === 'ALL' || item.collegeType === selectedStream;
        const matchesSearch =
          (item.collegeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.city || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStream && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'fee-asc') return (a.feeRange?.minFee || 0) - (b.feeRange?.minFee || 0);
        if (sortBy === 'fee-desc') return (b.feeRange?.maxFee || 0) - (a.feeRange?.maxFee || 0);
        if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [wishlistItems, selectedStream, searchTerm, sortBy]);

  return (
    <div className="wishlist-page-wrapper">
      {/* 1. Top Header */}
      <section className="wishlist-clean-header">
        <div className="wishlist-header-container">
          <div className="breadcrumbs-line">
            <Link to="/" className="b-link">Home</Link>
            <span className="b-sep">/</span>
            <span className="b-curr">My Wishlist</span>
          </div>

          <div className="wishlist-title-strip">
            <div>
              <h1 className="wishlist-heading">Shortlisted Colleges</h1>
              <p className="wishlist-subheading">
                Compare your saved institutions, review tuition matrixes, and plan your admission applications.
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <button type="button" className="btn-clear-wishlist" onClick={handleClearAll}>
                Clear All ({wishlistItems.length})
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Control Bar (visible only when there are saved items) */}
      {wishlistItems.length > 0 && (
        <section className="wishlist-controls-strip">
          <div className="wishlist-controls-container">
            <div className="stream-filter-pills">
              {availableStreams.map((stream) => (
                <button
                  key={stream}
                  type="button"
                  className={`stream-pill ${selectedStream === stream ? 'active' : ''}`}
                  onClick={() => setSelectedStream(stream)}
                >
                  {stream === 'ALL' ? 'All Colleges' : stream}
                  <span className="pill-count">
                    {stream === 'ALL'
                      ? wishlistItems.length
                      : wishlistItems.filter((i) => i.collegeType === stream).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="controls-right-group">
              <div className="wishlist-search-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by college or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="wishlist-sort-box">
                <label>Sort:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recent">Recently Added</option>
                  <option value="rating-desc">Highest Rating</option>
                  <option value="fee-asc">Tuition: Low to High</option>
                  <option value="fee-desc">Tuition: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Catalog Grid */}
      <main className="wishlist-main-workspace">
        <div className="wishlist-workspace-container">
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <div className="empty-bookmark-visual">
                <svg width="68" height="68" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M 4.5 3 C 4.5 1.9 5.4 1 6.5 1 H 17.5 C 18.6 1 19.5 1.9 19.5 3 V 26 L 12 20.8 L 4.5 26 Z"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="#f1f5f9"
                  />
                  <line x1="16.5" y1="4.8" x2="16.5" y2="8.6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2>Your wishlist is empty</h2>
              <p>You haven’t saved any institutions yet. Click the heart icon on any college card to shortlist it here.</p>
              <Link to="/colleges" className="btn-explore-colleges">
                Explore Colleges →
              </Link>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="wishlist-no-match">
              <h3>No shortlisted colleges match your filters</h3>
              <p>Try clearing your search query or selecting a different category.</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStream('ALL');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="wishlist-cards-grid">
              {filteredItems.map((college) => {
                const targetId = college.collegeId || college.id;
                return (
                  <div key={targetId} className="wishlist-card-item">
                    <div className="card-media-wrapper">
                      <img
                        src={college.thumbnailImage}
                        alt={college.collegeName}
                        className="card-media-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="card-media-overlay">
                        <span className="inst-badge-floating">
                          {college.institutionType || college.collegeType}
                        </span>
                        <button
                          type="button"
                          className="btn-remove-bookmark"
                          onClick={() => handleRemoveItem(targetId)}
                          title="Remove from Wishlist"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="card-details-body">
                      <div className="card-meta-line">
                        <span className="loc-text">📍 {college.city}, {college.state}</span>
                        <span className="saved-date-tag">Saved {college.savedAt || 'Recently'}</span>
                      </div>

                      <h3 className="card-college-name">{college.collegeName}</h3>

                      <div className="card-badges-strip">
                        <span className="rating-badge">★ {college.rating} ({college.reviewCount || 0})</span>
                        {college.totalSeats && (
                          <span className="seats-badge">👥 {college.totalSeats}+ Seats</span>
                        )}
                        {college.establishedYear && (
                          <span className="estd-badge">Estd {college.establishedYear}</span>
                        )}
                      </div>

                      <div className="card-fee-divider">
                        <div className="fee-stacked">
                          <span className="fee-lbl">ANNUAL TUITION</span>
                          <span className="fee-amt">
                            ₹{college.feeRange?.minFee?.toLocaleString()}
                            {college.feeRange?.maxFee ? ` - ₹${college.feeRange.maxFee.toLocaleString()}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="card-action-dual">
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}