import React, { useState } from 'react';
import './TelecallerDashboard.css';
import TelecallerAssignedLeads from './TelecallerAssignedLeads';
import TelecallerFollowups from './TelecallerFollowups';
import TelecallerCallHistory from './TelecallerCallHistory';

export default function TelecallerDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('t-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle state

  const menuItems = [
    { id: 't-dashboard', label: 'My Dashboard' },
    { id: 't-leads', label: 'Assigned Leads' },
    { id: 't-followups', label: 'My Follow-ups' },
    { id: 't-call-history', label: 'Call History' },
  ];

  return (
    <div className="tc-container">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="tc-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`tc-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="tc-sidebar-header">
            <div className="tc-logo-badge">
              <img
                src="/brand_logo.png"
                alt="Admizan Logo"
                className="tc-logo-img"
              />
            </div>
            <div>
              <h2 className="tc-sidebar-title">Admizan Panel</h2>
              <p className="tc-sidebar-sub">telecaller workspace</p>
            </div>
          </div>

          <p className="tc-menu-label">MAIN MENU</p>
          <nav className="tc-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
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
          {/* 3-Line Mobile Toggle Button */}
          <button
            type="button"
            className="tc-mobile-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Telecaller Headset Profile Avatar near Logout */}
          <div className="tc-profile-pill">
            <div className="tc-profile-avatar" title="Telecaller Profile">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Headset Band */}
                <path
                  d="M6.2 11.4V10.4C6.2 6.8 8.8 4 12 4C15.2 4 17.8 6.8 17.8 10.4V11.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
                {/* Left & Right Earcups */}
                <rect x="4.8" y="9.1" width="2.4" height="4.4" rx="1.2" />
                <rect x="16.8" y="9.1" width="2.4" height="4.4" rx="1.2" />
                {/* Head */}
                <circle cx="12" cy="10.2" r="3.5" />
                {/* Boom Mic */}
                <path
                  d="M6 13.1C6.5 14.9 8.1 15.9 10.1 16.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect x="9.3" y="15.1" width="2.6" height="1.8" rx="0.9" />
                {/* Suit Shoulders */}
                <path d="M4.5 21C4.5 17.8 7.6 16.4 12 16.4C16.4 16.4 19.5 17.8 19.5 21H4.5Z" />
                {/* White Shirt Collar & Tie */}
                <polygon points="9.6,16.4 12,20.6 14.4,16.4" fill="#ffffff" />
                <polygon points="11.4,16.4 12.6,16.4 12.3,17.4 12.8,20.8 11.2,20.8 11.7,17.4" />
              </svg>
            </div>
            <div>
              <p className="tc-profile-name">Keerthana (Telecaller)</p>
              <p className="tc-profile-role">Admizan Calling Desk</p>
            </div>
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
                <p className="tc-breadcrumb">Admizan Panel / Telecaller / Dashboard</p>
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

          {/* 2. ASSIGNED LEADS VIEW */}
          {activeMenu === 't-leads' && <TelecallerAssignedLeads />}

          {/* 3. MY FOLLOW-UPS */}
          {activeMenu === 't-followups' && <TelecallerFollowups />}

          {/* 4. CALL HISTORY */}
          {activeMenu === 't-call-history' && <TelecallerCallHistory />}

          {/* 5. FALLBACK */}
          {activeMenu !== 't-dashboard' &&
            activeMenu !== 't-leads' &&
            activeMenu !== 't-followups' &&
            activeMenu !== 't-call-history' && (
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