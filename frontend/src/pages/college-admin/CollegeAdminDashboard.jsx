import React, { useState } from 'react';
import './CollegeAdminDashboard.css';

// Variables from "college-admin.txt" & Screenshot 7
const COLLEGE_PROFILE = {
  collegeName: 'ABC Engineering College',
  collegeCode: 'ABC-ENG-001',
  establishedYear: 2004,
  institutionType: 'Autonomous',
  affiliatedUniversity: 'Anna University',
  approvedBy: 'AICTE, New Delhi',
  city: 'Salem',
  state: 'Tamil Nadu',
  shortDescription: 'Premier autonomous technical institution offering industry-driven engineering & technology programs.',
  totalStudents: 4500,
  facultyCount: 280,
  totalDepartments: 12,
  placementSupport: '98% Placement Assistance',
};

const MOCK_LEADS = [
  { personal_id: 'AP-1001', student_name: 'Arun Kumar', course_name: 'B.E. Computer Science and Engineering', tenth_percentage: 85, twelfth_percentage: 88, status: 'Pending', applicationDate: '15 Oct 2026' },
  { personal_id: 'AP-1003', student_name: 'Vignesh R', course_name: 'B.E. Electronics & Communication', tenth_percentage: 92, twelfth_percentage: 90, status: 'Approved', applicationDate: '14 Oct 2026' },
  { personal_id: 'AP-1004', student_name: 'Kavya M', course_name: 'B.E. Artificial Intelligence & Data Science', tenth_percentage: 88, twelfth_percentage: 91, status: 'Under Review', applicationDate: '14 Oct 2026' },
  { personal_id: 'AP-1008', student_name: 'Hari Prasath', course_name: 'B.Tech Information Technology', tenth_percentage: 90, twelfth_percentage: 93, status: 'Approved', applicationDate: '13 Oct 2026' },
  { personal_id: 'AP-1012', student_name: 'Sneha P', course_name: 'B.E. Electrical & Electronics', tenth_percentage: 91, twelfth_percentage: 94, status: 'Approved', applicationDate: '12 Oct 2026' },
];

