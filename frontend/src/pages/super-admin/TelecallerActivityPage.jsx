import React, { useState } from 'react';
import './TelecallerActivity.css';

export default function TelecallerActivityPage() {
  const [selectedTelecaller, setSelectedTelecaller] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Backend API nunchi data vache varaku empty list
  const telecallers = [];

  return (
    <div className="ta-container">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="ta-title">Telecaller Activity</h1>
        <p className="ta-breadcrumb">Admission Panel / Super Admin / Telecaller Activity</p>
      </div>

      {/* 4 Stat Cards (Zero/Empty state) */}
      <div className="ta-metrics-grid">
        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Total Telecallers</p>
            <h3 className="ta-metric-val">0</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Assigned Leads</p>
            <h3 className="ta-metric-val">0</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Completed Calls</p>
            <h3 className="ta-metric-val">0</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Pending Follow-ups</p>
            <h3 className="ta-metric-val">0</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="ta-filter-card">
        <div className="ta-filter-group">
          <span className="ta-filter-label">Telecaller</span>
          <select
            value={selectedTelecaller}
            onChange={(e) => setSelectedTelecaller(e.target.value)}
            className="ta-select"
          >
            <option value="All">All</option>
          </select>
        </div>

        <div className="ta-filter-group">
          <span className="ta-filter-label">Status</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="ta-select"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="ta-filter-group">
          <span className="ta-filter-label">Date Range</span>
          <button type="button" className="ta-date-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>01 Oct 2026 - 17 Oct 2026</span>
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button type="button" className="ta-btn-apply">
            Apply
          </button>
          <button type="button" className="ta-btn-reset">
            Reset
          </button>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="ta-table-card">
        <div className="ta-table-header">
          <div className="ta-table-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Telecaller Performance</span>
          </div>
          <button type="button" className="ta-export-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <table className="ta-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>S.No</th>
              <th>Telecaller Name</th>
              <th style={{ textAlign: 'center' }}>Assigned Leads</th>
              <th style={{ textAlign: 'center' }}>Completed Calls</th>
              <th style={{ textAlign: 'center' }}>Pending</th>
              <th style={{ textAlign: 'center' }}>Follow-up Today</th>
              <th style={{ textAlign: 'center' }}>Conversion</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {telecallers.length > 0 ? (
              telecallers.map((t, index) => (
                <tr key={t.id || index}>
                  <td style={{ paddingLeft: '24px' }}>{index + 1}</td>
                  <td style={{ fontWeight: 700 }}>{t.name}</td>
                  <td style={{ textAlign: 'center' }}>{t.assigned}</td>
                  <td style={{ textAlign: 'center' }}>{t.completed}</td>
                  <td style={{ textAlign: 'center' }}>{t.pending}</td>
                  <td style={{ textAlign: 'center' }}>{t.today}</td>
                  <td style={{ textAlign: 'center' }}>{t.conversion}</td>
                  <td>{t.status}</td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <button style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">
                  <div className="ta-empty-box">
                    <div className="ta-empty-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="ta-empty-title">No telecaller activity recorded yet</p>
                    <p className="ta-empty-desc">
                      Telecaller performance logs and call statistics will appear here once connected to the backend API.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="ta-pagination">
          <span>Showing 0 to 0 of 0 telecallers</span>
        </div>
      </div>
    </div>
  );
}