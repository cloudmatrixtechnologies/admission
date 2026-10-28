// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import StreamCategories from '../components/home/StreamCategories';
import FeaturedColleges from '../components/home/FeaturedColleges';
import PlatformHighlights from '../components/home/PlatformHighlights';
import { getHomeFeedColleges, toggleWishlist } from '../services/collegeService';

// Fallback data conforming to the backend schema (active only when backend is offline)
const FALLBACK_COLLEGES = [
  {
    collegeId: 'col_eng_01',
    collegeName: 'Government College of Engineering, Salem',
    thumbnailImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
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
    collegeId: 'col_eng_02',
    collegeName: 'Sona College of Technology',
    thumbnailImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPVmLGDzqNVm0J12qLQnNIrLdLCKo0OkOESHx8u9mosoACHbYBB0zWTD8&s=10',
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
    collegeId: 'col_arts_01',
    collegeName: 'Sri Sarada College for Women',
    thumbnailImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
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
    collegeId: 'col_dip_01',
    collegeName: 'Government Polytechnic College',
    thumbnailImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=600&q=80',
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
    collegeId: 'col_iti_01',
    collegeName: 'Government ITI College',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
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
    collegeId: 'col_med_01',
    collegeName: "Vinayaka Mission's Medical College",
    thumbnailImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    collegeType: 'Medical',
    institutionType: 'Private',
    accreditations: ['NMC Approved', 'NABH Accredited'],
    establishedYear: 1995,
    rating: 4.7,
    reviewCount: 980,
    featuredBadge: ' Popular',
    totalSeats: 250,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 150000, maxFee: 450000 },
    isWishlisted: false,
  },
];

export default function HomePage({ onWishlistUpdate }) {
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  const fetchColleges = useCallback(async () => {
    try {
      const response = await getHomeFeedColleges({
        searchQuery,
        selectedStream,
      });

      const liveList = response?.data?.topColleges || response?.data || [];
      // Replace fallback data when real database records arrive
      if (Array.isArray(liveList) && liveList.length > 0) {
        setColleges(liveList);
        return;
      }
    } catch {
      // Backend is offline: apply local filtering on fallback catalog
    }

    // Local fallback filter
    let results = FALLBACK_COLLEGES;

    if (selectedStream) {
      results = results.filter(
        (item) => item.collegeType.toLowerCase() === selectedStream.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.collegeName.toLowerCase().includes(query) ||
          item.collegeType.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
      );
    }

    setColleges(results);
  }, [searchQuery, selectedStream]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchColleges();
  };

  // Toggle stream selection: clicking the active stream deselects it
  const handleSelectStream = (streamId) => {
    setSelectedStream((prev) => (prev === streamId ? '' : streamId));
  };

  const handleToggleWishlist = async (collegeId) => {
    // Optimistic UI update
    setColleges((prev) =>
      prev.map((item) =>
        item.collegeId === collegeId
          ? { ...item, isWishlisted: !item.isWishlisted }
          : item
      )
    );

    try {
      const result = await toggleWishlist(collegeId);
      if (result?.totalWishlistCount !== undefined && onWishlistUpdate) {
        onWishlistUpdate(result.totalWishlistCount);
      }
    } catch {
      // Retain optimistic UI state if offline
    }
  };

  return (
    <div className="homepage-container">
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectStream={handleSelectStream}
        onSearchSubmit={handleSearchSubmit}
      />
      <StreamCategories
        selectedStream={selectedStream}
        onSelectStream={handleSelectStream}
      />
      <FeaturedColleges
        colleges={colleges}
        selectedStream={selectedStream}
        onToggleWishlist={handleToggleWishlist}
      />
      <PlatformHighlights />
    </div>
  );
}