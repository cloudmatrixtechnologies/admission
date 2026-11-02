import React, { useState, useEffect } from 'react';
import './CallActivity.css';

// Initial Mock Call Logs (Matching Source 10 & 14)
const INITIAL_CALL_LOGS = [
  { id: 'CALL-501', studentName: 'Arun Kumar', leadId: 'AP-1001', mobile: '9876543210', telecaller: 'Keerthana', duration: '4m 12s', outcome: 'Follow-up', notes: 'Interested in B.E CSE; asked for fee structure and hostel details', time: 'Today, 11:15 AM' },
  { id: 'CALL-502', studentName: 'Priya S', leadId: 'AP-1002', mobile: '9786543211', telecaller: 'Manikandan', duration: '6m 45s', outcome: 'Connected', notes: 'Parent confirmed admission counseling visit this Friday', time: 'Today, 10:40 AM' },
  { id: 'CALL-503', studentName: 'Vignesh R', leadId: 'AP-1003', mobile: '9123456789', telecaller: 'Divya', duration: '1m 20s', outcome: 'Not Interested', notes: 'Joined Anna University campus; cancelled portal inquiry', time: 'Today, 10:05 AM' },
  { id: 'CALL-504', studentName: 'Kavya M', leadId: 'AP-1004', mobile: '9876501234', telecaller: 'Suresh', duration: '0m 45s', outcome: 'Busy / No Answer', notes: 'Ringing no response; scheduled auto redial in queue', time: 'Today, 09:50 AM' },
  { id: 'CALL-505', studentName: 'Dinesh K', leadId: 'AP-1005', mobile: '9843216780', telecaller: 'Hari', duration: '5m 18s', outcome: 'Connected', notes: 'Diploma Mechanical inquiry; counseling booked', time: 'Yesterday, 04:30 PM' },
  { id: 'CALL-506', studentName: 'Divya S', leadId: 'AP-1006', mobile: '9567812345', telecaller: 'Keerthana', duration: '3m 50s', outcome: 'Follow-up', notes: 'Scholarship percentage requested for 12th cutoff 185', time: 'Yesterday, 03:15 PM' },
  { id: 'CALL-507', studentName: 'Suresh R', leadId: 'AP-1007', mobile: '9023456781', telecaller: 'Manikandan', duration: '0m 30s', outcome: 'Busy / No Answer', notes: 'Switched off; added to evening calling batch', time: 'Yesterday, 02:20 PM' },
  { id: 'CALL-508', studentName: 'Hari Prasath', leadId: 'AP-1008', mobile: '9156784321', telecaller: 'Hari', duration: '7m 10s', outcome: 'Connected', notes: 'Seat locked for B.Tech IT with initial advance token', time: 'Yesterday, 11:30 AM' },
];

