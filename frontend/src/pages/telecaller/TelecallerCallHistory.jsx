import React, { useState } from 'react';
import './TelecallerCallHistory.css';

const INITIAL_CALL_HISTORY = [
  { id: 'CALL-701', leadId: 'AP-1001', studentName: 'Arun Kumar', mobile: '9876543210', duration: '4m 32s', outcome: 'Follow-up', notes: 'Interested in B.E CSE; requested hostel fee concession details', timestamp: 'Today, 10:45 AM', dateTag: 'Today' },
  { id: 'CALL-702', leadId: 'AP-1006', studentName: 'Divya S', mobile: '9567812345', duration: '5m 18s', outcome: 'Connected', notes: 'Scholarship percentage confirmed; campus visit scheduled for Saturday', timestamp: 'Today, 11:20 AM', dateTag: 'Today' },
  { id: 'CALL-703', leadId: 'AP-1004', studentName: 'Kavya M', mobile: '9876501234', duration: '3m 50s', outcome: 'Follow-up', notes: 'Parent asked to callback after 6:00 PM for cutoff discussion', timestamp: 'Today, 12:05 PM', dateTag: 'Today' },
  { id: 'CALL-704', leadId: 'AP-1011', studentName: 'Surya R', mobile: '9123451122', duration: '0m 45s', outcome: 'Busy / No Answer', notes: 'Ringing no response; scheduled for evening calling batch', timestamp: 'Today, 01:30 PM', dateTag: 'Today' },
  { id: 'CALL-705', leadId: 'AP-1012', studentName: 'Sneha P', mobile: '9988776655', duration: '6m 10s', outcome: 'Connected', notes: 'Confirmed seat booking for B.E ECE with parent consent', timestamp: 'Yesterday, 03:15 PM', dateTag: 'Yesterday' },
  { id: 'CALL-706', leadId: 'AP-1008', studentName: 'Hari Prasath', mobile: '9156784321', duration: '1m 15s', outcome: 'Not Interested', notes: 'Joined PSG Tech through TNEA counseling; closed inquiry', timestamp: 'Yesterday, 04:40 PM', dateTag: 'Yesterday' },
  { id: 'CALL-707', leadId: 'AP-1009', studentName: 'Keerthana S', mobile: '9443218765', duration: '4m 05s', outcome: 'Connected', notes: 'B.Sc IT admission counseling session slot locked', timestamp: '15 Oct 2026, 02:00 PM', dateTag: 'Older' },
];

export default function TelecallerCallHistory() {
  const [history] = useState(INITIAL_CALL_HISTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesOutcome = outcomeFilter === 'All' || item.outcome === outcomeFilter;
    const matchesDate = dateFilter === 'All' || item.dateTag === dateFilter;

    return matchesSearch && matchesOutcome && matchesDate;
  });

  const getOutcomeClass = (outcome) => {
    switch (outcome) {
      case 'Connected': return 'connected';
      case 'Follow-up': return 'follow-up';
      case 'Not Interested': return 'rejected';
      default: return 'busy';
    }
  };

  const totalCalls = history.length;
  const connectedCount = history.filter((c) => c.outcome === 'Connected').length;
  const followUpCount = history.filter((c) => c.outcome === 'Follow-up').length;
  const rejectedCount = history.filter((c) => c.outcome === 'Not Interested').length;

  return (
    <div className="tch-container">
      <div className="tch-header">
        <h1 className="tch-title">Call History & Logs</h1>
        <p className="tch-breadcrumb">Admission Panel / Telecaller / Call History</p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="tch-metrics-grid">
        <div className="tch-metric-card">
          <div>
            <p className="tch-metric-label">Total Calls Logged</p>
            <h3 className="tch-metric-val blue">{totalCalls}</h3>
          </div>
          <div className="tch-metric-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="tch-metric-card">
          <div>
            <p className="tch-metric-label">Connected</p>
            <h3 className="tch-metric-val green">{connectedCount}</h3>
          </div>
          <div className="tch-metric-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="tch-metric-card">
          <div>
            <p className="tch-metric-label">Follow-ups Created</p>
            <h3 className="tch-metric-val amber">{followUpCount}</h3>
          </div>
          <div className="tch-metric-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="tch-metric-card">
          <div>
            <p className="tch-metric-label">Not Interested</p>
            <h3 className="tch-metric-val red">{rejectedCount}</h3>
          </div>
          <div className="tch-metric-icon red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="tch-filter-row">
        <div className="tch-search-wrapper">
          <svg className="tch-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, Lead ID or mobile..."
            className="tch-search-input"
          />
        </div>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="tch-select"
        >
          <option value="All">All Call Outcomes</option>
          <option value="Connected">Connected</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Busy / No Answer">Busy / No Answer</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="tch-select"
        >
          <option value="All">All Timelines</option>
          <option value="Today">Today Only</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Older">Older Records</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setOutcomeFilter('All');
            setDateFilter('All');
          }}
          className="tch-btn-reset"
        >
          Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="tch-table-card">
        <table className="tch-table">
          <thead>
            <tr className="tch-thead-row">
              <th className="tch-th id-col">Call ID</th>
              <th className="tch-th">Lead ID</th>
              <th className="tch-th">Student Name</th>
              <th className="tch-th">Mobile</th>
              <th className="tch-th">Duration</th>
              <th className="tch-th">Call Outcome</th>
              <th className="tch-th">Call Notes / Discussion</th>
              <th className="tch-th">Call Timestamp</th>
              <th className="tch-th action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id} className="tch-tr">
                <td className="tch-td id-col">{item.id}</td>
                <td className="tch-td" style={{ fontWeight: 700, color: '#64748b' }}>{item.leadId}</td>
                <td className="tch-td name-col">{item.studentName}</td>
                <td className="tch-td mobile-col">{item.mobile}</td>
                <td className="tch-td duration-col">{item.duration}</td>
                <td className="tch-td">
                  <span className={`tch-badge ${getOutcomeClass(item.outcome)}`}>
                    {item.outcome}
                  </span>
                </td>
                <td className="tch-td notes-col">{item.notes}</td>
                <td className="tch-td time-col">{item.timestamp}</td>
                <td className="tch-td action-col">
                  <button
                    type="button"
                    onClick={() => alert(`Re-dialing ${item.studentName} (${item.mobile})... Opening Requirement Capture screen.`)}
                    className="tch-redial-btn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Re-dial</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}