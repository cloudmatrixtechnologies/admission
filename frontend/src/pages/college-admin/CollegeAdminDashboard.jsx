import React, { useState } from 'react';
import './CollegeAdminDashboard.css';
import CollegeLeadsPage from './CollegeLeadsPage';
import AddCollegePage from './AddCollegePage';
import MemberAccountsPage from './MemberAccountsPage';

const COLLEGE_PROFILE = {
  collegeName: 'AVS Engineering College',
  collegeCode: 'ABC-ENG-001',
  establishedYear: 2004,
  institutionType: 'Autonomous',
  affiliatedUniversity: 'Anna University',
  approvedBy: 'AICTE, New Delhi',
  city: 'Salem',
  state: 'Tamil Nadu',
  shortDescription:
    'Premier autonomous technical institution offering industry-driven engineering & technology programs.',
  totalStudents: 4500,
  facultyCount: 280,
  totalDepartments: 12,
  placementSupport: '98% Placement Assistance',
};

const MOCK_LEADS = [
  {
    personal_id: 'AP-1001',
    student_name: 'Arun Kumar',
    course_name: 'B.E. Computer Science and Engineering',
    tenth_percentage: 85,
    twelfth_percentage: 88,
    status: 'Pending',
    applicationDate: '15 Oct 2026',
  },
  {
    personal_id: 'AP-1003',
    student_name: 'Vignesh R',
    course_name: 'B.E. Electronics & Communication',
    tenth_percentage: 92,
    twelfth_percentage: 90,
    status: 'Approved',
    applicationDate: '14 Oct 2026',
  },
  {
    personal_id: 'AP-1004',
    student_name: 'Kavya M',
    course_name: 'B.E. Artificial Intelligence & Data Science',
    tenth_percentage: 88,
    twelfth_percentage: 91,
    status: 'Under Review',
    applicationDate: '14 Oct 2026',
  },
  {
    personal_id: 'AP-1008',
    student_name: 'Hari Prasath',
    course_name: 'B.Tech Information Technology',
    tenth_percentage: 90,
    twelfth_percentage: 93,
    status: 'Approved',
    applicationDate: '13 Oct 2026',
  },
  {
    personal_id: 'AP-1012',
    student_name: 'Sneha P',
    course_name: 'B.E. Electrical & Electronics',
    tenth_percentage: 91,
    twelfth_percentage: 94,
    status: 'Approved',
    applicationDate: '12 Oct 2026',
  },
];

