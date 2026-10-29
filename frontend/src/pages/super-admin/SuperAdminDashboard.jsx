import React, { useState } from 'react';
import './SuperAdmin.css';
import AllLeadsPage from './AllLeadsPage';
import AdminAccountsPage from './AdminAccountsPage';
import CreateAdminAccountPage from './CreateAdminAccountPage';
import AdminAccountDetailsPage from './AdminAccountDetailsPage';
import TelecallerActivityPage from './TelecallerActivityPage';
import FollowUpResultsPage from './FollowUpResultsPage';

export default function SuperAdminDashboard({ onLogout }) {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Selected Account for Details View
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Super Admin Sidebar Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'all-leads', label: 'All Leads' },
    { id: 'admin-accounts', label: 'Admin Accounts' },
    { id: 'telecaller-activity', label: 'Telecaller Activity' },
    { id: 'follow-up-results', label: 'Follow-up Results' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="sa-container">
      {/* ================= LEFT SIDEBAR (EXACT BLUE GRADIENT) ================= */}
      <aside className="sa-sidebar">
        <div>
          {/* Logo & Header */}
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

          {/* Navigation Links */}
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

        {/* Bottom Role Info Badge */}
        <div className="sa-role-card">
          <p className="sa-role-title">Super Admin Access</p>
          <p className="sa-role-desc">Full access to view all leads and manage accounts.</p>
        </div>
      </aside>

      {/* ================= RIGHT MAIN WORKSPACE ================= */}
      <div className="sa-main">
        {/* Top Header */}
        <header className="sa-header">
          {/* Current Date Display */}
          <div className="sa-date-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', lineHeight: 1 }}>CURRENT DATE</p>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#334155', marginTop: '2px' }}>17 October 2026</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="sa-profile-pill">
            <div className="sa-profile-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>Super Admin</p>
              <p style={{ fontSize: '10px', color: '#94a3b8' }}>Administrator</p>
            </div>
          </div>

          {/* Logout Action */}
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
          {/* VIEW 1: DASHBOARD OVERVIEW */}
          {activeMenu === 'dashboard' && (
            <>
              <div>
                <h1 className="sa-page-title">Dashboard</h1>
                <p className="sa-page-sub">Admission Panel / Super Admin / Dashboard</p>
              </div>

              {/* 4 Metrics Cards (Empty State Count: 0) */}
              <div className="sa-metrics-grid">
                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Total Leads</p>
                    <h3 className="sa-metric-count">0</h3>
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
                    <h3 className="sa-metric-count">0</h3>
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
                    <h3 className="sa-metric-count">0</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>

                <div className="sa-metric-card">
                  <div>
                    <p className="sa-metric-name">Calls Completed</p>
                    <h3 className="sa-metric-count">0</h3>
                  </div>
                  <div className="sa-metric-icon-box" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Empty Section Cards */}
              <div className="sa-content-grid">
                <div className="sa-card">
                  <div className="sa-card-header">
                    <h2 className="sa-card-title">Recent Leads</h2>
                  </div>
                  <div className="sa-empty-state">
                    <div className="sa-empty-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                    </div>
                    <p className="sa-empty-title">No leads recorded yet</p>
                    <p className="sa-empty-sub">Incoming student intake leads will appear here once connected to backend APIs.</p>
                  </div>
                </div>

                <div className="sa-card">
                  <div className="sa-card-header">
                    <h2 className="sa-card-title">Telecaller Activity</h2>
                  </div>
                  <div className="sa-empty-state">
                    <div className="sa-empty-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                    </div>
                    <p className="sa-empty-title">No telecallers assigned</p>
                    <p className="sa-empty-sub">Staff call activity will reflect here in real-time.</p>
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
                setActiveMenu('account-details'); // Redirects to Account Details Screen
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

           {/* VIEW 7: FollowUpResultsPage */}
          {activeMenu === 'follow-up-results' && <FollowUpResultsPage />}

        
          {/* VIEW 8: OTHER MENU FALLBACKS */}
          {activeMenu !== 'dashboard' &&
            activeMenu !== 'all-leads' &&
            activeMenu !== 'admin-accounts' &&
            activeMenu !== 'create-account' &&
            activeMenu !== 'account-details' &&
            activeMenu !== 'telecaller-activity' && 
            activeMenu === 'follow-up-results' && (
              <div className="sa-card" style={{ padding: '32px' }}>
                <h2 className="sa-card-title" style={{ textTransform: 'capitalize' }}>
                  {activeMenu.replace('-', ' ')}
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  This module is ready for backend integration.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}