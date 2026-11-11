// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import StreamCategories from '../components/home/StreamCategories';
import FeaturedColleges from '../components/home/FeaturedColleges';
import PlatformHighlights from '../components/home/PlatformHighlights';
import { getHomeFeedColleges, toggleWishlist } from '../services/collegeService';

const FALLBACK_FEED_COLLEGES = [
  {
    collegeId: 'col_001',
    collegeName: 'Government College of Engineering, Salem',
    thumbnailImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Government',
    accreditations: ['Autonomous', 'AICTE Approved', 'NAAC A+'],
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
    thumbnailImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    collegeType: 'Engineering',
    institutionType: 'Private',
    accreditations: ['Autonomous', 'NBA Accredited', 'NAAC A'],
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
    collegeName: 'Government ITI Salem',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    collegeType: 'ITI',
    institutionType: 'Government',
    accreditations: ['NCVT Approved', 'Government Certified'],
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
    collegeId: 'col_012',
    collegeName: 'Government ITI Guindy',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    collegeType: 'ITI',
    institutionType: 'Government',
    accreditations: ['NCVT Approved', 'Government Certified'],
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

export default function HomePage({ onWishlistUpdate }) {
  const [colleges, setColleges] = useState(FALLBACK_FEED_COLLEGES);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  // Fetch from live backend if available, fallback silently if offline
  const fetchColleges = useCallback(async () => {
    try {
      const response = await getHomeFeedColleges({
        searchQuery: appliedSearchQuery,
        selectedStream,
      });
      const list = response?.data?.topColleges || response?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setColleges(list);
      }
    } catch {
      // Backend is offline — stays on FALLBACK_FEED_COLLEGES
    }
  }, [appliedSearchQuery, selectedStream]);

useEffect(() => {
  try {
    const raw = localStorage.getItem('admizan_wishlist');
    const saved = raw ? JSON.parse(raw) : [];
    const savedIds = new Set(saved.map((item) => item.collegeId || item.id));

    setColleges((prev) =>
      prev.map((c) => ({
        ...c,
        isWishlisted: savedIds.has(c.collegeId || c.id),
      }))
    );

    if (onWishlistUpdate) {
      onWishlistUpdate(saved.length);
    }
  } catch (e) {
    console.error(e);
  }
}, []);

  // Receives the committed string query when Search button is clicked or Enter is pressed
  const handleSearchSubmit = (query) => {
    const cleanQuery = typeof query === 'string' ? query.trim() : '';
    setAppliedSearchQuery(cleanQuery);

    // If searching specifically for ITI, Engineering, etc., sync the stream
    const lower = cleanQuery.toLowerCase();
    if (lower === 'iti') setSelectedStream('ITI');
    else if (lower === 'engineering') setSelectedStream('Engineering');
    else if (lower === 'medical') setSelectedStream('Medical');
    else if (lower === 'diploma') setSelectedStream('Diploma');
    else if (lower === 'arts & science' || lower === 'arts') setSelectedStream('Arts & Science');
  };

  const handleSelectStream = (stream) => {
    // Toggle on/off if clicked again
    setSelectedStream((prev) => (prev === stream ? '' : stream));
  };

  const handleToggleWishlist = (collegeId) => {
  let currentList = [];
  try {
    const raw = localStorage.getItem('admizan_wishlist');
    currentList = raw ? JSON.parse(raw) : [];
  } catch {
    currentList = [];
  }

  const isAlreadySaved = currentList.some(
    (item) => (item.collegeId || item.id) === collegeId
  );

  let updatedList;
  if (isAlreadySaved) {
    // Remove if clicked again
    updatedList = currentList.filter(
      (item) => (item.collegeId || item.id) !== collegeId
    );
  } else {
    // Add college with timestamp
    const target = colleges.find(
      (item) => (item.collegeId || item.id) === collegeId
    );
    if (target) {
      updatedList = [
        ...currentList,
        {
          ...target,
          isWishlisted: true,
          savedAt: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        },
      ];
    } else {
      updatedList = currentList;
    }
  }

  // Save to browser memory
  try {
    localStorage.setItem('admizan_wishlist', JSON.stringify(updatedList));
  } catch (e) {
    console.error(e);
  }

  // Update visual heart state in card list
  setColleges((prev) =>
    prev.map((c) =>
      (c.collegeId || c.id) === collegeId
        ? { ...c, isWishlisted: !isAlreadySaved }
        : c
    )
  );

  // Update navbar badge count
  if (onWishlistUpdate) {
    onWishlistUpdate(updatedList.length);
  }
};

  // Filter colleges in real time based on the submitted search query & selected stream
  const displayedColleges = useMemo(() => {
    return colleges.filter((c) => {
      if (appliedSearchQuery) {
        const q = appliedSearchQuery.toLowerCase();
        const matchName = c.collegeName?.toLowerCase().includes(q);
        const matchType = c.collegeType?.toLowerCase().includes(q);
        const matchCity = c.city?.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchCity) return false;
      }

      if (selectedStream) {
        if (c.collegeType?.toLowerCase() !== selectedStream.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [colleges, appliedSearchQuery, selectedStream]);

  return (
    <div className="homepage-container">
      <HeroBanner
        searchQuery={appliedSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectStream={handleSelectStream}
      />
      <StreamCategories
        selectedStream={selectedStream}
        onSelectStream={handleSelectStream}
      />
      <FeaturedColleges
        colleges={displayedColleges}
        onToggleWishlist={handleToggleWishlist}
      />
      <PlatformHighlights />
    </div>
  );
}