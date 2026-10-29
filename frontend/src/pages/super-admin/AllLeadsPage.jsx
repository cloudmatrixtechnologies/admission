import React, { useState } from 'react';
import './AllLeads.css';

export default function AllLeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Backend nunchi data vache varaku empty list
  const leads = [];

  return (
    <div className="al-container">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="al-header-title">All Leads</h1>
        <p className="al-header-sub">Admission Panel / Super Admin / All Leads</p>
      </div>

      {/* 4 Metric Cards (Empty / Zero state) */}
      <div className="al-metrics-grid">
        <div className="al-metric-card">
          <div>
            <p className="al-metric-label">Total Leads</p>
            <h3 className="al-metric-val">0</h3>
          </div>
          <div className="al-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="al-metric-card">
          <div>
            <p className="al-metric-label">New Leads</p>
            <h3 className="al-metric-val">0</h3>
          </div>
          <div className="al-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </div>
        </div>

        <div className="al-metric-card">
          <div>
            <p className="al-metric-label">In Progress</p>
            <h3 className="al-metric-val">0</h3>
          </div>
          <div className="al-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="al-metric-card">
          <div>
            <p className="al-metric-label">Converted</p>
            <h3 className="al-metric-val">0</h3>
          </div>
          <div className="al-metric-icon" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="al-filter-bar">
        <div className="al-search-box">
          <svg className="al-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or Personal ID..."
            className="al-search-input"
          />
        </div>

        <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)} className="al-select">
          <option>All Colleges</option>
        </select>

        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="al-select">
          <option>All Courses</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="al-select">
          <option>All Status</option>
        </select>

        <button type="button" className="al-date-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>Select Date Range</span>
        </button>
      </div>

      {/* Leads Table Container with Empty Placeholder */}
      <div className="al-table-card">
        <table className="al-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>Personal ID</th>
              <th>Student Name</th>
              <th>Selected College</th>
              <th>Course</th>
              <th>10th (%)</th>
              <th>12th (%)</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ paddingLeft: '24px', fontWeight: 'bold' }}>{lead.id}</td>
                  <td>{lead.name}</td>
                  <td>{lead.college}</td>
                  <td>{lead.course}</td>
                  <td>{lead.tenth}</td>
                  <td>{lead.twelfth}</td>
                  <td>{lead.status}</td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <button style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="al-empty-box">
                    <div className="al-empty-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                    </div>
                    <p className="al-empty-title">No leads recorded yet</p>
                    <p className="al-empty-desc">
                      Incoming student intake leads will appear here once connected to backend APIs.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="al-pagination">
          <span>Showing 0 to 0 of 0 leads</span>
          <div className="al-page-nav">
            <button className="al-page-btn" disabled>Prev</button>
            <button className="al-page-btn active">1</button>
            <button className="al-page-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}