import React, { useState } from 'react';
import './TelecallerDashboard.css';
import TelecallerFollowups from './TelecallerFollowups';
import TelecallerCallHistory from './TelecallerCallHistory'; 

// ---------------------------------------------------------------------
// 1. EMBEDDED TELECALLER ASSIGNED LEADS COMPONENT (No external import)
// ---------------------------------------------------------------------
const MOCK_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', mobile: '9876543210', tenth: 85, twelfth: 88, status: 'Pending', assignedDate: '15 Oct 2026' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', mobile: '9876501234', tenth: 88, twelfth: 91, status: 'Follow-up', assignedDate: '15 Oct 2026' },
  { id: 'AP-1006', name: 'Divya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', mobile: '9567812345', tenth: 86, twelfth: 89, status: 'Connected', assignedDate: '14 Oct 2026' },
  { id: 'AP-1008', name: 'Hari Prasath', college: 'ABC Engineering College', course: 'B.Tech IT', mobile: '9156784321', tenth: 90, twelfth: 93, status: 'Pending', assignedDate: '14 Oct 2026' },
  { id: 'AP-1009', name: 'Keerthana S', college: 'XYZ Arts & Science College', course: 'B.Sc. IT', mobile: '9443218765', tenth: 82, twelfth: 85, status: 'Follow-up', assignedDate: '13 Oct 2026' },
  { id: 'AP-1011', name: 'Surya R', college: 'LMN Engineering College', course: 'B.E. Mechanical', mobile: '9123451122', tenth: 79, twelfth: 81, status: 'Pending', assignedDate: '13 Oct 2026' },
  { id: 'AP-1012', name: 'Sneha P', college: 'ABC Engineering College', course: 'B.E. ECE', mobile: '9988776655', tenth: 91, twelfth: 94, status: 'Connected', assignedDate: '12 Oct 2026' },
];

