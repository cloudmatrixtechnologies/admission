import React, { useState } from 'react';
import './TelecallerFollowups.css';

const INITIAL_FOLLOWUPS = [
  { id: 'FU-301', leadId: 'AP-1001', studentName: 'Arun Kumar', mobile: '9876543210', scheduledTime: 'Today, 10:30 AM', timeSlot: 'Morning', notes: 'Need fee concession details for B.E CSE; father requested evening callback', status: 'Pending' },
  { id: 'FU-302', leadId: 'AP-1004', studentName: 'Kavya M', mobile: '9876501234', scheduledTime: 'Today, 11:45 AM', timeSlot: 'Morning', notes: 'Parent consultation discussion regarding AI & DS cutoff criteria', status: 'Completed' },
  { id: 'FU-303', leadId: 'AP-1006', studentName: 'Divya S', mobile: '9567812345', scheduledTime: 'Today, 01:15 PM', timeSlot: 'Afternoon', notes: 'B.Sc CS scholarship percentage verified; requested PDF brochure', status: 'Completed' },
  { id: 'FU-304', leadId: 'AP-1008', studentName: 'Hari Prasath', mobile: '9156784321', scheduledTime: 'Today, 02:30 PM', timeSlot: 'Afternoon', notes: 'Seat reservation confirmation call for B.Tech IT', status: 'Pending' },
  { id: 'FU-305', leadId: 'AP-1009', studentName: 'Keerthana S', mobile: '9443218765', scheduledTime: 'Today, 04:00 PM', timeSlot: 'Evening', notes: 'Hostel accommodation and bus route clarity requested', status: 'Pending' },
  { id: 'FU-306', leadId: 'AP-1011', studentName: 'Surya R', mobile: '9123451122', scheduledTime: 'Yesterday, 04:30 PM', timeSlot: 'Evening', notes: 'Ringing not answered; reschedule needed urgently', status: 'Overdue' },
  { id: 'FU-307', leadId: 'AP-1012', studentName: 'Sneha P', mobile: '9988776655', scheduledTime: 'Yesterday, 05:00 PM', timeSlot: 'Evening', notes: 'Comparing with Anna University affiliated colleges', status: 'Overdue' },
];

export default function TelecallerFollowups() {
  const [followups, setFollowups] = useState(INITIAL_FOLLOWUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [slotFilter, setSlotFilter] = useState('All');

  // Toggle Pending <-> Completed
  const handleToggleStatus = (id) => {
    setFollowups((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const filteredFollowups = followups.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSlot = slotFilter === 'All' || item.timeSlot === slotFilter;

    return matchesSearch && matchesStatus && matchesSlot;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'Overdue': return 'overdue';
      default: return 'pending';
    }
  };

  const totalCount = followups.length;
  const completedCount = followups.filter((f) => f.status === 'Completed').length;
  const pendingCount = followups.filter((f) => f.status === 'Pending').length;
  const overdueCount = followups.filter((f) => f.status === 'Overdue').length;

  return (
    <div className="tcf-container">
      <div className="tcf-header">
        <h1 className="tcf-title">My Follow-ups</h1>
        <p className="tcf-breadcrumb">Admission Panel / Telecaller / My Follow-ups</p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="tcf-metrics-grid">
        <div className="tcf-metric-card">
          <div>
            <p className="tcf-metric-label">Today's Follow-ups</p>
            <h3 className="tcf-metric-val blue">{totalCount}</h3>
          </div>
          <div className="tcf-metric-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="tcf-metric-card">
          <div>
            <p className="tcf-metric-label">Completed</p>
            <h3 className="tcf-metric-val green">{completedCount}</h3>
          </div>
          <div className="tcf-metric-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="tcf-metric-card">
          <div>
            <p className="tcf-metric-label">Pending Calls</p>
            <h3 className="tcf-metric-val amber">{pendingCount}</h3>
          </div>
          <div className="tcf-metric-icon amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="tcf-metric-card">
          <div>
            <p className="tcf-metric-label">Overdue</p>
            <h3 className="tcf-metric-val red">{overdueCount}</h3>
          </div>
          <div className="tcf-metric-icon red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="tcf-filter-row">
        <div className="tcf-search-wrapper">
          <svg className="tcf-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name, Lead ID or mobile..."
            className="tcf-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="tcf-select"
        >
          <option value="All">All Follow-up Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          value={slotFilter}
          onChange={(e) => setSlotFilter(e.target.value)}
          className="tcf-select"
        >
          <option value="All">All Time Slots</option>
          <option value="Morning">Morning (09:00 AM - 12:00 PM)</option>
          <option value="Afternoon">Afternoon (12:00 PM - 03:30 PM)</option>
          <option value="Evening">Evening (03:30 PM - 07:00 PM)</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('All');
            setSlotFilter('All');
          }}
          className="tcf-btn-reset"
        >
          Reset
        </button>
      </div>

      {/* Follow-ups Queue Table */}
      <div className="tcf-table-card">
        <table className="tcf-table">
          <thead>
            <tr className="tcf-thead-row">
              <th className="tcf-th id-col">Lead ID</th>
              <th className="tcf-th">Student Name</th>
              <th className="tcf-th">Mobile</th>
              <th className="tcf-th">Scheduled Time</th>
              <th className="tcf-th">Discussion Notes / Reason</th>
              <th className="tcf-th">Status</th>
              <th className="tcf-th action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((item) => (
              <tr key={item.id} className="tcf-tr">
                <td className="tcf-td id-col">{item.leadId}</td>
                <td className="tcf-td name-col">{item.studentName}</td>
                <td className="tcf-td mobile-col">{item.mobile}</td>
                <td className="tcf-td time-col">{item.scheduledTime}</td>
                <td className="tcf-td notes-col">{item.notes}</td>
                <td className="tcf-td">
                  <span className={`tcf-badge ${getBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="tcf-td action-col">
                  <button
                    type="button"
                    onClick={() => alert(`Calling ${item.studentName} (${item.mobile})... Opening Requirement Capture screen.`)}
                    className="tcf-dial-btn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>Dial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id)}
                    className="tcf-status-btn"
                  >
                    {item.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
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