import React, { useState, useEffect } from 'react';
import './ManagerDashboard.css';
import CreateTelecallerPage from './CreateTelecallerPage';
import ManageTelecallersPage from './ManageTelecallersPage';

// Manager Admin Initial Mock Data matching Source 7 & 9
const MOCK_METRICS = {
  totalTelecallers: 8,
  assignedLeads: 448,
  followupsToday: 36,
  callsCompleted: 286,
};

const MOCK_RECENT_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', tenth: 85, twelfth: 88, status: 'Pending', assignedTo: 'Keerthana' },
  { id: 'AP-1002', name: 'Priya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: 78, twelfth: 82, status: 'In Progress', assignedTo: 'Manikandan' },
  { id: 'AP-1003', name: 'Vignesh R', college: 'LMN Engineering College', course: 'B.E. ECE', tenth: 92, twelfth: 90, status: 'Accepted', assignedTo: 'Divya' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', tenth: 88, twelfth: 91, status: 'Pending', assignedTo: 'Suresh' },
  { id: 'AP-1005', name: 'Dinesh K', college: 'PQR Polytechnic College', course: 'Diploma (ME)', tenth: 80, twelfth: 84, status: 'Rejected', assignedTo: 'Hari' },
];

const MOCK_TELECALLERS_ACTIVITY = [
  { name: 'Keerthana', assigned: 80, completed: 62, pending: 18, status: 'Active' },
  { name: 'Manikandan', assigned: 72, completed: 54, pending: 18, status: 'Active' },
  { name: 'Divya', assigned: 64, completed: 48, pending: 16, status: 'Active' },
  { name: 'Suresh', assigned: 58, completed: 41, pending: 17, status: 'Inactive' },
  { name: 'Hari', assigned: 52, completed: 36, pending: 16, status: 'Active' },
];

const MOCK_FOLLOWUP_SUMMARY = [
  { label: 'Follow-ups Today', count: 36, bg: '#dbeafe', color: '#1d4ed8' },
  { label: 'Completed', count: 24, bg: '#dcfce7', color: '#15803d' },
  { label: 'Pending', count: 12, bg: '#fef3c7', color: '#b45309' },
  { label: 'Call Later', count: 8, bg: '#f3e8ff', color: '#7e22ce' },
  { label: 'Not Interested', count: 6, bg: '#fee2e2', color: '#b91c1c' },
];

export default function ManagerDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('m-dashboard');
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [leads, setLeads] = useState(MOCK_RECENT_LEADS);
  const [telecallers, setTelecallers] = useState(MOCK_TELECALLERS_ACTIVITY);

  const menuItems = [
    { id: 'm-dashboard', label: 'Dashboard' },
    { id: 'm-create-telecaller', label: 'Create Telecaller' },
    { id: 'm-manage-telecallers', label: 'Manage Telecallers' },
    { id: 'm-all-leads', label: 'All Leads' },
    { id: 'm-assign-leads', label: 'Assign Leads' },
    { id: 'm-follow-ups', label: 'Follow-ups' },
    { id: 'm-call-activity', label: 'Call Activity' },
    { id: 'm-reports', label: 'Reports' },
  ];

  // =========================================================================
  // BACKEND API INTEGRATION (Auto-connects when Shreya/Dilep API is ready)
  // =========================================================================
  useEffect(() => {
    const fetchManagerDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/manager/dashboard-summary');
        if (res.ok) {
          const data = await res.json();
          if (data.metrics) setMetrics(data.metrics);
          if (Array.isArray(data.recentLeads)) setLeads(data.recentLeads);
          if (Array.isArray(data.telecallers)) setTelecallers(data.telecallers);
        }
      } catch (err) {
        // Fallback gracefully to mock data
        console.warn('Backend not reachable, serving initial mock data.');
      }
    };
    fetchManagerDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'in-progress';
      case 'Accepted':
      case 'Converted':
        return 'accepted';
      case 'Rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  return (
    <div className="md-container">
      {/* ================= LEFT SIDEBAR (EXACT BLUE GRADIENT) ================= */}
      <aside className="md-sidebar">
        <div>
          <div className="md-sidebar-header">
            <div className="md-logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="md-sidebar-title">Admission Panel</h2>
              <p className="md-sidebar-sub">Manager Admin[cite: 7]</p>
            </div>
          </div>

          <p className="md-menu-label">MAIN MENU</p>
          <nav className="md-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`md-nav-btn ${activeMenu === item.id ? 'active' : ''}`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="md-role-card">
          <p className="md-role-title">Manager Admin Access</p>
          <p className="md-role-desc">Central operational controller to allocate leads and manage telecallers[cite: 7].</p>
        </div>
      </aside>

      {/* ================= RIGHT WORKSPACE ================= */}
      <div className="md-main">
        {/* Top Header */}
        <header className="md-header">
          <div className="md-date-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', lineHeight: 1, margin: 0 }}>CURRENT DATE</p>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#334155', marginTop: '2px', margin: 0 }}>17 October 2026</p>
            </div>
          </div>

          <div className="md-profile-pill">
            <div className="md-profile-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', lineHeight: 1, margin: 0 }}>Manager Admin</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Operations Head</p>
            </div>
          </div>

          <button type="button" onClick={onLogout} className="md-logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* Dynamic Body */}
        <main className="md-body">
          {/* VIEW 1: DASHBOARD */}
          {activeMenu === 'm-dashboard' && (
            <>
              <div>
                <h1 className="md-title">Dashboard</h1>
                <p className="md-breadcrumb">Admission Panel / Manager Admin / Dashboard</p>
              </div>

              {/* Top 4 Metrics (Exact counts matching Source 7 & 9) */}
              <div className="md-metrics-grid">
                <div className="md-metric-card">
                  <div>
                    <p className="md-metric-label">Total Telecallers</p>
                    <h3 className="md-metric-val">{metrics.totalTelecallers}</h3>
                  </div>
                  <div className="md-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>

                <div className="md-metric-card">
                  <div>
                    <p className="md-metric-label">Assigned Leads</p>
                    <h3 className="md-metric-val">{metrics.assignedLeads}</h3>
                  </div>
                  <div className="md-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>

                <div className="md-metric-card">
                  <div>
                    <p className="md-metric-label">Follow-ups Today</p>
                    <h3 className="md-metric-val">{metrics.followupsToday}</h3>
                  </div>
                  <div className="md-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>

                <div className="md-metric-card">
                  <div>
                    <p className="md-metric-label">Calls Completed</p>
                    <h3 className="md-metric-val">{metrics.callsCompleted}</h3>
                  </div>
                  <div className="md-metric-icon" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2-Column Balanced Dashboard Layout */}
              <div className="md-dashboard-layout">
                {/* Left Side: Recent Leads Table */}
                <div className="md-card">
                  <div className="md-card-header">
                    <h2 className="md-card-title">Recent Leads</h2>
                    <button type="button" onClick={() => setActiveMenu('m-all-leads')} className="md-card-action">
                      View All &gt;
                    </button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="md-table">
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: '24px' }}>Lead ID</th>
                          <th>Student Name</th>
                          <th>College</th>
                          <th>Course</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id}>
                            <td style={{ paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{lead.id}</td>
                            <td style={{ fontWeight: 700 }}>{lead.name}</td>
                            <td style={{ color: '#64748b' }}>{lead.college}</td>
                            <td style={{ fontWeight: 600 }}>{lead.course}</td>
                            <td>
                              <span className={`md-badge ${getStatusClass(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                              <button
                                type="button"
                                onClick={() => setActiveMenu('m-assign-leads')}
                                className="md-assign-btn"
                              >
                                Assign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: Telecaller Activity & Follow-up Summary Stacked */}
                <div className="md-side-stack">
                  {/* Telecaller Activity Card */}
                  <div className="md-card">
                    <div className="md-card-header">
                      <h2 className="md-card-title">Telecaller Activity</h2>
                      <button type="button" onClick={() => setActiveMenu('m-manage-telecallers')} className="md-card-action">
                        View All &gt;
                      </button>
                    </div>
                    <table className="md-table">
                      <thead>
                        <tr>
                          <th style={{ paddingLeft: '20px' }}>Name</th>
                          <th style={{ textAlign: 'center' }}>Assigned</th>
                          <th style={{ textAlign: 'center' }}>Done</th>
                          <th style={{ textAlign: 'right', paddingRight: '20px' }}>Pending</th>
                        </tr>
                      </thead>
                      <tbody>
                        {telecallers.slice(0, 5).map((t, idx) => (
                          <tr key={idx}>
                            <td style={{ paddingLeft: '20px', fontWeight: 700, color: '#0f172a' }}>{t.name}</td>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{t.assigned}</td>
                            <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 800 }}>{t.completed}</td>
                            <td style={{ textAlign: 'right', paddingRight: '20px', color: '#ea580c', fontWeight: 800 }}>{t.pending}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Follow-up Summary Card */}
                  <div className="md-card">
                    <div className="md-card-header">
                      <h2 className="md-card-title">Follow-up Summary</h2>
                    </div>
                    <div className="md-summary-list">
                      {MOCK_FOLLOWUP_SUMMARY.map((item, i) => (
                        <div key={i} className="md-summary-row">
                          <span>{item.label}</span>
                          <span
                            className="md-summary-count"
                            style={{ backgroundColor: item.bg, color: item.color }}
                          >
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: CREATE TELECALLER */}
          {activeMenu === 'm-create-telecaller' && <CreateTelecallerPage />}

          {/* VIEW 3: MANAGE TELECALLERS (IMPORTED & CONNECTED) */}
          {activeMenu === 'm-manage-telecallers' && (
            <ManageTelecallersPage
              onNavigateCreate={() => setActiveMenu('m-create-telecaller')}
            />
          )}

          {/* OTHER SUB-VIEWS */}
          {activeMenu !== 'm-dashboard' &&
            activeMenu !== 'm-create-telecaller' &&
            activeMenu !== 'm-manage-telecallers' && (
              <div className="md-card" style={{ padding: '32px' }}>
                <h2 className="md-title" style={{ textTransform: 'capitalize', fontSize: '18px' }}>
                  {activeMenu.replace('m-', '').replace('-', ' ')}
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  This section is ready for backend integration[cite: 7]. Click <strong>Dashboard</strong> or <strong>Manage Telecallers</strong> to return.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}