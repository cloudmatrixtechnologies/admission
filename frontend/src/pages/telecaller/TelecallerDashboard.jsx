import React, { useState } from 'react';

const MOCK_ASSIGNED_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', mobile: '9876543210', status: 'Pending' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', mobile: '9876501234', status: 'Follow-up' },
  { id: 'AP-1006', name: 'Divya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', mobile: '9567812345', status: 'Connected' },
  { id: 'AP-1008', name: 'Hari Prasath', college: 'ABC Engineering College', course: 'B.Tech IT', mobile: '9156784321', status: 'Pending' },
  { id: 'AP-1009', name: 'Keerthana S', college: 'XYZ Arts & Science College', course: 'B.Sc. IT', mobile: '9443218765', status: 'Pending' },
];

const MOCK_TODAY_QUEUE = [
  { student: 'Arun Kumar', time: '10:30 AM', task: 'Follow-up on CSE Fee concession', phone: '9876543210' },
  { student: 'Kavya M', time: '11:45 AM', task: 'Parent consultation call', phone: '9876501234' },
  { student: 'Hari Prasath', time: '02:15 PM', task: 'Send WhatsApp brochure & confirm call', phone: '9156784321' },
  { student: 'Keerthana S', time: '04:00 PM', task: 'Discuss hostel accommodation', phone: '9443218765' },
];

export default function TelecallerDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('t-dashboard');

  const menuItems = [
    { id: 't-dashboard', label: 'My Dashboard' },
    { id: 't-leads', label: 'Assigned Leads' },
    { id: 't-followups', label: 'My Follow-ups' },
    { id: 't-call-history', label: 'Call History' },
  ];

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Connected':
        return { bg: '#dcfce7', color: '#15803d' };
      case 'Follow-up':
        return { bg: '#dbeafe', color: '#1d4ed8' };
      default:
        return { bg: '#fef3c7', color: '#b45309' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f7fd', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', width: '100%' }}>
      {/* ================= EXACT BLUE GRADIENT SIDEBAR ================= */}
      <aside style={{ width: '256px', background: 'linear-gradient(180deg, #0052cc 0%, #005ce6 50%, #0066ff 100%)', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0, boxShadow: '4px 0 20px rgba(0,0,0,0.05)' }}>
        <div>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>Admission Panel</h2>
              <p style={{ fontSize: '11px', color: '#bfdbfe', margin: '2px 0 0 0' }}>Telecaller Workspace</p>
            </div>
          </div>

          <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px', color: 'rgba(191,219,254,0.8)', padding: '16px 20px 8px 20px', margin: 0 }}>MAIN MENU</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeMenu === item.id ? '#ffffff' : '#dbeafe',
                  backgroundColor: activeMenu === item.id ? '#1a73e8' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: activeMenu === item.id ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div style={{ margin: '16px 12px', padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Telecaller Desk</p>
          <p style={{ fontSize: '10px', color: '#bfdbfe', margin: '4px 0 0 0', lineHeight: 1.3 }}>
            Connect with assigned student leads, update notes, and schedule follow-ups.
          </p>
        </div>
      </aside>

      {/* ================= RIGHT MAIN WORKSPACE ================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Header */}
        <header style={{ height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', lineHeight: 1, margin: 0 }}>Keerthana (Telecaller)</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>Admissions Calling Desk</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#ffffff', border: '1.5px solid #fee2e2', color: '#ef4444', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* Body */}
        <main style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {activeMenu === 't-dashboard' && (
            <>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Telecaller Dashboard</h1>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: '4px 0 0 0' }}>Admission Panel / Telecaller / Dashboard</p>
              </div>

              {/* 4 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Assigned Leads</p>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#0066ff', margin: '4px 0 0 0' }}>48</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Calls Done Today</p>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#10b981', margin: '4px 0 0 0' }}>36</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Follow-ups Today</p>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#f59e0b', margin: '4px 0 0 0' }}>12</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Conversions</p>
                    <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#8b5cf6', margin: '4px 0 0 0' }}>8</h3>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 2-Column Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                {/* Left Side: Assigned Leads Queue */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Assigned Leads Queue</h2>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>5 Pending Calls</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Student Name</th>
                        <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>College & Course</th>
                        <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Mobile</th>
                        <th style={{ padding: '12px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Status</th>
                        <th style={{ padding: '12px 18px', textAlign: 'right', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ASSIGNED_LEADS.map((lead) => {
                        const badge = getBadgeStyle(lead.status);
                        return (
                          <tr key={lead.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>{lead.name}</td>
                            <td style={{ padding: '12px 18px' }}>
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.course}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>{lead.college}</div>
                            </td>
                            <td style={{ padding: '12px 18px', fontFamily: 'monospace' }}>{lead.mobile}</td>
                            <td style={{ padding: '12px 18px' }}>
                              <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, backgroundColor: badge.bg, color: badge.color }}>
                                {lead.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => alert(`Calling ${lead.name} (${lead.mobile})... Opening Requirement Capture screen.`)}
                                style={{ padding: '5px 12px', border: 'none', backgroundColor: '#0066ff', color: '#ffffff', borderRadius: '8px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>Dial</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Right Side: Follow-up Queue */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Scheduled Follow-ups for Today</h2>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {MOCK_TODAY_QUEUE.map((item, idx) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '12px', color: '#0f172a' }}>{item.student}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.task}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0066ff', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu !== 't-dashboard' && (
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontSize: '18px', textTransform: 'capitalize', margin: 0 }}>{activeMenu.replace('t-', '').replace('-', ' ')}</h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                This section is ready. Click <strong>My Dashboard</strong> to return.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}