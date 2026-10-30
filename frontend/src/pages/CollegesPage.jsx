// src/pages/CollegesPage.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import CollegeCard from '../components/home/CollegeCard';
import CollegeCardSlot from '../components/home/CollegeCardSlot';
import { getHomeFeedColleges, toggleWishlist } from '../services/collegeService';
import './CollegesPage.css';

const DICTIONARY = [
  'Engineering',
  'Medical',
  'Arts & Science',
  'Diploma',
  'ITI',
  'Polytechnic',
  'Technology',
  'Autonomous',
  'Government',
  'Sarada',
  'Vinayaka',
  'Sona',
  'PSG'
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Rating: High to Low' },
  { id: 'fee-low', label: 'Fees: Low to High' },
  { id: 'fee-high', label: 'Fees: High to Low' },
];

function getLevenshteinDistance(a, b) {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const matrix = Array.from({ length: s2.length + 1 }, () => []);

  for (let i = 0; i <= s2.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[s2.length][s1.length];
}

const STREAM_ITEMS = [
  { id: 'Engineering', label: 'Engineering', count: '86 Colleges', icon: '⚙️' },
  { id: 'Arts & Science', label: 'Arts & Science', count: '74 Colleges', icon: '🎓' },
  { id: 'Diploma', label: 'Diploma', count: '48 Colleges', icon: '📜' },
  { id: 'ITI', label: 'ITI', count: '36 Colleges', icon: '🔧' },
  { id: 'Medical', label: 'Medical', count: '22 Colleges', icon: '🩺' },
];

const TEMPORARY_COLLEGES = [
  {
    collegeId: 'col_001',
    collegeName: 'Government College of Engineering',
    thumbnailImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Government',
    accreditations: ['Autonomous', 'AICTE Approved', 'NAAC A+'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1966,
    rating: 4.6,
    reviewCount: 1240,
    featuredBadge: 'Top Rated',
    totalSeats: 1200,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 45000, maxFee: 85000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_002',
    collegeName: 'Sona College of Technology',
    // Verified working architectural campus image
    thumbnailImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Private',
    accreditations: ['Autonomous', 'NBA Accredited', 'NAAC A'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1997,
    rating: 4.4,
    reviewCount: 890,
    featuredBadge: null,
    totalSeats: 1800,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 65000, maxFee: 125000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_003',
    collegeName: 'Sri Sarada College for Women',
    thumbnailImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Arts & Science',
    institutionType: 'Autonomous',
    accreditations: ['Autonomous', 'UGC Recognized', 'NAAC A++'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1961,
    rating: 4.5,
    reviewCount: 650,
    featuredBadge: 'Popular',
    totalSeats: 1100,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 20000, maxFee: 50000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_004',
    collegeName: 'Government Polytechnic College',
    thumbnailImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Diploma',
    institutionType: 'Government',
    accreditations: ['Government', 'AICTE Approved', 'DOTE'],
    courseLevels: ['Diploma'],
    establishedYear: 1962,
    rating: 4.3,
    reviewCount: 410,
    featuredBadge: null,
    totalSeats: 750,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 12000, maxFee: 28000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_005',
    collegeName: 'Government ITI College',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    collegeType: 'ITI',
    institutionType: 'Government',
    accreditations: ['NCVT Approved', 'Government Certified'],
    courseLevels: ['ITI'],
    establishedYear: 1978,
    rating: 4.2,
    reviewCount: 320,
    featuredBadge: null,
    totalSeats: 500,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 8000, maxFee: 18000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_006',
    collegeName: "Vinayaka Mission's Medical College",
    thumbnailImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Medical',
    institutionType: 'Private',
    accreditations: ['NMC Approved', 'NABH Accredited'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1995,
    rating: 4.7,
    reviewCount: 980,
    featuredBadge: 'Verified',
    totalSeats: 250,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 150000, maxFee: 450000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_007',
    collegeName: 'Thiagarajar College of Engineering',
    thumbnailImage: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Government-Aided',
    accreditations: ['Autonomous', 'NAAC A++', 'NIRF Ranked'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1957,
    rating: 4.6,
    reviewCount: 1100,
    featuredBadge: 'Top Tier',
    totalSeats: 1400,
    city: 'Madurai',
    state: 'Tamil Nadu',
    feeRange: { minFee: 55000, maxFee: 95000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_008',
    collegeName: 'PSG College of Technology',
    // Verified working engineering campus facade
    thumbnailImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Government-Aided',
    accreditations: ['Autonomous', 'AICTE Approved', 'NBA'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1951,
    rating: 4.8,
    reviewCount: 2100,
    featuredBadge: 'Premier',
    totalSeats: 2200,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    feeRange: { minFee: 70000, maxFee: 140000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_009',
    collegeName: 'Loyola College',
    thumbnailImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Arts & Science',
    institutionType: 'Private',
    accreditations: ['Autonomous', 'UGC Recognized', 'NAAC A++'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1925,
    rating: 4.7,
    reviewCount: 1850,
    featuredBadge: 'Renowned',
    totalSeats: 1500,
    city: 'Chennai',
    state: 'Tamil Nadu',
    feeRange: { minFee: 35000, maxFee: 75000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_010',
    collegeName: 'Madras Medical College',
    thumbnailImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Medical',
    institutionType: 'Government',
    accreditations: ['Government', 'NMC Approved'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1835,
    rating: 4.9,
    reviewCount: 3100,
    featuredBadge: 'Historic',
    totalSeats: 500,
    city: 'Chennai',
    state: 'Tamil Nadu',
    feeRange: { minFee: 25000, maxFee: 60000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_011',
    collegeName: 'Central Polytechnic College',
    thumbnailImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Diploma',
    institutionType: 'Government',
    accreditations: ['Government', 'AICTE Approved'],
    courseLevels: ['Diploma'],
    establishedYear: 1946,
    rating: 4.3,
    reviewCount: 520,
    featuredBadge: null,
    totalSeats: 900,
    city: 'Chennai',
    state: 'Tamil Nadu',
    feeRange: { minFee: 10000, maxFee: 22000 },
    isWishlisted: false,
  },
  {
    collegeId: 'col_012',
    collegeName: 'Government ITI Guindy',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    collegeType: 'ITI',
    institutionType: 'Government',
    accreditations: ['NCVT Approved', 'Government Certified'],
    courseLevels: ['ITI'],
    establishedYear: 1960,
    rating: 4.2,
    reviewCount: 380,
    featuredBadge: null,
    totalSeats: 650,
    city: 'Chennai',
    state: 'Tamil Nadu',
    feeRange: { minFee: 6000, maxFee: 15000 },
    isWishlisted: false,
  }
];

const ITEMS_PER_PAGE = 9;

export default function CollegesPage({ onWishlistUpdate }) {
  const [colleges, setColleges] = useState(TEMPORARY_COLLEGES);

  // Staged filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedWord, setSuggestedWord] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [maxFee, setMaxFee] = useState(500000);

  // Active filter state
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    types: [],
    levels: [],
    fee: 500000,
  });

  // Custom Dropdown State
  const [sortBy, setSortBy] = useState('relevance');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Close custom dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchColleges = useCallback(async () => {
    try {
      const response = await getHomeFeedColleges({});
      const liveList = response?.data?.topColleges || response?.data || [];
      if (Array.isArray(liveList) && liveList.length > 0) {
        setColleges(liveList);
      }
    } catch {
      // Retains TEMPORARY_COLLEGES while backend is offline
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Typo spell check
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 3) {
      setSuggestedWord('');
      return;
    }

    let bestMatch = '';
    let smallestDistance = Infinity;

    for (const word of DICTIONARY) {
      const dist = getLevenshteinDistance(trimmed, word);
      if (dist > 0 && dist <= 2 && dist < smallestDistance) {
        smallestDistance = dist;
        bestMatch = word;
      }
    }

    setSuggestedWord(bestMatch);
  }, [searchQuery]);

  const handleApplySuggestion = () => {
    setSearchQuery(suggestedWord);
    setSuggestedWord('');
    setAppliedFilters((prev) => ({ ...prev, search: suggestedWord }));
    setCurrentPage(1);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLevelToggle = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleQuickStreamClick = (streamId) => {
    const nextTypes = selectedTypes.includes(streamId)
      ? selectedTypes.filter((t) => t !== streamId)
      : [streamId];
    setSelectedTypes(nextTypes);
    setAppliedFilters((prev) => ({ ...prev, types: nextTypes }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery.trim(),
      types: selectedTypes,
      levels: selectedLevels,
      fee: maxFee,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSuggestedWord('');
    setSelectedTypes([]);
    setSelectedLevels([]);
    setMaxFee(500000);
    setAppliedFilters({
      search: '',
      types: [],
      levels: [],
      fee: 500000,
    });
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const handleSelectSort = (optionId) => {
    setSortBy(optionId);
    setIsSortOpen(false);
  };

  const handleToggleWishlist = async (collegeId) => {
    setColleges((prev) =>
      prev.map((c) =>
        c.collegeId === collegeId ? { ...c, isWishlisted: !c.isWishlisted } : c
      )
    );

    try {
      const res = await toggleWishlist(collegeId);
      if (res?.totalWishlistCount !== undefined && onWishlistUpdate) {
        onWishlistUpdate(res.totalWishlistCount);
      }
    } catch {
      // Optimistic update retained
    }
  };

  const filteredColleges = useMemo(() => {
    return colleges
      .filter((college) => {
        if (appliedFilters.search) {
          const q = appliedFilters.search.toLowerCase();
          const matchName = college.collegeName.toLowerCase().includes(q);
          const matchType = college.collegeType.toLowerCase().includes(q);
          if (!matchName && !matchType) return false;
        }

        if (appliedFilters.types.length > 0) {
          if (!appliedFilters.types.includes(college.collegeType)) return false;
        }

        if (appliedFilters.levels.length > 0) {
          const hasLevel = college.courseLevels?.some((lvl) =>
            appliedFilters.levels.includes(lvl)
          );
          if (!hasLevel) return false;
        }

        if (college.feeRange?.minFee && college.feeRange.minFee > appliedFilters.fee) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fee-low') return a.feeRange.minFee - b.feeRange.minFee;
        if (sortBy === 'fee-high') return b.feeRange.maxFee - a.feeRange.maxFee;
        return 0;
      });
  }, [colleges, appliedFilters, sortBy]);

  const totalItems = filteredColleges.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSlotItems = filteredColleges.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'Relevance';

  return (
    <div className="colleges-page-container">
      {/* Top Banner with exact colleges-page.jpeg Slanted Campus Building */}
      <section className="colleges-top-banner">
        <div className="banner-fluid-inner">
          <div className="banner-left-content">
            <nav className="catalog-breadcrumbs" aria-label="Breadcrumb">
              <a href="/" className="crumb-link">Home</a>
              <span className="crumb-slash">/</span>
              <span className="crumb-current">Colleges</span>
            </nav>
            <h1 className="banner-title">Explore Colleges</h1>
            <p className="banner-subtitle">
              Discover top colleges, compare courses, fees, eligibility, and facilities. Find the best college for your future without login.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Top Stream Category Strip */}
      <section className="colleges-stream-strip-section">
        <div className="stream-strip-inner">
          {STREAM_ITEMS.map((item) => {
            const isSelected = appliedFilters.types.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`stream-strip-pill ${isSelected ? 'active' : ''}`}
                onClick={() => handleQuickStreamClick(item.id)}
              >
                <span className="stream-pill-icon">{item.icon}</span>
                <div className="stream-pill-text">
                  <span className="stream-pill-title">{item.label}</span>
                  <span className="stream-pill-count">{item.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main End-to-End Catalog Workspace */}
      <div className="catalog-fluid-layout">
        {/* Left Filter Sidebar */}
        <aside className="catalog-sidebar">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button type="button" className="btn-reset" onClick={handleResetFilters}>
              Reset All
            </button>
          </div>

          {/* Search with Typo Suggestion */}
          <div className="filter-group">
            <label className="filter-title">Search College</label>
            <div className="search-field-wrap">
              <input
                type="text"
                placeholder="Search college or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
            {suggestedWord && (
              <div className="typo-suggestion-box">
                <span>Did you mean:</span>
                <button type="button" onClick={handleApplySuggestion}>
                  "{suggestedWord}"?
                </button>
              </div>
            )}
          </div>

          {/* College Types */}
          <div className="filter-group">
            <label className="filter-title">College Type</label>
            <div className="checkbox-list">
              {['Engineering', 'Arts & Science', 'Diploma', 'ITI', 'Medical'].map((type) => (
                <label key={type} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Course Levels */}
          <div className="filter-group">
            <label className="filter-title">Course Level</label>
            <div className="checkbox-list">
              {['UG', 'PG', 'Diploma', 'ITI'].map((level) => (
                <label key={level} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => handleLevelToggle(level)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Annual Fee Slider */}
          <div className="filter-group">
            <div className="fee-label-row">
              <label className="filter-title">Max Annual Tuition</label>
              <span className="fee-val-text">₹{Number(maxFee).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="fee-slider"
            />
            <div className="fee-ticks">
              <span>₹10k</span>
              <span>₹2.5L</span>
              <span>₹5L+</span>
            </div>
          </div>

          {/* Apply Filters Action Button */}
          <div className="filter-bottom-actions">
            <button
              type="button"
              className="btn-apply-filters"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Right College Cards Workspace */}
        <main className="catalog-main">
          {/* Toolbar with Grid/List Toggle & Custom Dropdown */}
          <div className="catalog-toolbar">
            <div className="view-mode-selector">
              <span className="view-label">View:</span>
              <div className="view-toggle-capsule">
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="3" rx="1" />
                    <rect x="3" y="10.5" width="18" height="3" rx="1" />
                    <rect x="3" y="17" width="18" height="3" rx="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Custom Interactive Dropdown Menu */}
            <div className="custom-sort-wrapper" ref={sortRef}>
              <span className="sort-label">Sort By:</span>
              <div className="custom-dropdown-container">
                <button
                  type="button"
                  className={`custom-dropdown-trigger ${isSortOpen ? 'open' : ''}`}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  <svg className="sort-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span className="selected-sort-text">{currentSortLabel}</span>
                  <svg className={`sort-chevron ${isSortOpen ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isSortOpen && (
                  <ul className="custom-dropdown-menu" role="listbox">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = opt.id === sortBy;
                      return (
                        <li
                          key={opt.id}
                          className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectSort(opt.id)}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span className="item-check">✓</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Grid / List Display */}
          <div className={viewMode === 'list' ? 'catalog-list' : 'catalog-grid'}>
            {currentSlotItems.length > 0 ? (
              currentSlotItems.map((college) => (
                <CollegeCard
                  key={college.collegeId}
                  college={college}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))
            ) : (
              [...Array(viewMode === 'list' ? 4 : 9)].map((_, idx) => (
                <CollegeCardSlot key={idx} slotIndex={idx + 1} />
              ))
            )}
          </div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="btn-page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ← Prev
              </button>

              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="btn-page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}