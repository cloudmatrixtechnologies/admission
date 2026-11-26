import { apiRequest, USE_MOCK_AUTH } from './mobileApiClient';

export const STREAM_CATEGORIES = [
  { id: 'Engineering', label: 'Engineering', count: '86 Colleges', icon: 'settings-outline', color: '#0D9488' },
  { id: 'Arts & Science', label: 'Arts & Science', count: '74 Colleges', icon: 'school-outline', color: '#DC2626' },
  { id: 'Diploma', label: 'Diploma', count: '48 Colleges', icon: 'document-text-outline', color: '#059669' },
  { id: 'ITI', label: 'ITI', count: '36 Colleges', icon: 'construct-outline', color: '#D97706' },
  { id: 'Medical', label: 'Medical', count: '22 Colleges', icon: 'medkit-outline', color: '#E11D48' },
];

// Temporary offline seed data — automatically cleared once live API returns records
export const SAMPLE_COLLEGES = [
  {
    collegeId: 'col_001',
    collegeName: 'Government College of Engineering, Salem',
    thumbnailImage: null,
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
  },
  {
    collegeId: 'col_002',
    collegeName: 'Sona College of Technology',
    thumbnailImage: null,
    collegeType: 'Engineering',
    institutionType: 'Private',
    accreditations: ['Autonomous', 'NBA Accredited', 'NAAC A'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1997,
    rating: 4.4,
    reviewCount: 892,
    featuredBadge: 'Popular',
    totalSeats: 1800,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 65000, maxFee: 125000 },
  },
  {
    collegeId: 'col_003',
    collegeName: 'Sri Sarada College for Women',
    thumbnailImage: null,
    collegeType: 'Arts & Science',
    institutionType: 'Autonomous',
    accreditations: ['Autonomous', 'UGC Recognized', 'NAAC A++'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1961,
    rating: 4.5,
    reviewCount: 650,
    featuredBadge: 'Trending',
    totalSeats: 1100,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 20000, maxFee: 50000 },
  },
  {
    collegeId: 'col_004',
    collegeName: 'Government Polytechnic College, Salem',
    thumbnailImage: null,
    collegeType: 'Diploma',
    institutionType: 'Government',
    accreditations: ['Government', 'AICTE Approved', 'DOTE'],
    courseLevels: ['Diploma'],
    establishedYear: 1962,
    rating: 4.2,
    reviewCount: 420,
    featuredBadge: null,
    totalSeats: 750,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 10000, maxFee: 30000 },
  },
  {
    collegeId: 'col_005',
    collegeName: 'Government ITI Salem',
    thumbnailImage: null,
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
  },
  {
    collegeId: 'col_006',
    collegeName: "Vinayaka Mission's Medical College",
    thumbnailImage: null,
    collegeType: 'Medical',
    institutionType: 'Private',
    accreditations: ['NMC Approved', 'NABH Accredited'],
    courseLevels: ['UG', 'PG'],
    establishedYear: 1995,
    rating: 4.7,
    reviewCount: 980,
    featuredBadge: 'Top Rated',
    totalSeats: 250,
    city: 'Salem',
    state: 'Tamil Nadu',
    feeRange: { minFee: 150000, maxFee: 450000 },
  },
];

export async function getHomeFeedColleges(params = {}) {
  // 1. Always attempt live backend first when mock mode is off
  if (!USE_MOCK_AUTH) {
    const qs = new URLSearchParams(params).toString();
    const res = await apiRequest(`/colleges${qs ? `?${qs}` : ''}`);
    const liveList = res?.data?.topColleges || res?.data || [];
    // Live backend active: return ONLY real records (dummy data is cleared)
    return Array.isArray(liveList) ? liveList : [];
  }

  // 2. Mock mode active: return temporary dummy colleges with empty image slots
  return SAMPLE_COLLEGES;
}