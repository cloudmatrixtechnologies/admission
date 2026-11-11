import React, { useState } from 'react';
import './TelecallerAssignedLeads.css';

const MOCK_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', mobile: '9876543210', tenth: 85, twelfth: 88, status: 'Pending', assignedDate: '15 Oct 2026' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', mobile: '9876501234', tenth: 88, twelfth: 91, status: 'Follow-up', assignedDate: '15 Oct 2026' },
  { id: 'AP-1006', name: 'Divya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', mobile: '9567812345', tenth: 86, twelfth: 89, status: 'Connected', assignedDate: '14 Oct 2026' },
  { id: 'AP-1008', name: 'Hari Prasath', college: 'ABC Engineering College', course: 'B.Tech IT', mobile: '9156784321', tenth: 90, twelfth: 93, status: 'Pending', assignedDate: '14 Oct 2026' },
  { id: 'AP-1009', name: 'Keerthana S', college: 'XYZ Arts & Science College', course: 'B.Sc. IT', mobile: '9443218765', tenth: 82, twelfth: 85, status: 'Follow-up', assignedDate: '13 Oct 2026' },
  { id: 'AP-1011', name: 'Surya R', college: 'LMN Engineering College', course: 'B.E. Mechanical', mobile: '9123451122', tenth: 79, twelfth: 81, status: 'Pending', assignedDate: '13 Oct 2026' },
  { id: 'AP-1012', name: 'Sneha P', college: 'ABC Engineering College', course: 'B.E. ECE', mobile: '9988776655', tenth: 91, twelfth: 94, status: 'Connected', assignedDate: '12 Oct 2026' },
];

export default function TelecallerAssignedLeads() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');

  // Direct status change handler via Actions dropdown
  const handleStatusChange = (id, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesCollege = collegeFilter === 'All Colleges' || lead.college === collegeFilter;

    return matchesSearch && matchesStatus && matchesCollege;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Connected':
        return 'connected';
      case 'Follow-up':
        return 'follow-up';
      default:
        return 'pending';
    }
  };

  const totalCount = leads.length;
  const pendingCount = leads.filter((l) => l.status === 'Pending').length;
  const followUpCount = leads.filter((l) => l.status === 'Follow-up').length;
  const connectedCount = leads.filter((l) => l.status === 'Connected').length;

  return (
    <div className="tal-container">
      <div className="tal-header">
        <h1 className="tal-title">My Assigned Leads</h1>
        <p className="tal-breadcrumb">Admission Panel / Telecaller / Assigned Leads</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="tal-metrics-grid">
        <div className="tal-metric-card">
          <div>
            <p className="tal-metric-label">Total Assigned</p>
            <h3 className="tal-metric-val blue">{totalCount}</h3>
          </div>
          <div className="tal-metric-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
          </div>
        </div>

        <div className="tal-metric-card">
          <div>
            <p className="tal-metric-label">Pending Calls</p>
            <h3 className="tal-metric-val amber">{pendingCount}</h3>
          </div>
          <div className="tal-metric-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="tal-metric-card">
          <div>
            <p className="tal-metric-label">Follow-ups</p>
            <h3 className="tal-metric-val green">{followUpCount}</h3>
          </div>
          <div className="tal-metric-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="tal-metric-card">
          <div>
            <p className="tal-metric-label">Connected / Done</p>
            <h3 className="tal-metric-val purple">{connectedCount}</h3>
          </div>
          <div className="tal-metric-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="tal-filter-row">
        <div className="tal-search-wrapper">
          <svg className="tal-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, personal ID or mobile..."
            className="tal-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="tal-select"
        >
          <option value="All">All Call Status</option>
          <option value="Pending">Pending</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Connected">Connected</option>
        </select>

        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="tal-select"
        >
          <option value="All Colleges">All Colleges</option>
          <option value="ABC Engineering College">ABC Engineering College</option>
          <option value="XYZ Arts & Science College">XYZ Arts & Science College</option>
          <option value="LMN Engineering College">LMN Engineering College</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('All');
            setCollegeFilter('All Colleges');
          }}
          className="tal-btn-reset"
        >
          Reset
        </button>
      </div>

      {/* Leads Table Card */}
      <div className="tal-table-card">
        <table className="tal-table">
          <thead>
            <tr className="tal-thead-row">
              <th className="tal-th id-col">Personal ID</th>
              <th className="tal-th">Student Name</th>
              <th className="tal-th">College</th>
              <th className="tal-th">Course</th>
              <th className="tal-th">10th / 12th (%)</th>
              <th className="tal-th">Mobile</th>
              <th className="tal-th">Call Status</th>
              <th className="tal-th action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="tal-tr">
                <td className="tal-td id-col">{lead.id}</td>
                <td className="tal-td name-col">{lead.name}</td>
                <td className="tal-td college-col">{lead.college}</td>
                <td className="tal-td course-col">{lead.course}</td>
                <td className="tal-td marks-col">{lead.tenth}% / {lead.twelfth}%</td>
                <td className="tal-td mobile-col">{lead.mobile}</td>
                <td className="tal-td">
                  <span className={`tal-badge ${getStatusClass(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="tal-td action-col">
                  {/* Dial Action */}
                  <button
                    type="button"
                    onClick={() => alert(`Calling ${lead.name} (${lead.mobile})... Opening Requirement Capture screen.`)}
                    className="tal-dial-btn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Dial</span>
                  </button>

                  {/* Actions keezha ulla Status Dropdown Select */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="tal-action-status-select"
                    title="Change status"
                  >
                    <option value="Connected">Connected</option>
                    <option value="Follow-up">Follow-ups</option>
                    <option value="Pending">Pending</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}