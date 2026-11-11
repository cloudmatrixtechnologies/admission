import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CollegeCoursesPage.css';

// Master institutional catalog dictionary
const COLLEGES_CATALOG = [
  {
    collegeId: 'col_001',
    collegeName: 'Government College of Engineering, Salem',
    collegeCode: 'GCE-1966',
    collegeType: 'Engineering',
    institutionType: 'Government Autonomous',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'Anna University, Chennai',
    accreditations: ['Autonomous', 'AICTE Approved', 'NAAC A+'],
    placementSupport: '94% Placement Rate (Avg CTC ₹6.2 LPA)',
    courses: [
      { id: 'c1', name: 'B.E. Computer Science and Engineering', code: 'CSE-101', level: 'UG', duration: '4 Years', semesters: 8, seats: 120, annualFee: 45000, eligibility: '10+2 with PCM (TNEA Cutoff 185+)', careerScope: 'Cloud Engineer, Software Architect, Data Scientist' },
      { id: 'c2', name: 'B.E. Electronics & Communication Engineering', code: 'ECE-102', level: 'UG', duration: '4 Years', semesters: 8, seats: 120, annualFee: 45000, eligibility: '10+2 with PCM (TNEA Cutoff 180+)', careerScope: 'VLSI Engineer, Embedded Systems Specialist' },
      { id: 'c3', name: 'B.E. Mechanical Engineering', code: 'MECH-103', level: 'UG', duration: '4 Years', semesters: 8, seats: 120, annualFee: 42000, eligibility: '10+2 with PCM or Diploma Lateral Entry', careerScope: 'CAD/CAM Designer, Production Engineer' },
      { id: 'c4', name: 'B.E. Civil Engineering', code: 'CIVIL-104', level: 'UG', duration: '4 Years', semesters: 8, seats: 60, annualFee: 42000, eligibility: '10+2 with PCM', careerScope: 'Structural Engineer, Project Surveyor' },
      { id: 'c5', name: 'B.E. Metallurgical Engineering', code: 'MET-105', level: 'UG', duration: '4 Years', semesters: 8, seats: 60, annualFee: 42000, eligibility: '10+2 with PCM', careerScope: 'Materials Scientist, Quality Analyst, Steel Plant Specialist' },
      { id: 'c6', name: 'M.E. Structural Engineering', code: 'ME-STR-201', level: 'PG', duration: '2 Years', semesters: 4, seats: 25, annualFee: 55000, eligibility: 'B.E. Civil Engineering + TANCET / GATE Score', careerScope: 'Senior Structural Consultant, R&D Researcher' },
      { id: 'c7', name: 'M.E. CAD / CAM', code: 'ME-CAD-202', level: 'PG', duration: '2 Years', semesters: 4, seats: 25, annualFee: 55000, eligibility: 'B.E. Mechanical / Production + TANCET / GATE', careerScope: 'Automation Specialist, Tool Design Specialist' }
    ]
  },
  {
    collegeId: 'col_002',
    collegeName: 'Sona College of Technology',
    collegeCode: 'SONA-1997',
    collegeType: 'Engineering',
    institutionType: 'Private Autonomous',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'Anna University, Chennai',
    accreditations: ['Autonomous', 'NBA Accredited', 'NAAC A'],
    placementSupport: '91% Campus Placements (Top CTC ₹18 LPA)',
    courses: [
      { id: 'c201', name: 'B.E. Computer Science and Engineering', code: 'CS-SONA', level: 'UG', duration: '4 Years', semesters: 8, seats: 180, annualFee: 85000, eligibility: '10+2 PCM with min 50% marks', careerScope: 'Full Stack Developer, DevOps Lead' },
      { id: 'c202', name: 'B.Tech Artificial Intelligence & Data Science', code: 'AIDS-SONA', level: 'UG', duration: '4 Years', semesters: 8, seats: 120, annualFee: 95000, eligibility: '10+2 with Math, Physics, Chemistry', careerScope: 'AI Engineer, Machine Learning Developer' },
      { id: 'c203', name: 'B.Tech Information Technology', code: 'IT-SONA', level: 'UG', duration: '4 Years', semesters: 8, seats: 120, annualFee: 85000, eligibility: '10+2 PCM or Diploma Lateral Entry', careerScope: 'Software Engineer, Cybersecurity Analyst' },
      { id: 'c204', name: 'B.E. Mechatronics Engineering', code: 'MCT-SONA', level: 'UG', duration: '4 Years', semesters: 8, seats: 60, annualFee: 75000, eligibility: '10+2 with Physics, Chemistry & Math', careerScope: 'Robotics Engineer, Industrial Automation Lead' },
      { id: 'c205', name: 'Master of Business Administration (MBA)', code: 'MBA-SONA', level: 'PG', duration: '2 Years', semesters: 4, seats: 120, annualFee: 70000, eligibility: 'Any Bachelor Degree (50%+) + MAT / TANCET', careerScope: 'Business Analyst, Marketing Specialist, HR Manager' }
    ]
  },
  {
    collegeId: 'col_003',
    collegeName: 'Sri Sarada College for Women',
    collegeCode: 'SSCW-1961',
    collegeType: 'Arts & Science',
    institutionType: 'Autonomous',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'Periyar University',
    accreditations: ['Autonomous', 'UGC Recognized', 'NAAC A++'],
    placementSupport: 'Dedicated Career Development & Civil Service Coaching',
    courses: [
      { id: 'c301', name: 'B.Sc. Computer Science', code: 'BSC-CS', level: 'UG', duration: '3 Years', semesters: 6, seats: 60, annualFee: 28000, eligibility: '10+2 with Mathematics / Computer Science', careerScope: 'Software Developer, Web Programmer, IT Consultant' },
      { id: 'c302', name: 'B.Com (General & Computer Applications)', code: 'BCOM-CA', level: 'UG', duration: '3 Years', semesters: 6, seats: 120, annualFee: 26000, eligibility: '10+2 with Commerce / Accountancy', careerScope: 'Financial Analyst, Auditor, Tax Consultant' },
      { id: 'c303', name: 'B.Sc. Mathematics', code: 'BSC-MATH', level: 'UG', duration: '3 Years', semesters: 6, seats: 60, annualFee: 22000, eligibility: '10+2 with Pure Mathematics', careerScope: 'Data Analyst, Actuarial Specialist, Educator' },
      { id: 'c304', name: 'B.A. English Literature', code: 'BA-ENG', level: 'UG', duration: '3 Years', semesters: 6, seats: 60, annualFee: 20000, eligibility: '10+2 Any Stream with min 45%', careerScope: 'Content Strategist, Technical Writer, Media Executive' },
      { id: 'c305', name: 'M.Sc. Data Analytics', code: 'MSC-DATA', level: 'PG', duration: '2 Years', semesters: 4, seats: 30, annualFee: 42000, eligibility: 'B.Sc. in CS / IT / Math / Statistics', careerScope: 'Business Intelligence Developer, Quantitative Analyst' }
    ]
  },
  {
    collegeId: 'col_004',
    collegeName: 'Government Polytechnic College',
    collegeCode: 'GPT-1962',
    collegeType: 'Diploma',
    institutionType: 'Government',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'DOTE Tamil Nadu',
    accreditations: ['Government', 'AICTE Approved', 'DOTE'],
    placementSupport: '88% Placement in Core Manufacturing & Automotive Industries',
    courses: [
      { id: 'c401', name: 'Diploma in Mechanical Engineering', code: 'DIP-MECH', level: 'Diploma', duration: '3 Years', semesters: 6, seats: 120, annualFee: 16000, eligibility: '10th Standard (SSLC) Pass with Science & Math', careerScope: 'Junior Engineer, CNC Programmer, Machine Supervisor' },
      { id: 'c402', name: 'Diploma in Electrical & Electronics Engineering', code: 'DIP-EEE', level: 'Diploma', duration: '3 Years', semesters: 6, seats: 60, annualFee: 16000, eligibility: '10th Standard Pass (SSLC)', careerScope: 'Substation Technician, Electrical Contractor' },
      { id: 'c403', name: 'Diploma in Civil Engineering', code: 'DIP-CIVIL', level: 'Diploma', duration: '3 Years', semesters: 6, seats: 60, annualFee: 14000, eligibility: '10th Standard Pass (SSLC)', careerScope: 'Site Supervisor, Quantity Surveyor, Draftsman' },
      { id: 'c404', name: 'Diploma in Computer Engineering', code: 'DIP-CSE', level: 'Diploma', duration: '3 Years', semesters: 6, seats: 60, annualFee: 18000, eligibility: '10th Standard Pass (SSLC)', careerScope: 'Hardware Specialist, Network Assistant, Junior Web Tech' }
    ]
  },
  {
    collegeId: 'col_005',
    collegeName: 'Government ITI College',
    collegeCode: 'GITI-1978',
    collegeType: 'ITI',
    institutionType: 'Government',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'NCVT / DGT Certified',
    accreditations: ['NCVT Approved', 'Government Certified'],
    placementSupport: 'Apprenticeship placement in Indian Railways, TNEB, and BHEL',
    courses: [
      { id: 'c501', name: 'Electrician Trade (CTS)', code: 'ITI-ELEC', level: 'ITI', duration: '2 Years', semesters: 4, seats: 80, annualFee: 11000, eligibility: '10th Pass with Science and Mathematics', careerScope: 'TNEB Lineman, Licensed Wireman, Industrial Electrician' },
      { id: 'c502', name: 'Fitter Trade', code: 'ITI-FIT', level: 'ITI', duration: '2 Years', semesters: 4, seats: 80, annualFee: 11000, eligibility: '10th Standard Pass (SSLC)', careerScope: 'Bench Fitter, Machine Assembler, Plant Technician' },
      { id: 'c503', name: 'Mechanic Motor Vehicle (MMV)', code: 'ITI-MMV', level: 'ITI', duration: '2 Years', semesters: 4, seats: 40, annualFee: 13000, eligibility: '10th Standard Pass', careerScope: 'Automotive Technician, Service Center Lead' },
      { id: 'c504', name: 'Welder (Gas & Electric)', code: 'ITI-WELD', level: 'ITI', duration: '1 Year', semesters: 2, seats: 40, annualFee: 9500, eligibility: '8th or 10th Standard Pass', careerScope: 'Certified Arc Welder, Fabrication Inspector' }
    ]
  },
  {
    collegeId: 'col_006',
    collegeName: "Vinayaka Mission's Medical College",
    collegeCode: 'VMMC-1995',
    collegeType: 'Medical',
    institutionType: 'Private Deemed University',
    city: 'Salem',
    state: 'Tamil Nadu',
    affiliatedUniversity: 'VMRF Deemed University',
    accreditations: ['NMC Approved', 'NABH Accredited', 'NAAC Accredited'],
    placementSupport: '100% Compulsory Rotatory Medical Internship (CRMI)',
    courses: [
      { id: 'c601', name: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)', code: 'MBBS', level: 'UG', duration: '5.5 Years', semesters: 9, seats: 150, annualFee: 180000, eligibility: '10+2 with PCB (50%) + NEET UG Qualified', careerScope: 'Registered Medical Practitioner, Clinical Resident' },
      { id: 'c602', name: 'MD General Medicine', code: 'MD-MED', level: 'PG', duration: '3 Years', semesters: 6, seats: 20, annualFee: 350000, eligibility: 'MBBS Degree + NEET PG Qualified', careerScope: 'Consultant Physician, Medical Director' },
      { id: 'c603', name: 'MS General Surgery', code: 'MS-SURG', level: 'PG', duration: '3 Years', semesters: 6, seats: 15, annualFee: 350000, eligibility: 'MBBS Degree + NEET PG Qualified', careerScope: 'General Surgeon, Laparoscopic Specialist' },
      { id: 'c604', name: 'B.Sc. Nursing', code: 'BSC-NURS', level: 'UG', duration: '4 Years', semesters: 8, seats: 60, annualFee: 85000, eligibility: '10+2 with Physics, Chemistry, Biology & English', careerScope: 'Critical Care Nurse, Overseas Healthcare Specialist' }
    ]
  }
];

