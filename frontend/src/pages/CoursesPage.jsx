// src/pages/CoursesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import WishlistAuthModal from '../components/auth/WishlistAuthModal';
import './CoursesPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const CATEGORY_TABS = [
  { id: 'All Courses', label: 'All Courses', icon: '📚', color: '#2563eb' },
  { id: 'UG', label: 'UG', icon: '🎓', color: '#10b981' },
  { id: 'PG', label: 'PG', icon: '🏛️', color: '#ef4444' },
  { id: 'Engineering', label: 'Engineering', icon: '⚙️', color: '#2563eb' },
  { id: 'Arts & Science', label: 'Arts & Science', icon: '📖', color: '#7c3aed' },
  { id: 'Diploma', label: 'Diploma', icon: '📜', color: '#0d9488' },
  { id: 'ITI', label: 'ITI', icon: '🛠️', color: '#f59e0b' },
  { id: 'Medical', label: 'Medical', icon: '🩺', color: '#e11d48' },
];

const DEFAULT_COURSES = [
  {
    id: 'course-01',
    courseName: 'B.E. Computer Science and Engineering',
    courseCode: 'CSE-101',
    level: 'UG',
    duration: '4 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry & Mathematics (Min. 50% aggregate)',
    annualFee: '₹65,000 – ₹1,25,000 / yr',
    offeredColleges: 142,
    careerScope: 'Software Engineer, Data Scientist, Cloud Architect, AI Developer',
    overview: 'Comprehensive undergraduate engineering program covering algorithms, operating systems, cloud computing, databases, and full-stack software development.',
  },
  {
    id: 'course-02',
    courseName: 'B.E. Mechanical Engineering',
    courseCode: 'MECH-102',
    level: 'UG',
    duration: '4 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry & Mathematics or Diploma Lateral Entry',
    annualFee: '₹55,000 – ₹95,000 / yr',
    offeredColleges: 118,
    careerScope: 'Design Engineer, CAD/CAM Specialist, Automotive & Manufacturing Lead',
    overview: 'Core mechanical engineering curriculum focusing on thermodynamics, fluid mechanics, robotics, manufacturing processes, and industrial automation.',
  },
  {
    id: 'course-03',
    courseName: 'B.Sc. Biotechnology',
    courseCode: 'BSC-BIO',
    level: 'UG',
    duration: '3 Years',
    stream: 'Arts & Science',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Biology / Botany & Zoology / Chemistry (Min. 50%)',
    annualFee: '₹35,000 – ₹65,000 / yr',
    offeredColleges: 76,
    careerScope: 'Clinical Research Associate, Microbiologist, Quality Control Analyst',
    overview: 'Laboratory-intensive life sciences degree combining molecular biology, genetics, bioinformatics, and pharmaceutical bioprocessing.',
  },
  {
    id: 'course-04',
    courseName: 'B.E. Electronics & Communication',
    courseCode: 'ECE-104',
    level: 'UG',
    duration: '4 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry & Mathematics',
    annualFee: '₹60,000 – ₹1,10,000 / yr',
    offeredColleges: 130,
    careerScope: 'VLSI Design Engineer, Embedded Systems Developer, Telecom Specialist',
    overview: 'Focuses on analog and digital circuits, microprocessors, wireless communication, IoT hardware, and semiconductor design.',
  },
  {
    id: 'course-05',
    courseName: 'B.E. Civil Engineering',
    courseCode: 'CIV-105',
    level: 'UG',
    duration: '4 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry & Mathematics',
    annualFee: '₹50,000 – ₹90,000 / yr',
    offeredColleges: 105,
    careerScope: 'Structural Engineer, Site Project Manager, Urban Infrastructure Planner',
    overview: 'Covers structural analysis, geotechnical engineering, transportation systems, surveying, and sustainable construction management.',
  },
  {
    id: 'course-06',
    courseName: 'B.Sc. Nursing',
    courseCode: 'NUR-201',
    level: 'UG',
    duration: '4 Years',
    stream: 'Medical',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry, Biology & English (Min. 45%)',
    annualFee: '₹75,000 – ₹1,40,000 / yr',
    offeredColleges: 48,
    careerScope: 'Registered Staff Nurse, Critical Care Specialist, Nursing Educator',
    overview: 'Clinical healthcare degree with hospital rotations in medical-surgical nursing, pediatrics, community health, and emergency care.',
  },
  {
    id: 'course-07',
    courseName: 'B.Tech Information Technology',
    courseCode: 'IT-107',
    level: 'UG',
    duration: '4 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with PCM or Diploma Lateral Entry',
    annualFee: '₹60,000 – ₹1,15,000 / yr',
    offeredColleges: 112,
    careerScope: 'Full-Stack Developer, DevOps Engineer, Cybersecurity Analyst',
    overview: 'Industry-oriented IT degree emphasizing enterprise web architectures, network security, cloud infrastructure, and data analytics.',
  },
  {
    id: 'course-08',
    courseName: 'B.Sc. Computer Science',
    courseCode: 'BSC-CS',
    level: 'UG',
    duration: '3 Years',
    stream: 'Arts & Science',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Mathematics / Business Math / Computer Science',
    annualFee: '₹28,000 – ₹55,000 / yr',
    offeredColleges: 94,
    careerScope: 'Software Developer, System Administrator, QA Automation Engineer',
    overview: 'Three-year undergraduate science program focused on programming foundations, database management, web technologies, and software testing.',
  },
  {
    id: 'course-09',
    courseName: 'B.Com (General & Computer Applications)',
    courseCode: 'BCOM-CA',
    level: 'UG',
    duration: '3 Years',
    stream: 'Arts & Science',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Commerce / Accountancy / Economics / Mathematics',
    annualFee: '₹24,000 – ₹50,000 / yr',
    offeredColleges: 115,
    careerScope: 'Chartered Accountant Track, Tax Consultant, Financial Analyst',
    overview: 'Blends corporate accounting, taxation, business law, and banking with ERP and computerized accounting applications.',
  },
  {
    id: 'course-10',
    courseName: 'M.E. Computer Science and Engineering',
    courseCode: 'ME-CSE',
    level: 'PG',
    duration: '2 Years',
    stream: 'Engineering',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    eligibility: 'B.E. / B.Tech in CSE or IT with valid TANCET / GATE score',
    annualFee: '₹70,000 – ₹1,20,000 / yr',
    offeredColleges: 54,
    careerScope: 'AI Research Engineer, Principal Architect, Assistant Professor',
    overview: 'Postgraduate specialization in distributed systems, deep learning, advanced algorithms, and high-performance computing.',
  },
  {
    id: 'course-11',
    courseName: 'Master of Business Administration (MBA)',
    courseCode: 'MBA-301',
    level: 'PG',
    duration: '2 Years',
    stream: 'Arts & Science',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    eligibility: 'Any Recognized Bachelor Degree (Min. 50%) + TANCET / MAT',
    annualFee: '₹65,000 – ₹1,50,000 / yr',
    offeredColleges: 88,
    careerScope: 'Product Manager, Finance Manager, HR Business Partner, Operations Lead',
    overview: 'Postgraduate management degree offering dual specializations in Finance, Marketing, Human Resources, and Business Analytics.',
  },
  {
    id: 'course-12',
    courseName: 'Master of Computer Applications (MCA)',
    courseCode: 'MCA-302',
    level: 'PG',
    duration: '2 Years',
    stream: 'Arts & Science',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
    eligibility: 'BCA / B.Sc. CS / Any Degree with Mathematics at 10+2 or UG level',
    annualFee: '₹55,000 – ₹1,05,000 / yr',
    offeredColleges: 79,
    careerScope: 'Enterprise Software Developer, Cloud Consultant, Solution Architect',
    overview: 'Advanced postgraduate application development program focusing on full-stack engineering, mobile apps, and AI integration.',
  },
  {
    id: 'course-13',
    courseName: 'Diploma in Mechanical Engineering',
    courseCode: 'DIP-MECH',
    level: 'Diploma',
    duration: '3 Years',
    stream: 'Diploma',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80',
    eligibility: '10th Standard Pass (SSLC) with Mathematics & Science',
    annualFee: '₹14,000 – ₹32,000 / yr',
    offeredColleges: 82,
    careerScope: 'Junior Engineer, CNC Programmer, Quality Control Supervisor',
    overview: 'Polytechnic diploma providing hands-on workshop training, CAD drafting, machine tools, and direct 2nd-year B.E. lateral entry eligibility.',
  },
  {
    id: 'course-14',
    courseName: 'Diploma in Electrical & Electronics (DEEE)',
    courseCode: 'DIP-EEE',
    level: 'Diploma',
    duration: '3 Years',
    stream: 'Diploma',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    eligibility: '10th Standard Pass (SSLC)',
    annualFee: '₹14,000 – ₹30,000 / yr',
    offeredColleges: 74,
    careerScope: 'Electrical Supervisor, Substation Technician, Industrial Maintenance',
    overview: 'Practical polytechnic program in electrical machines, power systems, PLC automation, and domestic/industrial wiring.',
  },
  {
    id: 'course-15',
    courseName: 'ITI Electrician Trade (NCVT)',
    courseCode: 'ITI-ELEC',
    level: 'ITI',
    duration: '2 Years',
    stream: 'ITI',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
    eligibility: '10th Standard Pass (SSLC) with Science & Mathematics',
    annualFee: '₹8,000 – ₹18,000 / yr',
    offeredColleges: 64,
    careerScope: 'Certified Electrician, Panel Board Technician, PSU & TNEB Apprentice',
    overview: 'NCVT-certified trade program specializing in electrical installation, motor winding, transformer maintenance, and safety compliance.',
  },
  {
    id: 'course-16',
    courseName: 'B.Pharm (Bachelor of Pharmacy)',
    courseCode: 'PHM-204',
    level: 'UG',
    duration: '4 Years',
    stream: 'Medical',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80',
    eligibility: '10+2 with Physics, Chemistry & Biology / Mathematics (Min. 50%)',
    annualFee: '₹70,000 – ₹1,30,000 / yr',
    offeredColleges: 52,
    careerScope: 'Clinical Pharmacist, Drug Inspector, Pharmaceutical Formulation Scientist',
    overview: 'PCI-approved undergraduate pharmacy degree covering pharmaceutics, pharmacology, medicinal chemistry, and clinical drug safety.',
  },
];