export default function CallActivityPage() {
  const [callLogs, setCallLogs] = useState(INITIAL_CALL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [telecallerFilter, setTelecallerFilter] = useState('All Telecallers');
  const [outcomeFilter, setOutcomeFilter] = useState('All Outcomes');

  // =========================================================================
  // BACKEND API INTEGRATION (Auto-connects when endpoint is live)
  // =========================================================================
  useEffect(() => {
    const fetchCallActivity = async () => {
      try {
        const res = await fetch('/api/admin/manager/call-activity');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setCallLogs(data);
        }
      } catch (err) {
        console.warn('Backend call activity endpoint not ready, showing initial mock logs.');
      }
    };
    fetchCallActivity();
  }, []);

  // Filter Logic
  const filteredLogs = callLogs.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesTelecaller =
      telecallerFilter === 'All Telecallers' || item.telecaller === telecallerFilter;

    const matchesOutcome =
      outcomeFilter === 'All Outcomes' || item.outcome === outcomeFilter;

    return matchesSearch && matchesTelecaller && matchesOutcome;
  });

  const getOutcomeClass = (outcome) => {
    switch (outcome) {
      case 'Connected': return 'connected';
      case 'Follow-up': return 'follow-up';
      case 'Not Interested': return 'rejected';
      default: return 'busy';
    }
  };

  return (
    <div className="ca-container">
      {/* Title & Path */}
      <div>
        <h1 className="ca-title">Call Activity</h1>
        <p className="ca-breadcrumb">Admission Panel / Manager Admin / Call Activity</p>
      </div>

      {/* 4 Summary Stat Cards (Matching Source 10 & 14) */}
      <div className="ca-metrics-grid">
        <div className="ca-metric-card">
          <div>
            <p className="ca-metric-label">Total Calls</p>
            <h3 className="ca-metric-val" style={{ color: '#0066ff' }}>892</h3>
          </div>
          <div className="ca-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="ca-metric-card">
          <div>
            <p className="ca-metric-label">Connected</p>
            <h3 className="ca-metric-val" style={{ color: '#10b981' }}>654</h3>
          </div>
          <div className="ca-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="ca-metric-card">
          <div>
            <p className="ca-metric-label">Follow-up Required</p>
            <h3 className="ca-metric-val" style={{ color: '#f59e0b' }}>186</h3>
          </div>
          <div className="ca-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="ca-metric-card">
          <div>
            <p className="ca-metric-label">Not Interested</p>
            <h3 className="ca-metric-val" style={{ color: '#ef4444' }}>52</h3>
          </div>
          <div className="ca-metric-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="ca-filter-card">
        <div className="ca-search-box">
          <svg className="ca-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, lead ID, or mobile..."
            className="ca-search-input"
          />
        </div>

        <select
          value={telecallerFilter}
          onChange={(e) => setTelecallerFilter(e.target.value)}
          className="ca-select"
        >
          <option>All Telecallers</option>
          <option>Keerthana</option>
          <option>Manikandan</option>
          <option>Divya</option>
          <option>Suresh</option>
          <option>Hari</option>
        </select>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="ca-select"
        >
          <option>All Outcomes</option>
          <option>Connected</option>
          <option>Follow-up</option>
          <option>Not Interested</option>
          <option>Busy / No Answer</option>
        </select>

        <button type="button" className="ca-date-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>Select Date</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setTelecallerFilter('All Telecallers');
            setOutcomeFilter('All Outcomes');
          }}
          className="ca-btn-reset"
        >
          Reset
        </button>
      </div>

      {/* Call Activity Table */}
      <div className="ca-table-card">
        <div className="ca-table-header">
          <div className="ca-table-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Call Activity Logs</span>
          </div>
          <button type="button" onClick={() => alert('Exporting call logs report...')} className="ca-export-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>

        <table className="ca-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>Call ID</th>
              <th>Student Name</th>
              <th>Lead ID</th>
              <th>Mobile</th>
              <th>Telecaller</th>
              <th>Duration</th>
              <th>Outcome</th>
              <th>Call Notes</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{log.id}</td>
                  <td style={{ fontWeight: 700 }}>{log.studentName}</td>
                  <td style={{ color: '#64748b', fontWeight: 600 }}>{log.leadId}</td>
                  <td style={{ fontFamily: 'monospace' }}>{log.mobile}</td>
                  <td style={{ color: '#0066ff', fontWeight: 700 }}>{log.telecaller}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{log.duration}</td>
                  <td>
                    <span className={`ca-badge ${getOutcomeClass(log.outcome)}`}>
                      {log.outcome}
                    </span>
                  </td>
                  <td style={{ color: '#475569', maxWidth: '280px' }}>{log.notes}</td>
                  <td style={{ textAlign: 'right', paddingRight: '24px', color: '#64748b' }}>{log.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No call logs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="ca-pagination">
          <span>Showing 1 to {filteredLogs.length} of {callLogs.length} call records</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="ca-page-btn">&lt;</button>
            <button className="ca-page-btn active">1</button>
            <button className="ca-page-btn">2</button>
            <button className="ca-page-btn">3</button>
            <button className="ca-page-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}