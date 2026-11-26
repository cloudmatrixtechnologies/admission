import React, { useState } from 'react';
import './RejectedReRequestPage.css';

export default function RejectedReRequestPage({
  rejectedLeads = [],
  onBackToLeads,
  onReRequestStudent,
  onViewStudent,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRejected = rejectedLeads.filter(
    (item) =>
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interestedCoursePrimary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rrp-container">
      {/* Top Back Bar */}
      <div className="rrp-top-bar">
        <button type="button" onClick={onBackToLeads} className="rrp-back-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Leads</span>
        </button>
      </div>

      {/* Header & Search */}
      <div className="rrp-header-row">
        <div>
          <h1 className="rrp-title">Leads — Re-request</h1>
          <p className="rrp-subtitle">Manage and review rejected student applications</p>
        </div>

        <div className="rrp-search-box">
          <svg
            className="rrp-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Student ID..."
            className="rrp-search-input"
          />
        </div>
      </div>

      {/* Re-request Table Matching Image */}
      <div className="rrp-table-card">
        <div className="rrp-table-scroll">
          <table className="rrp-table">
            <thead>
              <tr>
                <th className="first">#</th>
                <th>Student ID</th>
                <th>10th Marks</th>
                <th>12th Marks</th>
                <th>Interested Courses</th>
                <th className="center">Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRejected.length > 0 ? (
                filteredRejected.map((row, idx) => (
                  <tr key={row.studentId}>
                    <td className="first">{idx + 1}</td>
                    <td className="id-cell">{row.studentId}</td>
                    <td>
                      <div className="rrp-mark-main">{row.total10}</div>
                      <div className="rrp-mark-sub">({row.percentage10}%)</div>
                    </td>
                    <td>
                      <div className="rrp-mark-main">{row.total12}</div>
                      <div className="rrp-mark-sub">({row.percentage12}%)</div>
                    </td>
                    <td className="rrp-course-text">
                      {row.allInterestedCourses.join(', ')}
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        onClick={() => onReRequestStudent(row.studentId)}
                        className={`rrp-btn-rerequest ${row.reRequested ? 'done' : ''}`}
                      >
                        {row.reRequested ? 'Re-requested' : 'Re-request'}
                      </button>
                    </td>
                    <td className="right">
                      <button
                        type="button"
                        onClick={() => onViewStudent(row)}
                        className="rrp-btn-view"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No rejected applications available for re-request.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}