export default function CollegeAdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('c-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [college] = useState(COLLEGE_PROFILE);
  const [leads] = useState(MOCK_LEADS);

  const menuItems = [
    { id: 'c-dashboard', label: 'Dashboard' },
    { id: 'c-leads', label: 'Leads' },
    { id: 'c-add-college', label: 'Add College' },
    { id: 'c-members', label: 'Member Accounts' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Under Review':
        return 'review';
      default:
        return 'pending';
    }
  };

  const totalLeads = leads.length;
  const pendingCount = leads.filter((l) => l.status === 'Pending').length;
  const approvedCount = leads.filter((l) => l.status === 'Approved').length;

  return (
    <div className="cad-container">
      {sidebarOpen && (
        <div className="cad-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`cad-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="cad-sidebar-header">
            <div className="cad-sidebar-brand">
              <div className="cad-logo-badge">
                <img src="/brand_logo.png" alt="Admizon Logo" className="cad-logo-img" />
              </div>
              <div>
                <h2 className="cad-sidebar-title">College Admin</h2>
                <p className="cad-sidebar-sub">{college.collegeName}</p>
              </div>
            </div>

            <button
              type="button"
              className="cad-drawer-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          </div>

          <p className="cad-menu-label">MAIN NAVIGATION</p>
          <nav className="cad-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
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

      <div className="cad-main">
        <header className="cad-header">
          <button
            type="button"
            className="cad-hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="cad-header-actions">
            <div className="cad-preview-pill">
              <span>Portal Preview Active</span>
            </div>

            <div className="cad-profile-pill">
              <div className="cad-profile-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="cad-profile-info">
                <p className="cad-profile-name">Ramesh Kumar</p>
                <p className="cad-profile-role">College Administrator</p>
              </div>
            </div>

            <button type="button" onClick={onLogout} className="cad-logout-btn">
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="cad-body">
          {activeMenu === 'c-dashboard' && (
            <>
              <div>
                <h1 className="cad-title">College Admin Dashboard</h1>
                <p className="cad-breadcrumb">Admission Panel / College Admin / Overview</p>
              </div>

              <div className="cad-college-banner">
                <div className="cad-banner-left">
                  <span className="cad-badge-code">{college.collegeCode}</span>
                  <h3 className="cad-banner-heading">
                    {college.collegeName} ({college.institutionType})
                  </h3>
                  <p className="cad-banner-sub">
                    Estd. {college.establishedYear} • {college.affiliatedUniversity} •{' '}
                    {college.approvedBy} • {college.city}, {college.state}
                  </p>
                </div>

                <div className="cad-banner-metrics">
                  <div className="cad-banner-metric-item">
                    <p className="cad-banner-metric-lbl">STUDENTS</p>
                    <p className="cad-banner-metric-val blue">{college.totalStudents}+</p>
                  </div>
                  <div className="cad-banner-metric-item">
                    <p className="cad-banner-metric-lbl">FACULTY</p>
                    <p className="cad-banner-metric-val dark">{college.facultyCount}</p>
                  </div>
                  <div className="cad-banner-metric-item">
                    <p className="cad-banner-metric-lbl">DEPARTMENTS</p>
                    <p className="cad-banner-metric-val green">{college.totalDepartments}</p>
                  </div>
                </div>
              </div>

              <div className="cad-stats-grid">
                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Total Allocated Leads</p>
                    <h3 className="cad-stat-val blue">{totalLeads}</h3>
                  </div>
                  <div className="cad-stat-icon blue">👥</div>
                </div>

                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Pending Verification</p>
                    <h3 className="cad-stat-val amber">{pendingCount}</h3>
                  </div>
                  <div className="cad-stat-icon amber">!</div>
                </div>

                <div className="cad-stat-card">
                  <div>
                    <p className="cad-stat-label">Confirmed Admissions</p>
                    <h3 className="cad-stat-val green">{approvedCount}</h3>
                  </div>
                  <div className="cad-stat-icon green">✓</div>
                </div>
              </div>

              <div className="cad-privacy-callout">
                <div>
                  <h4 className="cad-privacy-title">Student Privacy Protection Policy Active</h4>
                  <p className="cad-privacy-desc">
                    Personal contact numbers are masked for candidate security. Institutional
                    verification is conducted via Personal ID tokens.
                  </p>
                </div>
              </div>

              <div className="cad-table-card">
                <div className="cad-table-header">
                  <div>
                    <h2 className="cad-table-title">Assigned Student Candidates</h2>
                    <p className="cad-table-sub">
                      Showing latest candidates assigned to {college.collegeCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('c-leads')}
                    className="cad-view-btn"
                  >
                    <span>View Leads</span>
                  </button>
                </div>

                <div className="cad-table-scroll">
                  <table className="cad-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Personal ID</th>
                        <th>Candidate Name</th>
                        <th>Applied Engineering Stream</th>
                        <th>10th / 12th (%)</th>
                        <th>Application Date</th>
                        <th>Admission Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((item) => (
                        <tr key={item.personal_id}>
                          <td>
                            <button
                              type="button"
                              onClick={() => setActiveMenu('c-leads')}
                              className="cad-view-btn"
                            >
                              <span>View ID</span>
                            </button>
                          </td>
                          <td className="cad-td-id">{item.personal_id}</td>
                          <td className="cad-td-name">{item.student_name}</td>
                          <td className="cad-td-course">{item.course_name}</td>
                          <td>
                            {item.tenth_percentage}% / {item.twelfth_percentage}%
                          </td>
                          <td className="cad-td-date">{item.applicationDate}</td>
                          <td>
                            <span className={`cad-badge ${getStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'c-leads' && <CollegeLeadsPage />}

          {activeMenu === 'c-add-college' && <AddCollegePage />}

          {activeMenu === 'c-members' && <MemberAccountsPage />}

          {activeMenu !== 'c-dashboard' &&
            activeMenu !== 'c-leads' &&
            activeMenu !== 'c-add-college' &&
            activeMenu !== 'c-members' && (
              <div className="cad-fallback-card">
                <h2 className="cad-fallback-title">
                  {activeMenu.replace('c-', '').replace('-', ' ')}
                </h2>
                <p className="cad-fallback-desc">
                  This section is ready. Click <strong>Dashboard</strong> to return.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}