function TelecallerAssignedLeadsView() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');

  const handleStatusChange = (id) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          let nextStatus = 'Pending';
          if (lead.status === 'Pending') nextStatus = 'Follow-up';
          else if (lead.status === 'Follow-up') nextStatus = 'Connected';
          else if (lead.status === 'Connected') nextStatus = 'Pending';
          return { ...lead, status: nextStatus };
        }
        return lead;
      })
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesCollege = collegeFilter === 'All Colleges' || lead.college === collegeFilter;

    return matchesSearch && matchesStatus && matchesCollege;
  });

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Connected':
        return { backgroundColor: '#dcfce7', color: '#15803d' };
      case 'Follow-up':
        return { backgroundColor: '#dbeafe', color: '#1d4ed8' };
      default:
        return { backgroundColor: '#fef3c7', color: '#b45309' };
    }
  };

  const totalCount = leads.length;
  const pendingCount = leads.filter((l) => l.status === 'Pending').length;
  const followUpCount = leads.filter((l) => l.status === 'Follow-up').length;
  const connectedCount = leads.filter((l) => l.status === 'Connected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>My Assigned Leads</h1>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: '4px 0 0 0' }}>Admission Panel / Telecaller / Assigned Leads</p>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Total Assigned</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#0066ff', margin: '4px 0 0 0' }}>{totalCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Pending Calls</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#f59e0b', margin: '4px 0 0 0' }}>{pendingCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Follow-ups</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#10b981', margin: '4px 0 0 0' }}>{followUpCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Connected / Done</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#8b5cf6', margin: '4px 0 0 0' }}>{connectedCount}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search student name, ID or mobile..."
          style={{ flex: 1, minWidth: '240px', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569', background: '#fff', outline: 'none' }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Connected">Connected</option>
        </select>

        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569', background: '#fff', outline: 'none' }}
        >
          <option value="All Colleges">All Colleges</option>
          <option value="ABC Engineering College">ABC Engineering College</option>
          <option value="XYZ Arts & Science College">XYZ Arts & Science College</option>
          <option value="LMN Engineering College">LMN Engineering College</option>
        </select>

        <button
          type="button"
          onClick={() => { setSearchTerm(''); setStatusFilter('All'); setCollegeFilter('All Colleges'); }}
          style={{ backgroundColor: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '9px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      {/* Leads Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px 18px', paddingLeft: '24px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Lead ID</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Student Name</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>College</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Course</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Marks</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Mobile</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', paddingRight: '24px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => {
              const badge = getBadgeStyle(lead.status);
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '13px 18px', paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{lead.id}</td>
                  <td style={{ padding: '13px 18px', fontWeight: 700, color: '#1e293b' }}>{lead.name}</td>
                  <td style={{ padding: '13px 18px', color: '#64748b' }}>{lead.college}</td>
                  <td style={{ padding: '13px 18px', fontWeight: 600, color: '#334155' }}>{lead.course}</td>
                  <td style={{ padding: '13px 18px', color: '#334155' }}>{lead.tenth}% / {lead.twelfth}%</td>
                  <td style={{ padding: '13px 18px', fontFamily: 'monospace' }}>{lead.mobile}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: badge.backgroundColor, color: badge.color }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 18px', textAlign: 'right', paddingRight: '24px' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Calling ${lead.name} (${lead.mobile})... Opening Requirement Capture.`)}
                      style={{ padding: '5px 12px', border: 'none', backgroundColor: '#0066ff', color: '#ffffff', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Dial
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(lead.id)}
                      style={{ padding: '5px 10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', marginLeft: '6px' }}
                      title="Toggle next status"
                    >
                      Status
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. MAIN TELECALLER DASHBOARD
// ---------------------------------------------------------------------
export default function TelecallerDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('t-dashboard');

  const menuItems = [
    { id: 't-dashboard', label: 'My Dashboard' },
    { id: 't-leads', label: 'Assigned Leads' },
    { id: 't-followups', label: 'My Follow-ups' },
    { id: 't-call-history', label: 'Call History' },
  ];

  return (
    <div className="tc-container">
      {/* Sidebar */}
      <aside className="tc-sidebar">
        <div>
          <div className="tc-sidebar-header">
            <div className="tc-logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="tc-sidebar-title">Admission Panel</h2>
              <p className="tc-sidebar-sub">Telecaller Workspace</p>
            </div>
          </div>

          <p className="tc-menu-label">MAIN MENU</p>
          <nav className="tc-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`tc-nav-btn ${activeMenu === item.id ? 'active' : ''}`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="tc-role-card">
          <p className="tc-role-title">Telecaller Desk</p>
          <p className="tc-role-desc">Connect with assigned student leads, update notes, and schedule follow-ups.</p>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="tc-main">
        <header className="tc-header">
          <div className="tc-date-pill">
            <p className="tc-date-value">17 October 2026</p>
          </div>
          <div className="tc-profile-pill">
            <p className="tc-profile-name">Keerthana (Telecaller)</p>
          </div>
          <button type="button" onClick={onLogout} className="tc-logout-btn">
            <span>Logout</span>
          </button>
        </header>

        <main className="tc-body">
          {/* 1. DASHBOARD VIEW */}
          {activeMenu === 't-dashboard' && (
            <>
              <div>
                <h1 className="tc-title">Telecaller Dashboard</h1>
                <p className="tc-breadcrumb">Admission Panel / Telecaller / Dashboard</p>
              </div>

              <div className="tc-metrics-grid">
                <div className="tc-metric-card">
                  <div>
                    <p className="tc-metric-label">Assigned Leads</p>
                    <h3 className="tc-metric-val blue">48</h3>
                  </div>
                </div>
                <div className="tc-metric-card">
                  <div>
                    <p className="tc-metric-label">Calls Done Today</p>
                    <h3 className="tc-metric-val green">36</h3>
                  </div>
                </div>
                <div className="tc-metric-card">
                  <div>
                    <p className="tc-metric-label">Follow-ups Today</p>
                    <h3 className="tc-metric-val amber">12</h3>
                  </div>
                </div>
                <div className="tc-metric-card">
                  <div>
                    <p className="tc-metric-label">Conversions</p>
                    <h3 className="tc-metric-val purple">8</h3>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveMenu('t-leads')}
                  style={{ padding: '10px 18px', backgroundColor: '#0066ff', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  View All Assigned Leads &gt;
                </button>
              </div>
            </>
          )}

          {/* 2. ASSIGNED LEADS VIEW (TRIGGERED DIRECTLY HERE) */}
          {activeMenu === 't-leads' && <TelecallerAssignedLeadsView />}

          {/* VIEW 3: MY FOLLOW-UPS  */}
          {activeMenu === 't-followups' && <TelecallerFollowups />}

          {/* VIEW 4: CALL HISTORY (ADD THIS LINE) */}
          {activeMenu === 't-call-history' && <TelecallerCallHistory />}

          {/* 3.  FALLBACK */}
          {activeMenu !== 't-dashboard' && 
           activeMenu !== 't-leads' &&
           activeMenu !== 't-followups' &&
           activeMenu !== 't-call-history' &&(
            <div className="tc-fallback-card">
              <h2 className="tc-fallback-title">{activeMenu.replace('t-', '').replace('-', ' ')}</h2>
              <p className="tc-fallback-desc">
                This section is ready. Click <strong>Assigned Leads</strong> or <strong>My Dashboard</strong> to navigate.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}