// src/pages/CollegeDetailsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import * as collegeService from '../services/collegeService';
import './CollegeDetailsPage.css';

// Master institutional catalog supporting both ID standards (col_001-col_012 and col_eng/col_arts)
const MASTER_CATALOG = [
  {
    collegeId: 'col_001',
    aliasIds: ['col_001', 'col_eng_01', '1', 'gce', 'gce-1966'],
    keywords: ['engineering, salem', 'government college of engineering'],
    collegeName: 'Government College of Engineering, Salem',
    collegeCode: 'GCE-1966',
    coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 1240,
    collegeType: 'Engineering',
    institutionType: 'Government Autonomous',
    affiliatedUniversity: 'Anna University, Chennai',
    approvedBy: 'AICTE',
    accreditations: ['Autonomous', 'AICTE Approved', 'NAAC A+'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1966,
    shortDescription: 'Premier government autonomous engineering institution offering state-of-the-art technical education and research.',
    aboutCollege: 'Government College of Engineering, Salem, was established in 1966 by the Government of Tamil Nadu. Over five decades, it has evolved into a premier center of technical excellence recognized by AICTE and accredited with NAAC A+ grade.',
    totalStudents: '3,800+',
    facultyCount: '190+',
    totalDepartments: '8 Departments',
    placementSupport: '94% Placement Rate (Avg CTC ₹6.2 LPA)',
    facilities: [
      'Boys & Girls Hostels',
      'Transport Facility (College Buses)',
      'Central Digital Library',
      'Hygienic Cafeteria',
      'Sports Complex & Gym',
      'High-Speed Wi-Fi Campus',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'B.E. Computer Science and Engineering', courseLevel: 'UG', duration: '4 Years', seats: 120, annualFee: 45000, eligibility: '12th Standard with PCM' },
      { courseName: 'B.E. Electronics and Communication', courseLevel: 'UG', duration: '4 Years', seats: 120, annualFee: 45000, eligibility: '12th Standard with PCM' },
      { courseName: 'B.E. Mechanical Engineering', courseLevel: 'UG', duration: '4 Years', seats: 60, annualFee: 40000, eligibility: '12th Standard with PCM' },
      { courseName: 'M.E. Structural Engineering', courseLevel: 'PG', duration: '2 Years', seats: 25, annualFee: 55000, eligibility: 'B.E. Civil with TANCET/GATE' },
    ],
  },
  {
    collegeId: 'col_002',
    aliasIds: ['col_002', 'col_eng_02', '2', 'sona', 'sona-1997'],
    keywords: ['sona', 'sona college'],
    collegeName: 'Sona College of Technology',
    collegeCode: 'SONA-1997',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviewCount: 890,
    collegeType: 'Engineering',
    institutionType: 'Private Autonomous',
    affiliatedUniversity: 'Anna University, Chennai',
    approvedBy: 'AICTE',
    accreditations: ['Autonomous', 'NBA Accredited', 'NAAC A'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1997,
    shortDescription: 'Internationally recognized autonomous institution with leading research centers, global tie-ups, and innovation hubs.',
    aboutCollege: 'Sona College of Technology in Salem has been recognized for quality technical education and research since 1997. The college boasts modern laboratories, an active entrepreneurship cell, and strong industry partnerships with top IT and core firms.',
    totalStudents: '5,200+',
    facultyCount: '320+',
    totalDepartments: '12 Departments',
    placementSupport: '91% Campus Placements (Top CTC ₹18 LPA)',
    facilities: [
      'SONA Incubation & Startup Cell',
      'Advanced Robotics & AI Labs',
      'Modern High-Rise Hostels',
      'Multi-Cuisine Cafeteria',
      'Indoor Badminton & Basketball Courts',
      '24/7 Library & Research Commons',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'B.Tech Artificial Intelligence & Data Science', courseLevel: 'UG', duration: '4 Years', seats: 120, annualFee: 85000, eligibility: '12th Standard with PCM' },
      { courseName: 'B.E. Computer Science and Engineering', courseLevel: 'UG', duration: '4 Years', seats: 180, annualFee: 80000, eligibility: '12th Standard with PCM' },
      { courseName: 'B.E. Mechatronics Engineering', courseLevel: 'UG', duration: '4 Years', seats: 60, annualFee: 75000, eligibility: '12th Standard with PCM' },
      { courseName: 'MBA (Master of Business Administration)', courseLevel: 'PG', duration: '2 Years', seats: 120, annualFee: 90000, eligibility: 'Any Bachelor Degree + MAT/TANCET' },
    ],
  },
  {
    collegeId: 'col_003',
    aliasIds: ['col_003', 'col_arts_01', '3', 'sarada', 'sscw', 'sscw-1961'],
    keywords: ['sarada', 'sri sarada', 'women'],
    collegeName: 'Sri Sarada College for Women',
    collegeCode: 'SSCW-1961',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 650,
    collegeType: 'Arts & Science',
    institutionType: 'Autonomous',
    affiliatedUniversity: 'Periyar University',
    approvedBy: 'UGC',
    accreditations: ['Autonomous', 'UGC Recognized', 'NAAC A++'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1961,
    shortDescription: 'Pioneering women’s autonomous institution providing education across humanities, commerce, and pure sciences.',
    aboutCollege: 'Founded in 1961 by Srimat Swami Chidbhavananda, Sri Sarada College for Women stands for academic rigor, ethical values, and women empowerment. The institution holds NAAC A++ accreditation with high CGPA scores.',
    totalStudents: '4,100+',
    facultyCount: '210+',
    totalDepartments: '14 Departments',
    placementSupport: 'Dedicated Career Development & Civil Service Coaching',
    facilities: [
      'Digital Language Laboratory',
      'Spacious Heritage Auditorium',
      'Botanical Gardens & Herbarium',
      'Girls Residential Hostel',
      'Yoga & Wellness Pavilion',
      'Periyar University Research Annex',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'B.Sc Computer Science', courseLevel: 'UG', duration: '3 Years', seats: 60, annualFee: 28000, eligibility: '12th with Mathematics/CS' },
      { courseName: 'B.Com (Corporate Secretaryship)', courseLevel: 'UG', duration: '3 Years', seats: 120, annualFee: 26000, eligibility: '12th with Commerce/Accountancy' },
      { courseName: 'B.A. English Literature', courseLevel: 'UG', duration: '3 Years', seats: 60, annualFee: 20000, eligibility: '12th Standard Pass' },
      { courseName: 'M.Sc Data Analytics', courseLevel: 'PG', duration: '2 Years', seats: 30, annualFee: 35000, eligibility: 'B.Sc in relevant field' },
    ],
  },
  {
    collegeId: 'col_004',
    aliasIds: ['col_004', 'col_dip_01', '4', 'polytechnic', 'gpt', 'gpt-1962'],
    keywords: ['polytechnic', 'diploma'],
    collegeName: 'Government Polytechnic College',
    collegeCode: 'GPT-1962',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviewCount: 410,
    collegeType: 'Diploma',
    institutionType: 'Government',
    affiliatedUniversity: 'DOTE Tamil Nadu',
    approvedBy: 'AICTE',
    accreditations: ['Government', 'AICTE Approved', 'DOTE'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1962,
    shortDescription: 'State-run polytechnic college delivering hands-on diploma engineering training with high industry recruitment.',
    aboutCollege: 'Government Polytechnic College Salem equips students with practical engineering expertise across mechanical, civil, electrical, and computer fields, backed by low fees and government scholarships.',
    totalStudents: '1,800+',
    facultyCount: '95+',
    totalDepartments: '6 Departments',
    placementSupport: '88% Placement in Core Manufacturing & Automotive Industries',
    facilities: [
      'Heavy Machinery & CNC Workshop',
      'Electrical Power Machines Lab',
      'Civil Surveying Field Lab',
      'Subsidized Student Mess',
      'College Bus Transport Service',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'Diploma in Mechanical Engineering', courseLevel: 'Diploma', duration: '3 Years', seats: 120, annualFee: 15000, eligibility: '10th Standard Pass' },
      { courseName: 'Diploma in Electrical & Electronics', courseLevel: 'Diploma', duration: '3 Years', seats: 60, annualFee: 15000, eligibility: '10th Standard Pass' },
      { courseName: 'Diploma in Computer Engineering', courseLevel: 'Diploma', duration: '3 Years', seats: 60, annualFee: 18000, eligibility: '10th Standard Pass' },
    ],
  },
  {
    collegeId: 'col_005',
    aliasIds: ['col_005', 'col_iti_01', '5', 'iti', 'giti', 'giti-1978'],
    keywords: ['iti', 'industrial training'],
    collegeName: 'Government ITI College',
    collegeCode: 'GITI-1978',
    coverImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviewCount: 320,
    collegeType: 'ITI',
    institutionType: 'Government',
    affiliatedUniversity: 'NCVT / NACT',
    approvedBy: 'DGT Government of India',
    accreditations: ['NCVT Approved', 'Government Certified'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1978,
    shortDescription: 'Government industrial training institute dedicated to building vocational craft skills and industrial apprenticeships.',
    aboutCollege: 'Government ITI Salem provides certified vocational education under NCVT, enabling students from all backgrounds to secure technical careers and apprenticeships across major public and private sectors.',
    totalStudents: '950+',
    facultyCount: '45+',
    totalDepartments: '5 Vocational Trades',
    placementSupport: 'Apprenticeship placement in Indian Railways, TNEB, and BHEL',
    facilities: [
      'Certified Industrial Welding Bay',
      'Automotive Motor Vehicle Garage',
      'Electrical Wiring & Testing Stations',
      'Free Toolkits & Government Uniforms',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'Electrician Trade (NCVT)', courseLevel: 'ITI', duration: '2 Years', seats: 80, annualFee: 10000, eligibility: '10th Pass with Science & Math' },
      { courseName: 'Fitter Trade (NCVT)', courseLevel: 'ITI', duration: '2 Years', seats: 80, annualFee: 10000, eligibility: '10th Pass' },
      { courseName: 'Mechanic Motor Vehicle (MMV)', courseLevel: 'ITI', duration: '2 Years', seats: 40, annualFee: 12000, eligibility: '10th Pass' },
    ],
  },
  {
    collegeId: 'col_006',
    aliasIds: ['col_006', 'col_med_01', '6', 'medical', 'vinayaka', 'vmmc', 'vmmc-1995'],
    keywords: ['vinayaka', 'medical', 'mission'],
    collegeName: "Vinayaka Mission's Medical College",
    collegeCode: 'VMMC-1995',
    coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 980,
    collegeType: 'Medical',
    institutionType: 'Private Deemed University',
    affiliatedUniversity: 'VMRF Deemed University',
    approvedBy: 'National Medical Commission (NMC)',
    accreditations: ['NMC Approved', 'NABH Accredited', 'NAAC Accredited'],
    city: 'Salem',
    state: 'Tamil Nadu',
    establishedYear: 1995,
    shortDescription: 'Premier medical institution featuring an 800-bed multi-speciality tertiary hospital and healthcare research complex.',
    aboutCollege: "Vinayaka Mission's Medical College combines medical education with super-speciality patient healthcare. Students undergo clinical training at the attached teaching hospital with round-the-clock emergency care.",
    totalStudents: '2,400+',
    facultyCount: '380+',
    totalDepartments: '21 Clinical & Pre-Clinical',
    placementSupport: '100% Compulsory Rotatory Medical Internship (CRMI)',
    facilities: [
      '800-Bed Tertiary Teaching Hospital',
      'Advanced 24/7 Trauma & Critical Care Unit',
      'Central Clinical Diagnostic Labs',
      'AC Lecture Theaters & Medical Simulation Lab',
      'Separate Doctors & Students Hostels',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    ],
    coursesOffered: [
      { courseName: 'MBBS (Medicine & Surgery)', courseLevel: 'UG', duration: '5.5 Years', seats: 150, annualFee: 180000, eligibility: '12th PCB + NEET UG Qualified' },
      { courseName: 'MD General Medicine', courseLevel: 'PG', duration: '3 Years', seats: 20, annualFee: 350000, eligibility: 'MBBS + NEET PG' },
      { courseName: 'B.Sc Nursing', courseLevel: 'UG', duration: '4 Years', seats: 60, annualFee: 85000, eligibility: '12th with PCB' },
    ],
  },
];