function resolveCollege(id) {
  if (!id) return COLLEGES_CATALOG[0];
  const term = String(id).toLowerCase().trim();
  const found = COLLEGES_CATALOG.find((c) =>
    c.collegeId?.toLowerCase() === term ||
    c.id?.toLowerCase() === term ||
    c._id?.toLowerCase() === term ||
    c.collegeName?.toLowerCase().includes(term)
  );
  return found || COLLEGES_CATALOG[0];
}

export default function CollegeCoursesPage() {
  const { collegeId } = useParams();
  const collegeData = useMemo(() => resolveCollege(collegeId), [collegeId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [collegeId]);

  const courses = collegeData?.courses || [];

  const availableLevels = useMemo(() => {
    const levels = new Set(courses.map((c) => c.level));
    return ['ALL', ...Array.from(levels)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.careerScope && c.careerScope.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLevel = selectedLevel === 'ALL' || c.level === selectedLevel;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'fee-asc') return (a.annualFee || 0) - (b.annualFee || 0);
        if (sortBy === 'fee-desc') return (b.annualFee || 0) - (a.annualFee || 0);
        if (sortBy === 'seats-desc') return (b.seats || 0) - (a.seats || 0);
        return a.name.localeCompare(b.name);
      });
  }, [courses, searchTerm, selectedLevel, sortBy]);

  return (
    <div className="college-courses-wrapper">
      {/* 1. Clean Top Header Bar (Banner removed) */}
      <section className="courses-clean-header">
        <div className="header-inner-container">
          <div className="breadcrumbs-line">
            <Link to="/" className="b-link">Home</Link>
            <span className="b-sep">/</span>
            <Link to="/colleges" className="b-link">Colleges</Link>
            <span className="b-sep">/</span>
            <Link to={`/colleges/${collegeData.collegeId}`} className="b-link">{collegeData.collegeName}</Link>
            <span className="b-sep">/</span>
            <span className="b-curr">Academic Courses</span>
          </div>

          <div className="header-info-strip">
            <div className="header-title-box">
              <h1 className="header-college-heading">{collegeData.collegeName}</h1>
              <div className="header-sub-meta">
                <span className="inst-badge">{collegeData.institutionType || collegeData.collegeType}</span>
                <span className="dot-sep">•</span>
                <span className="count-text">{courses.length} Approved Programs</span>
                <span className="dot-sep">•</span>
                <span className="loc-text">📍 {collegeData.city}, {collegeData.state}</span>
              </div>
            </div>

            <Link to={`/colleges/${collegeData.collegeId}`} className="btn-back-overview">
              ← View Full Profile
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Control Bar */}
      <section className="courses-controls-strip">
        <div className="controls-inner-container">
          <div className="level-filter-pills">
            {availableLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`level-pill-btn ${selectedLevel === lvl ? 'active' : ''}`}
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl === 'ALL' ? 'All Degrees' : `${lvl} Programs`}
                <span className="count-badge">
                  {lvl === 'ALL'
                    ? courses.length
                    : courses.filter((c) => c.level === lvl).length}
                </span>
              </button>
            ))}
          </div>

          <div className="search-and-sort-group">
            <div className="course-search-field">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search branch, degree code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="course-sort-select">
              <label>Sort:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name-asc">Course Name (A-Z)</option>
                <option value="fee-asc">Tuition: Low to High</option>
                <option value="fee-desc">Tuition: High to Low</option>
                <option value="seats-desc">Highest Seats Intake</option>
              </select>
            </div>

            <div className="view-mode-toggle">
              <button
                type="button"
                className={`btn-view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards"
              >
                ⊞
              </button>
              <button
                type="button"
                className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Detailed Table"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catalog Workspace */}
      <main className="courses-main-workspace">
        <div className="workspace-inner-container">
          {filteredCourses.length === 0 ? (
            <div className="courses-empty-alert">
              <h3>No academic programs match your criteria</h3>
              <p>Try clearing your search keyword or switching the degree tier filter.</p>
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('ALL');
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="courses-cards-grid">
              {filteredCourses.map((course) => (
                <div key={course.id} className="course-card-tile">
                  <div className="course-tile-top">
                    <div className="tile-badges">
                      <span className="tier-badge">{course.level}</span>
                      <span className="code-badge">{course.code}</span>
                    </div>
                    <span className="seats-indicator">👥 {course.seats} Seats</span>
                  </div>

                  <h3 className="course-tile-title">{course.name}</h3>

                  <div className="course-meta-tags">
                    <span className="m-tag">⏱ {course.duration}</span>
                    <span className="m-tag">📚 {course.semesters} Semesters</span>
                    <span className="m-tag">🏛 Full-time</span>
                  </div>

                  <div className="course-info-panel eligibility">
                    <span className="panel-title">ELIGIBILITY REQUIREMENTS</span>
                    <p className="panel-content">{course.eligibility}</p>
                  </div>

                  <div className="course-info-panel careers">
                    <span className="panel-title">CAREER OPPORTUNITIES</span>
                    <p className="panel-content">{course.careerScope || 'Corporate and Academic roles'}</p>
                  </div>

                  <div className="course-tile-footer">
                    <div className="fee-stacked">
                      <span className="fee-sub">ANNUAL TUITION</span>
                      <span className="fee-val">₹{course.annualFee ? course.annualFee.toLocaleString() : 'N/A'}</span>
                    </div>

                    <a
                      href="#inquire"
                      className="btn-course-inquire"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Inquiry sent for ${course.name} at ${collegeData.collegeName}`);
                      }}
                    >
                      Enquire Admission
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="courses-table-container">
              <table className="courses-data-table">
                <thead>
                  <tr>
                    <th>Degree & Branch</th>
                    <th>Level</th>
                    <th>Duration</th>
                    <th>Intake</th>
                    <th>Annual Tuition</th>
                    <th>Eligibility Criteria</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c) => (
                    <tr key={c.id}>
                      <td className="col-course-title">
                        <strong>{c.name}</strong>
                        <span className="code-text">{c.code}</span>
                      </td>
                      <td><span className="tier-badge">{c.level}</span></td>
                      <td>{c.duration}</td>
                      <td><strong>{c.seats} Seats</strong></td>
                      <td className="col-fee">₹{c.annualFee?.toLocaleString()}</td>
                      <td className="col-eligibility">{c.eligibility}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-table-inquire"
                          onClick={() => alert(`Inquiry recorded for ${c.name}`)}
                        >
                          Enquire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}