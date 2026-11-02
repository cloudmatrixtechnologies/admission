import React, { useState } from 'react';
import './SuperAdmin.css';
import AllLeadsPage from './AllLeadsPage';
import AdminAccountsPage from './AdminAccountsPage';
import CreateAdminAccountPage from './CreateAdminAccountPage';
import AdminAccountDetailsPage from './AdminAccountDetailsPage';
import TelecallerActivityPage from './TelecallerActivityPage';
import FollowUpResultsPage from './FollowUpResultsPage';

// Source 5 Exact Mock Data
const MOCK_METRICS = {
  totalLeads: '1,248',
  adminAccounts: '24',
  pendingFollowups: '36',
  callsCompleted: '892',
};

const MOCK_RECENT_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', tenth: 85, twelfth: 88, status: 'Pending' },
  { id: 'AP-1002', name: 'Priya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: 78, twelfth: 82, status: 'Accepted' },
  { id: 'AP-1003', name: 'Vignesh R', college: 'LMN Engineering College', course: 'B.E. ECE', tenth: 92, twelfth: 90, status: 'Rejected' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', tenth: 88, twelfth: 91, status: 'Pending' },
  { id: 'AP-1005', name: 'Dinesh K', college: 'PQR Polytechnic', course: 'Diploma (ME)', tenth: 80, twelfth: '-', status: 'Pending' },
];

const MOCK_TELECALLERS = [
  { name: 'Keerthana', assigned: 48, completed: 36, pending: 12 },
  { name: 'Manikandan', assigned: 52, completed: 40, pending: 12 },
  { name: 'Divya', assigned: 46, completed: 34, pending: 12 },
  { name: 'Suresh', assigned: 38, completed: 28, pending: 10 },
  { name: 'Hari', assigned: 44, completed: 30, pending: 14 },
];

const MOCK_ADMIN_ACCOUNTS = [
  { name: 'Ramesh Kumar', type: 'College Admin', assigned: 'ABC Engineering College', status: 'Active' },
  { name: 'Priya N', type: 'Consultation Admin', assigned: 'XYZ Educational Consultancy', status: 'Active' },
  { name: 'Karthik S', type: 'College Admin', assigned: 'LMN Engineering College', status: 'Active' },
  { name: 'Anitha R', type: 'Consultation Admin', assigned: 'PQR Educational Consultancy', status: 'Inactive' },
];

const MOCK_FOLLOWUP_SUMMARY = [
  { label: 'Follow-up Today', count: 18, bg: '#dbeafe', color: '#1d4ed8' },
  { label: 'Follow-up This Week', count: 64, bg: '#eff6ff', color: '#2563eb' },
  { label: 'Converted', count: 27, bg: '#dcfce7', color: '#15803d' },
  { label: 'Not Interested', count: 12, bg: '#fee2e2', color: '#b91c1c' },
  { label: 'Call Later', count: 21, bg: '#fef3c7', color: '#b45309' },
];

export default function SuperAdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'all-leads', label: 'All Leads' },
    { id: 'admin-accounts', label: 'Admin Accounts' },
    { id: 'telecaller-activity', label: 'Telecaller Activity' },
    { id: 'follow-up-results', label: 'Follow-up Results' },
    { id: 'reports', label: 'Reports' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return { bg: '#dcfce7', color: '#15803d' };
      case 'Rejected':
        return { bg: '#fee2e2', color: '#b91c1c' };
      case 'Active':
        return { bg: '#ecfdf5', color: '#059669' };
      case 'Inactive':
        return { bg: '#fef2f2', color: '#dc2626' };
      default:
        return { bg: '#fef3c7', color: '#b45309' };
    }
  };

  return (
    <div className="sa-container">
      {/* ================= LEFT SIDEBAR (BLUE GRADIENT) ================= */}
      <aside className="sa-sidebar">
        <div>
          <div className="sa-sidebar-header">
            <div className="sa-logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="sa-sidebar-title">Admission Panel</h2>
              <p className="sa-sidebar-sub">Super Admin</p>
            </div>
          </div>

          <p className="sa-menu-label">MAIN MENU</p>
          <nav className="sa-nav">
            {menuItems.map((item) => {
              const isSelected =
                activeMenu === item.id ||
                (item.id === 'admin-accounts' && (activeMenu === 'create-account' || activeMenu === 'account-details'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  className={`sa-nav-btn ${isSelected ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sa-role-card">
          <p className="sa-role-title">Super Admin Access</p>
          <p className="sa-role-desc">Full access to view all leads and manage accounts.</p>
        </div>
      </aside>

      {/* ================= RIGHT MAIN WORKSPACE ================= */}
      <div className="sa-main">
        {/* Top Header */}
        <header className="sa-header">
          <div className="sa-date-pill">
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

          <div className="sa-profile-pill">
            <div className="sa-profile-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', lineHeight: 1, margin: 0 }}>Super Admin</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Administrator</p>
            </div>
          </div>

          <button type="button" onClick={onLogout} className="sa-logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* Dynamic Main Body Area */}
        <main className="sa-body">
          {/* VIEW 1: DASHBOARD OVERVIEW (Source 5 Exact Design) */}
          {activeMenu === 'dashboard' && (
            <>
              <div>
                <h1 className="sa-page-title">Dashboard</h1>
                <p className="sa-page-sub">Admission Panel / Super Admin / Dashboard</p>
              </div>

              {/* 4 Metric Summary Cards */}
              <div className="sa-metrics-grid">
                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Total Leads</p>
                    <h3 className="sa-metric-count" style={{ color: '#0066ff' }}>{MOCK_METRICS.totalLeads}</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>

                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Admin Accounts</p>
                    <h3 className="sa-metric-count" style={{ color: '#10b981' }}>{MOCK_METRICS.adminAccounts}</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="16 11 18 13 22 9" />
                    </svg>
                  </div>
                </div>

                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Pending Follow-ups</p>
                    <h3 className="sa-metric-count" style={{ color: '#f59e0b' }}>{MOCK_METRICS.pendingFollowups}</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>

                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Calls Completed</p>
                    <h3 className="sa-metric-count" style={{ color: '#8b5cf6' }}>{MOCK_METRICS.callsCompleted}</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2x2 Grid Layout matching Source 5 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginTop: '4px' }}>
                {/* 1. Recent Leads */}
                <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Leads</h2>
                    <button type="button" onClick={() => setActiveMenu('all-leads')} style={{ fontSize: '11px', fontWeight: 700, color: '#0066ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View All &gt;
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 14px' }}>Personal ID</th>
                        <th>Student Name</th>
                        <th>Selected College</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right', paddingRight: '14px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_RECENT_LEADS.map((lead) => {
                        const badge = getStatusBadge(lead.status);
                        return (
                          <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700 }}>{lead.id}</td>
                            <td style={{ fontWeight: 600 }}>{lead.name}</td>
                            <td style={{ color: '#64748b' }}>{lead.college}</td>
                            <td>{lead.course}</td>
                            <td>
                              <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, backgroundColor: badge.bg, color: badge.color }}>
                                {lead.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '14px' }}>
                              <button type="button" onClick={() => setActiveMenu('all-leads')} style={{ padding: '3px 8px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#0066ff', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 2. Telecaller Activity */}
                <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Telecaller Activity</h2>
                    <button type="button" onClick={() => setActiveMenu('telecaller-activity')} style={{ fontSize: '11px', fontWeight: 700, color: '#0066ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View All &gt;
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 14px' }}>Telecaller Name</th>
                        <th style={{ textAlign: 'center' }}>Assigned</th>
                        <th style={{ textAlign: 'center' }}>Completed</th>
                        <th style={{ textAlign: 'right', paddingRight: '14px' }}>Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TELECALLERS.map((t, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 700 }}>{t.name}</td>
                          <td style={{ textAlign: 'center' }}>{t.assigned}</td>
                          <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{t.completed}</td>
                          <td style={{ textAlign: 'right', paddingRight: '14px', color: '#ea580c', fontWeight: 700 }}>{t.pending}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. Admin Accounts Preview */}
                <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Accounts</h2>
                    <button type="button" onClick={() => setActiveMenu('admin-accounts')} style={{ fontSize: '11px', fontWeight: 700, color: '#0066ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View All &gt;
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 14px' }}>Name</th>
                        <th>Account Type</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right', paddingRight: '14px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ADMIN_ACCOUNTS.map((acc, idx) => {
                        const badge = getStatusBadge(acc.status);
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 700 }}>{acc.name}</td>
                            <td>
                              <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, backgroundColor: acc.type === 'College Admin' ? '#eff6ff' : '#faf5ff', color: acc.type === 'College Admin' ? '#0066ff' : '#9333ea' }}>
                                {acc.type}
                              </span>
                            </td>
                            <td style={{ color: '#64748b' }}>{acc.assigned}</td>
                            <td>
                              <span style={{ padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, backgroundColor: badge.bg, color: badge.color }}>
                                {acc.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', paddingRight: '14px' }}>
                              <button type="button" onClick={() => { setSelectedAccount(acc); setActiveMenu('account-details'); }} style={{ padding: '3px 8px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#0066ff', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 4. Follow-up Summary */}
                <div className="sa-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Follow-up Summary</h2>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {MOCK_FOLLOWUP_SUMMARY.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        <span>{item.label}</span>
                        <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: item.bg, color: item.color, fontWeight: 700, fontSize: '11px' }}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: ALL LEADS */}
          {activeMenu === 'all-leads' && <AllLeadsPage />}

          {/* VIEW 3: ADMIN ACCOUNTS LIST */}
          {activeMenu === 'admin-accounts' && (
            <AdminAccountsPage
              setActivePage={(page) => setActiveMenu(page)}
              onViewDetails={(acc) => {
                setSelectedAccount(acc);
                setActiveMenu('account-details');
              }}
            />
          )}

          {/* VIEW 4: CREATE ADMIN ACCOUNT FORM */}
          {activeMenu === 'create-account' && (
            <CreateAdminAccountPage
              onBack={() => setActiveMenu('admin-accounts')}
              onAccountCreated={(newAccount) => {
                setSelectedAccount(newAccount);
                setActiveMenu('account-details');
              }}
            />
          )}

          {/* VIEW 5: ADMIN ACCOUNT DETAILS PAGE */}
          {activeMenu === 'account-details' && (
            <AdminAccountDetailsPage
              account={selectedAccount}
              onBack={() => setActiveMenu('admin-accounts')}
              onEdit={() => setActiveMenu('create-account')}
            />
          )}

          {/* VIEW 6: TELECALLER ACTIVITY */}
          {activeMenu === 'telecaller-activity' && <TelecallerActivityPage />}

          {/* VIEW 7: FOLLOW-UP RESULTS */}
          {activeMenu === 'follow-up-results' && <FollowUpResultsPage />}

          {/* VIEW 8: OTHER MENUS (REPORTS / FALLBACK) */}
          {activeMenu === 'reports' && (
            <div className="sa-card" style={{ padding: '32px' }}>
              <h2 className="sa-card-title">Reports & Analytics</h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                Consolidated admission reports and export features will load here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}