// Universal multi-alias resolver supporting every ID pattern
function resolveCollege(rawId) {
  if (!rawId) return MASTER_CATALOG[0];

  const term = decodeURIComponent(String(rawId)).toLowerCase().trim();

  // 1. Direct alias ID match (covers col_eng_01, col_arts_01, col_001, etc.)
  const aliasMatch = MASTER_CATALOG.find((c) =>
    c.aliasIds?.some((alias) => alias.toLowerCase() === term)
  );
  if (aliasMatch) return aliasMatch;

  // 2. Direct numeric index match (e.g., /colleges/2 or /colleges/3)
  const numIndex = parseInt(term, 10);
  if (!isNaN(numIndex) && numIndex >= 1 && numIndex <= MASTER_CATALOG.length) {
    return MASTER_CATALOG[numIndex - 1];
  }

  // 3. Exact matching on collegeId, collegeCode, or collegeName
  const directMatch = MASTER_CATALOG.find((c) => {
    return (
      c.collegeId.toLowerCase() === term ||
      c.collegeCode.toLowerCase() === term ||
      c.collegeName.toLowerCase() === term
    );
  });
  if (directMatch) return directMatch;

  // 4. Keyword and partial title matching
  const keywordMatch = MASTER_CATALOG.find((c) => {
    const cName = c.collegeName.toLowerCase();
    const hasKeyword = c.keywords?.some((k) => term.includes(k) || k.includes(term));
    return hasKeyword || cName.includes(term) || term.includes(cName);
  });
  if (keywordMatch) return keywordMatch;

  return MASTER_CATALOG[0];
}