export default function CoursesPage({ onWishlistUpdate }) {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('stream') || searchParams.get('level') || 'All Courses';

  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [activeCategory, setActiveCategory] = useState(
    CATEGORY_TABS.some((t) => t.id === initialTab) ? initialTab : 'All Courses'
  );
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [savedCourseIds, setSavedCourseIds] = useState([]);

  // Wishlist Auth Interception State (mirrors CollegesPage.jsx)
  const [pendingCourse, setPendingCourse] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pendingWishlistCourse');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isWishlistAuthOpen, setIsWishlistAuthOpen] = useState(false);

  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // Silent backend fetch with fallback to the 16 DEFAULT_COURSES
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/courses`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted || !payload) return;
        const list = Array.isArray(payload) ? payload : payload.data;
        if (Array.isArray(list) && list.length >= 15) {
          setCourses(list);
        }
      })
      .catch(() => {
        // Keep DEFAULT_COURSES when backend endpoint is offline
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync saved courses from admizan_wishlist / admizan_saved_courses on mount
  useEffect(() => {
    try {
      const rawWishlist = localStorage.getItem('admizan_wishlist');
      const savedWishlist = rawWishlist ? JSON.parse(rawWishlist) : [];
      const wishlistCourseIds = savedWishlist
        .filter((item) => item.itemType === 'course' || item.courseName)
        .map((item) => item.courseId || item.id);

      const rawSavedCourses = localStorage.getItem('admizan_saved_courses');
      const legacySaved = rawSavedCourses ? JSON.parse(rawSavedCourses) : [];

      const mergedIds = Array.from(new Set([...wishlistCourseIds, ...legacySaved]));
      setSavedCourseIds(mergedIds);

      if (onWishlistUpdate) {
        onWishlistUpdate(savedWishlist.length);
      }
    } catch (e) {
      console.error(e);
    }
  }, [onWishlistUpdate]);

  // Commits course add/remove to admizan_wishlist & admizan_saved_courses
  const commitCourseWishlistToggle = (courseId, forceAdd = false) => {
    let currentWishlist = [];
    try {
      const raw = localStorage.getItem('admizan_wishlist');
      currentWishlist = raw ? JSON.parse(raw) : [];
    } catch {
      currentWishlist = [];
    }

    const isAlreadySaved = currentWishlist.some(
      (item) => (item.courseId || item.id) === courseId
    );

    let updatedWishlist;
    if (isAlreadySaved && !forceAdd) {
      updatedWishlist = currentWishlist.filter(
        (item) => (item.courseId || item.id) !== courseId
      );
    } else if (!isAlreadySaved) {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (targetCourse) {
        updatedWishlist = [
          ...currentWishlist,
          {
            ...targetCourse,
            itemType: 'course',
            courseId: targetCourse.id,
            isWishlisted: true,
            savedAt: new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          },
        ];
      } else {
        updatedWishlist = currentWishlist;
      }
    } else {
      updatedWishlist = currentWishlist;
    }

    const updatedCourseIds = updatedWishlist
      .filter((item) => item.itemType === 'course' || item.courseName)
      .map((item) => item.courseId || item.id);

    try {
      localStorage.setItem('admizan_wishlist', JSON.stringify(updatedWishlist));
      localStorage.setItem('admizan_saved_courses', JSON.stringify(updatedCourseIds));
    } catch (e) {
      console.error(e);
    }

    setSavedCourseIds(updatedCourseIds);

    if (onWishlistUpdate) {
      onWishlistUpdate(updatedWishlist.length);
    }
  };

  // Heart Click Interception: opens WishlistAuthModal if student is not yet signed in/registered
  const handleToggleWishlist = (courseId) => {
    const isAuthenticatedOrRegistered = Boolean(
      localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('admizan_student_session')
    );

    const isAlreadySaved = savedCourseIds.includes(courseId);

    if (!isAuthenticatedOrRegistered && !isAlreadySaved) {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (targetCourse) {
        try {
          sessionStorage.setItem(
            'pendingWishlistCourse',
            JSON.stringify(targetCourse)
          );
        } catch {
          // Ignore storage quota errors
        }
        setPendingCourse(targetCourse);
        setIsWishlistAuthOpen(true);
      }
      return;
    }

    commitCourseWishlistToggle(courseId);
  };

  // Triggered automatically once OTP + Registration completes in WishlistAuthModal
  const handleWishlistRegistrationComplete = ({
    college,
    registrationResponse,
    studentSummary,
  }) => {
    try {
      sessionStorage.removeItem('pendingWishlistCourse');
      sessionStorage.removeItem('pendingWishlistCollege');
      localStorage.setItem(
        'admizan_student_session',
        JSON.stringify({
          isRegistered: true,
          fullName: studentSummary?.fullName || 'Student',
          accountType: registrationResponse?.accountType || 'parentOnly',
          registeredAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors
    }

    const targetCourseId = pendingCourse?.id || college?.courseId || college?.id;
    setPendingCourse(null);
    if (targetCourseId) {
      commitCourseWishlistToggle(targetCourseId, true);
    }
  };

  const filteredCourses = useMemo(() => {
    if (activeCategory === 'All Courses') return courses;
    if (activeCategory === 'UG' || activeCategory === 'PG') {
      return courses.filter((c) => c.level === activeCategory);
    }
    return courses.filter(
      (c) => c.stream === activeCategory || c.level === activeCategory
    );
  }, [courses, activeCategory]);

  const displayedCourses = showAllCourses
    ? filteredCourses
    : filteredCourses.slice(0, 6);

  return (
    <div className="courses-page-wrapper">
      {/* Hero Banner */}
      <section className="courses-hero-section">
        <div className="courses-hero-card">
          <div className="courses-hero-content">
            <h1 className="courses-hero-title">
              Explore <span className="courses-hero-highlight">Courses</span>
            </h1>
            <p className="courses-hero-subtitle">
              Discover UG, PG, Engineering, Arts &amp; Science,
              <br />
              Diploma, ITI and Medical courses.
            </p>
          </div>
          <div className="courses-hero-visual" aria-hidden="true" />
        </div>
      </section>

      {/* 8-Pill Category Strip */}
      <section className="courses-category-strip">
        <div className="courses-category-grid">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`course-cat-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setShowAllCourses(true);
                }}
              >
                <span
                  className="course-cat-icon"
                  style={{ color: tab.color }}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
                <span className="course-cat-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Courses Section */}
      <section className="courses-catalog-section">
        <div className="courses-section-header">
          <div className="courses-section-title-group">
            <h2 className="courses-section-heading">
              {activeCategory === 'All Courses'
                ? 'Top Courses'
                : `${activeCategory} Courses`}
            </h2>
            <span className="courses-count-pill">
              {filteredCourses.length} Courses Available
            </span>
          </div>

          {filteredCourses.length > 6 && (
            <button
              type="button"
              className="courses-view-all-link"
              onClick={() => setShowAllCourses((prev) => !prev)}
            >
              {showAllCourses ? 'Show Top 6 ↑' : `View All (${filteredCourses.length}) →`}
            </button>
          )}
        </div>

        <div className="courses-cards-grid">
          {displayedCourses.map((course) => {
            const isSaved = savedCourseIds.includes(course.id);
            return (
              <article key={course.id} className="course-card-item">
                <div className="course-card-thumb-wrap">
                  <img
                    src={course.image}
                    alt={course.courseName}
                    className="course-card-thumb"
                    loading="lazy"
                  />
                </div>

                <div className="course-card-body">
                  <div className="course-card-top-row">
                    <h3 className="course-card-name">{course.courseName}</h3>
                    <button
                      type="button"
                      className={`course-heart-btn ${isSaved ? 'saved' : ''}`}
                      onClick={() => handleToggleWishlist(course.id)}
                      aria-label={isSaved ? 'Remove from saved courses' : 'Save course'}
                      title={isSaved ? 'Saved' : 'Save Course'}
                    >
                      {isSaved ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="course-meta-row">
                    <span className="course-meta-chip">🎓 {course.level}</span>
                    <span className="course-meta-divider">|</span>
                    <span className="course-meta-chip">⏳ {course.duration}</span>
                    <span className="course-meta-divider">|</span>
                    <span className="course-meta-chip">📊 {course.stream}</span>
                  </div>

                  <div className="course-card-actions">
                    <Link
                      to={`/colleges?course=${encodeURIComponent(course.courseName)}`}
                      className="btn-course-view-colleges"
                    >
                      View Colleges
                    </Link>
                    <button
                      type="button"
                      className="btn-course-details"
                      onClick={() => setSelectedCourseModal(course)}
                    >
                      Course Details →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Course Details Modal */}
      {selectedCourseModal && (
        <div
          className="course-detail-overlay"
          onClick={() => setSelectedCourseModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="course-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="course-detail-close"
              onClick={() => setSelectedCourseModal(null)}
              aria-label="Close course details"
            >
              ✕
            </button>

            <div className="course-detail-header">
              <img
                src={selectedCourseModal.image}
                alt={selectedCourseModal.courseName}
                className="course-detail-banner-img"
              />
              <div>
                <div className="course-detail-badges">
                  <span className="course-detail-badge">{selectedCourseModal.level}</span>
                  <span className="course-detail-badge">{selectedCourseModal.stream}</span>
                  <span className="course-detail-badge">{selectedCourseModal.duration}</span>
                  <span className="course-detail-code">{selectedCourseModal.courseCode}</span>
                </div>
                <h2 className="course-detail-title">{selectedCourseModal.courseName}</h2>
              </div>
            </div>

            <p className="course-detail-overview">{selectedCourseModal.overview}</p>

            <div className="course-detail-specs">
              <div className="course-spec-box">
                <span className="spec-box-label">ELIGIBILITY</span>
                <p className="spec-box-val">{selectedCourseModal.eligibility}</p>
              </div>
              <div className="course-spec-box">
                <span className="spec-box-label">ESTIMATED ANNUAL FEE</span>
                <p className="spec-box-val">{selectedCourseModal.annualFee}</p>
              </div>
              <div className="course-spec-box">
                <span className="spec-box-label">CAREER OPPORTUNITIES</span>
                <p className="spec-box-val">{selectedCourseModal.careerScope}</p>
              </div>
              <div className="course-spec-box">
                <span className="spec-box-label">OFFERING INSTITUTIONS</span>
                <p className="spec-box-val">
                  {selectedCourseModal.offeredColleges}+ Affiliated Colleges
                </p>
              </div>
            </div>

            <div className="course-detail-footer">
              <button
                type="button"
                className="btn-course-modal-secondary"
                onClick={() => setSelectedCourseModal(null)}
              >
                Close
              </button>
              <Link
                to={`/colleges?course=${encodeURIComponent(selectedCourseModal.courseName)}`}
                className="btn-course-modal-primary"
                onClick={() => setSelectedCourseModal(null)}
              >
                Explore Offering Colleges →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist OTP & Registration Interception Modal */}
      <WishlistAuthModal
        isOpen={isWishlistAuthOpen}
        onClose={() => setIsWishlistAuthOpen(false)}
        pendingCollege={pendingCourse}
        onRegistrationComplete={handleWishlistRegistrationComplete}
      />
    </div>
  );
}