export default function CollegeAdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('c-dashboard');
  const [college] = useState(COLLEGE_PROFILE);
  const [leads] = useState(MOCK_LEADS);

  const menuItems = [
    { id: 'c-dashboard', label: 'Dashboard' },
    { id: 'c-leads', label: 'All Applications' },
    { id: 'c-profile', label: 'College Profile' },
    { id: 'c-departments', label: 'Departments & Seats' },
    { id: 'c-members', label: 'Member Accounts' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved': return 'approved';
      case 'Under Review': return 'review';
      default: return 'pending';
    }
  };

  const totalLeads = leads.length;
  const pendingCount = leads.filter((l) => l.status === 'Pending').length;
  const approvedCount = leads.filter((l) => l.status === 'Approved').length;

  return (
    <div className="cad-container">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="cad-sidebar">
        <div>
          <div className="cad-sidebar-header">
            <div className="cad-logo-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="cad-sidebar-title">College Admin</h2>
              <p className="cad-sidebar-sub">{college.collegeName}</p>
            </div>
          </div>

          <p className="cad-menu-label">MAIN NAVIGATION</p>
          <nav className="cad-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`cad-nav-btn ${activeMenu === item.id ? 'active' : ''}`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="cad-role-card">
          <p className="cad-role-title">College Admin Desk</p>
          <p className="cad-role-desc">
            Authorized management controller for {college.collegeCode} applications and course quota.
          </p>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="cad-main">
        {/* Top Header */}
        <header className="cad-header">
          <div className="cad-preview-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
            <span>Portal Preview Active</span>
          </div>

          <div className="cad-profile-pill">
            <div className="cad-profile-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1 }}>Ramesh Kumar</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>College Administrator</p>
            </div>
          </div>

          <button type="button" onClick={onLogout} className="cad-logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* Workspace Body */}
        <main className="cad-body">
          {activeMenu === 'c-dashboard' && (
            <>
              <div>
                <h1 className="cad-title">College Admin Dashboard</h1>
                <p className="cad-breadcrumb">Admission Panel / College Admin / Overview</p>
              </div>

              {/* College Highlights Card (Section 1 & 2 Variables) */}
              <div className="cad-college-banner">
                <div>
                  <span className="cad-badge-code">{college.collegeCode}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                    {college.collegeName} ({college.institutionType})
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Estd. {college.establishedYear} • {college.affiliatedUniversity} • {college.approvedBy} • {college.city}, {college.state}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: 0 }}>STUDENTS</p>
                    <p style={{ fontSize: '14px', fontWeight: 900, color: '#0066ff', margin: '2px 0 0 0' }}>{college.totalStudents}+</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: 0 }}>FACULTY</p>
                    <p style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>{college.facultyCount}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', margin: 0 }}>DEPARTMENTS</p>
                    <p style={{ fontSize: '14px', fontWeight: 900, color: '#10b981', margin: '2px 0 0 0' }}>{college.totalDepartments}</p>
                  </div>
                </div>
              </div>

              {/* 3 Metric Stat Cards (Screenshot 7) */}
              <div className="cad-stats-grid">
                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Total Allocated Leads</p>
                    <h3 className="cad-stat-val" style={{ color: '#0066ff' }}>{totalLeads}</h3>
                  </div>
                  <div className="cad-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Pending Verification</p>
                    <h3 className="cad-stat-val" style={{ color: '#f59e0b' }}>{pendingCount}</h3>
                  </div>
                  <div className="cad-stat-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                </div>

                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Confirmed Admissions</p>
                    <h3 className="cad-stat-val" style={{ color: '#10b981' }}>{approvedCount}</h3>
                  </div>
                  <div className="cad-stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Student Privacy Notice (Screenshot 7 & Requirement Rule) */}
              <div className="cad-privacy-callout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4 className="cad-privacy-title">Student Privacy Protection Policy Active</h4>
                  <p className="cad-privacy-desc">
                    Personal contact numbers are masked for candidate security. Institutional verification is conducted via Personal ID tokens.
                  </p>
                </div>
              </div>

              {/* Recent Assigned Student Applications Table */}
              <div className="cad-table-card">
                <div className="cad-table-header">
                  <div>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Assigned Student Candidates
                    </h2>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Showing latest candidates assigned to {college.collegeCode}
                    </p>
                  </div>
                </div>

                <table className="cad-table">
                  <thead>
                    <tr>
                      <th>Personal ID</th>
                      <th>Candidate Name</th>
                      <th>Applied Engineering Stream</th>
                      <th>10th / 12th (%)</th>
                      <th>Application Date</th>
                      <th>Admission Status</th>
                      <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((item) => (
                      <tr key={item.personal_id}>
                        <td style={{ fontWeight: 800, color: '#0f172a' }}>{item.personal_id}</td>
                        <td style={{ fontWeight: 700, color: '#1e293b' }}>{item.student_name}</td>
                        <td style={{ fontWeight: 600, color: '#0066ff' }}>{item.course_name}</td>
                        <td>{item.tenth_percentage}% / {item.twelfth_percentage}%</td>
                        <td style={{ color: '#64748b' }}>{item.applicationDate}</td>
                        <td>
                          <span className={`cad-badge ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                          <button
                            type="button"
                            onClick={() => alert(`Opening student profile for ${item.student_name} (${item.personal_id})...`)}
                            className="cad-view-btn"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="16" x2="12" y2="12" />
                              <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>View ID</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeMenu !== 'c-dashboard' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontSize: '18px', textTransform: 'capitalize', margin: 0 }}>
                {activeMenu.replace('c-', '').replace('-', ' ')}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                This section is ready for institutional API sync. Click <strong>Dashboard</strong> to return.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}