export default function CollegeDetailsPage({ onWishlistUpdate }) {
  const { id } = useParams();
  const location = useLocation();

  // Static resolver fallback
  const resolvedCatalogCollege = useMemo(() => resolveCollege(id), [id]);

  // Merges Link route state with catalog specifications to ensure complete sections
  const college = useMemo(() => {
    const stateCollege = location.state?.college;
    if (stateCollege && (stateCollege.collegeName || stateCollege.collegeId)) {
      const baseMatched = resolveCollege(stateCollege.collegeId || stateCollege.collegeName);
      return {
        ...baseMatched,
        ...stateCollege,
        coursesOffered: stateCollege.coursesOffered?.length
          ? stateCollege.coursesOffered
          : baseMatched.coursesOffered,
        facilities: stateCollege.facilities?.length
          ? stateCollege.facilities
          : baseMatched.facilities,
        galleryImages: stateCollege.galleryImages?.length
          ? stateCollege.galleryImages
          : baseMatched.galleryImages,
        aboutCollege: stateCollege.aboutCollege || baseMatched.aboutCollege,
      };
    }
    return resolvedCatalogCollege;
  }, [location.state, resolvedCatalogCollege]);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPhoto(null);
    setActiveTab('overview');
  }, [id, location.state]);

  const handleToggleHeart = async () => {
    setIsWishlisted((prev) => !prev);
    if (onWishlistUpdate) {
      onWishlistUpdate((prev) => (isWishlisted ? Math.max(0, prev - 1) : prev + 1));
    }

    // Safely invokes backend service without throwing if unexported
    try {
      if (college?.collegeId && typeof collegeService?.toggleWishlist === 'function') {
        await collegeService.toggleWishlist(college.collegeId);
      }
    } catch {
      // Retains optimistic UI state
    }
  };

  const {
    collegeName,
    collegeCode,
    coverImage,
    thumbnailImage,
    rating = 4.5,
    reviewCount = 0,
    collegeType = 'Engineering',
    institutionType = 'Institution',
    affiliatedUniversity,
    approvedBy,
    accreditations = [],
    city = 'Salem',
    state = 'Tamil Nadu',
    establishedYear = 2000,
    shortDescription,
    aboutCollege,
    totalStudents,
    facultyCount,
    totalDepartments,
    placementSupport,
    facilities = [],
    galleryImages = [],
    coursesOffered = [],
  } = college;

  const activeHeroImage = coverImage || thumbnailImage;
  const currentPhotoPreview = selectedPhoto || galleryImages[0] || activeHeroImage;

  return (
    <div className="college-details-container">
      {/* Breadcrumb Navigation */}
      <div className="details-breadcrumbs-bar">
        <div className="details-centered-wrapper">
          <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
            <Link to="/" className="crumb-link">Home</Link>
            <span className="crumb-sep">/</span>
            <Link to="/colleges" className="crumb-link">Colleges</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{collegeName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="details-hero-banner">
        <div
          className="hero-banner-backdrop"
          style={{ backgroundImage: `url(${activeHeroImage})` }}
        >
          <div className="hero-gradient-overlay" />
        </div>

        <div className="details-centered-wrapper hero-content-relative">
          <div className="hero-meta-row">
            <span className="hero-type-pill">{institutionType || collegeType}</span>
            {establishedYear && (
              <span className="hero-est-pill">Established {establishedYear}</span>
            )}
            {collegeCode && (
              <span className="hero-code-pill">Code: {collegeCode}</span>
            )}
          </div>

          <h1 className="hero-college-title">{collegeName}</h1>

          <div className="hero-location-rating">
            <span className="hero-loc-text">
              📍 {city}, {state}
            </span>
            <span className="hero-bullet">•</span>
            <div className="hero-star-box">
              ⭐ <strong>{rating ? Number(rating).toFixed(1) : 'New'}</strong>
              <span className="hero-reviews">({reviewCount} reviews)</span>
            </div>
          </div>

          <div className="hero-badges-strip">
            {accreditations.map((badge, idx) => (
              <span key={idx} className="hero-badge-tag">{badge}</span>
            ))}
            {approvedBy && !accreditations.includes(approvedBy) && (
              <span className="hero-badge-tag">{approvedBy} Approved</span>
            )}
            {affiliatedUniversity && (
              <span className="hero-badge-tag">Affiliated to {affiliatedUniversity}</span>
            )}
          </div>

          <div className="hero-actions-group">
            <button
              type="button"
              onClick={handleToggleHeart}
              className={`btn-hero-wishlist ${isWishlisted ? 'active' : ''}`}
            >
              {isWishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </section>

      {/* 4 Stat Metric Counters */}
      <section className="details-stats-section">
        <div className="details-centered-wrapper stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-text">
              <span className="stat-number">{totalStudents || '3,000+'}</span>
              <span className="stat-label">Total Enrolled Students</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👨‍🏫</span>
            <div className="stat-text">
              <span className="stat-number">{facultyCount || '150+'}</span>
              <span className="stat-label">Qualified Faculty</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏛️</span>
            <div className="stat-text">
              <span className="stat-number">{totalDepartments || '8+'}</span>
              <span className="stat-label">Academic Departments</span>
            </div>
          </div>
          <div className="stat-card highlight">
            <span className="stat-icon">🎯</span>
            <div className="stat-text">
              <span className="stat-number">Placements</span>
              <span className="stat-label">{placementSupport || 'Active Training Cell'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="details-tab-nav-bar">
        <div className="details-centered-wrapper tab-button-cluster">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Facilities
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses & Fees ({coursesOffered.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Campus Photos ({galleryImages.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <main className="details-centered-wrapper details-body-layout">
        {activeTab === 'overview' && (
          <div className="tab-pane-content">
            <article className="content-card">
              <h2 className="card-section-heading">About {collegeName}</h2>
              {shortDescription && (
                <p className="lead-description-text">{shortDescription}</p>
              )}
              <p className="full-description-text">{aboutCollege}</p>
            </article>

            <article className="content-card">
              <h2 className="card-section-heading">Campus Infrastructure & Facilities</h2>
              <div className="facilities-grid">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="facility-pill-item">
                    <span className="facility-check-circle">✓</span>
                    <span className="facility-name-text">{fac}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="tab-pane-content">
            <article className="content-card">
              <h2 className="card-section-heading">Academic Programs & Seat Matrix</h2>
              <div className="table-responsive-wrapper">
                <table className="courses-data-table">
                  <thead>
                    <tr>
                      <th>Course & Branch</th>
                      <th>Level</th>
                      <th>Duration</th>
                      <th>Intake Capacity</th>
                      <th>Annual Tuition</th>
                      <th>Eligibility Criteria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesOffered.map((item, idx) => (
                      <tr key={idx}>
                        <td className="course-name-cell">
                          <strong>{item.courseName}</strong>
                        </td>
                        <td>
                          <span className="table-level-badge">{item.courseLevel || 'UG'}</span>
                        </td>
                        <td>{item.duration || '4 Years'}</td>
                        <td className="seats-cell">{item.seats ? `${item.seats} Seats` : 'Available'}</td>
                        <td className="fee-cell">
                          {item.annualFee ? `₹${Number(item.annualFee).toLocaleString()}` : 'Government Regulated'}
                        </td>
                        <td className="eligibility-cell">
                          {item.eligibility || 'Higher Secondary (10+2) with prescribed cut-off'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="tab-pane-content">
            <article className="content-card">
              <h2 className="card-section-heading">Campus Photo Tour</h2>
              <div className="gallery-main-viewer">
                <img src={currentPhotoPreview} alt="Campus view" />
              </div>
              <div className="gallery-thumbnail-strip">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${currentPhotoPreview === imgUrl ? 'active' : ''}`}
                    onClick={() => setSelectedPhoto(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </article>
          </div>
        )}
      </main>
    </div>
  );
}