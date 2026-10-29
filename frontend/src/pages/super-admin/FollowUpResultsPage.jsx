import React, { useState } from 'react';
import './FollowUpResults.css';

export default function FollowUpResultsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTelecaller, setSelectedTelecaller] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Backend API nunchi data varum varai empty list
  const followups = [];

  return (
    <div className="fr-container">
      {/* Title & Path */}
      <div>
        <h1 className="fr-title">Follow-up Results</h1>
        <p className="fr-breadcrumb">Admission Panel / Super Admin / Follow-up Results</p>
      </div>

      {/* 4 Cards (Zero / Empty state) */}
      <div className="fr-metrics-grid">
        <div className="fr-metric-card">
          <div>
            <p className="fr-metric-label">Total Follow-ups</p>
            <h3 className="fr-metric-val">0</h3>
          </div>
          <div className="fr-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="fr-metric-card">
          <div>
            <p className="fr-metric-label">Converted</p>
            <div className="fr-metric-val">
              <span style={{ color: '#10b981' }}>0</span>
              <span className="fr-metric-sub">(0.0%)</span>
            </div>
          </div>
          <div className="fr-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="fr-metric-card">
          <div>
            <p className="fr-metric-label">In Follow-up</p>
            <div className="fr-metric-val">
              <span style={{ color: '#f59e0b' }}>0</span>
              <span className="fr-metric-sub">(0.0%)</span>
            </div>
          </div>
          <div className="fr-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="fr-metric-card">
          <div>
            <p className="fr-metric-label">Not Interested</p>
            <div className="fr-metric-val">
              <span style={{ color: '#ef4444' }}>0</span>
              <span className="fr-metric-sub">(0.0%)</span>
            </div>
          </div>
          <div className="fr-metric-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row matching Screenshot */}
      <div className="fr-filter-card">
        <div className="fr-search-box">
          <svg className="fr-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, mobile number or lead ID..."
            className="fr-search-input"
          />
        </div>

        <div className="fr-filter-group">
          <span className="fr-filter-label">Telecaller</span>
          <select
            value={selectedTelecaller}
            onChange={(e) => setSelectedTelecaller(e.target.value)}
            className="fr-select"
          >
            <option value="All">All</option>
          </select>
        </div>

        <div className="fr-filter-group">
          <span className="fr-filter-label">Follow-up Status</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="fr-select"
          >
            <option value="All">All</option>
            <option value="Interested">Interested</option>
            <option value="In Follow-up">In Follow-up</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>

        <button type="button" className="fr-date-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>01 Oct 2026 - 17 Oct 2026</span>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button type="button" className="fr-btn-apply">Apply</button>
          <button type="button" className="fr-btn-reset">Reset</button>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="fr-table-card">
        <div className="fr-table-header">
          <div className="fr-table-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Follow-up Results</span>
          </div>
          <button type="button" className="fr-export-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <table className="fr-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>S.No</th>
              <th>Lead ID</th>
              <th>Student Name</th>
              <th>Mobile Number</th>
              <th>Assigned To</th>
              <th>Last Follow-up</th>
              <th>Next Follow-up</th>
              <th>Status</th>
              <th>Remarks</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {followups.length > 0 ? (
              followups.map((f, index) => (
                <tr key={f.id || index}>
                  <td style={{ paddingLeft: '24px' }}>{index + 1}</td>
                  <td>{f.leadId}</td>
                  <td>{f.student}</td>
                  <td>{f.mobile}</td>
                  <td>{f.assignedTo}</td>
                  <td>{f.lastFollow}</td>
                  <td>{f.nextFollow}</td>
                  <td>{f.status}</td>
                  <td>{f.remarks}</td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <button style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">
                  <div className="fr-empty-box">
                    <div className="fr-empty-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <p className="fr-empty-title">No follow-up results recorded yet</p>
                    <p className="fr-empty-sub">
                      Follow-up progression and student feedback logs will appear here once connected to the backend API.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="fr-pagination">
          <span>Showing 0 to 0 of 0 follow-ups</span>
        </div>
      </div>
    </div>
  );
}