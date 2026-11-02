import React, { useState, useEffect } from 'react';
import './FollowUps.css';

// Initial Mock Follow-up Records
const INITIAL_FOLLOWUPS = [
  { id: 'FU-201', leadId: 'AP-1001', studentName: 'Arun Kumar', mobile: '9876543210', telecaller: 'Keerthana', scheduledTime: 'Today, 11:30 AM', notes: 'Wants fee concession details for B.E. CSE', status: 'Pending' },
  { id: 'FU-202', leadId: 'AP-1002', studentName: 'Priya S', mobile: '9786543211', telecaller: 'Manikandan', scheduledTime: 'Today, 02:00 PM', notes: 'Parent discussion pending regarding hostel', status: 'Pending' },
  { id: 'FU-203', leadId: 'AP-1003', studentName: 'Vignesh R', mobile: '9123456789', telecaller: 'Divya', scheduledTime: 'Today, 10:00 AM', notes: 'Visited campus; confirmed seat reservation', status: 'Completed' },
  { id: 'FU-204', leadId: 'AP-1004', studentName: 'Kavya M', mobile: '9876501234', telecaller: 'Suresh', scheduledTime: 'Yesterday, 04:30 PM', notes: 'Call not answered; need to re-dial', status: 'Overdue' },
  { id: 'FU-205', leadId: 'AP-1005', studentName: 'Dinesh K', mobile: '9843216780', telecaller: 'Hari', scheduledTime: 'Today, 04:00 PM', notes: 'Requested brochure on WhatsApp', status: 'Rescheduled' },
  { id: 'FU-206', leadId: 'AP-1006', studentName: 'Divya S', mobile: '9567812345', telecaller: 'Keerthana', scheduledTime: 'Today, 01:15 PM', notes: 'Scholarship eligibility checked', status: 'Completed' },
  { id: 'FU-207', leadId: 'AP-1007', studentName: 'Suresh R', mobile: '9023456781', telecaller: 'Manikandan', scheduledTime: 'Yesterday, 05:00 PM', notes: 'Comparing with neighboring polytechnic', status: 'Overdue' },
];

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState(INITIAL_FOLLOWUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [telecallerFilter, setTelecallerFilter] = useState('All Telecallers');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // =========================================================================
  // BACKEND API INTEGRATION
  // Uncomment when /api/admin/manager/follow-ups is live
  // =========================================================================
  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        const res = await fetch('/api/admin/manager/follow-ups');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setFollowups(data);
        }
      } catch (err) {
        console.warn('Backend follow-up API not ready, loading mock records.');
      }
    };
    fetchFollowups();
  }, []);

  // Quick Status Toggle Handler
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

  // Filter Logic
  const filteredFollowups = followups.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesTelecaller =
      telecallerFilter === 'All Telecallers' || item.telecaller === telecallerFilter;

    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;

    return matchesSearch && matchesTelecaller && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'Overdue': return 'overdue';
      case 'Rescheduled': return 'rescheduled';
      default: return 'pending';
    }
  };

  const todayCount = followups.length;
  const completedCount = followups.filter((f) => f.status === 'Completed').length;
  const pendingCount = followups.filter((f) => f.status === 'Pending').length;
  const overdueCount = followups.filter((f) => f.status === 'Overdue').length;

  return (
    <div className="fu-container">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="fu-title">Follow-ups Management</h1>
        <p className="fu-breadcrumb">Admission Panel / Manager Admin / Follow-ups</p>
      </div>

      {/* 4 Stat Metrics */}
      <div className="fu-metrics-grid">
        <div className="fu-metric-card">
          <div>
            <p className="fu-metric-label">Follow-ups Today</p>
            <h3 className="fu-metric-val" style={{ color: '#0066ff' }}>{todayCount}</h3>
          </div>
          <div className="fu-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="fu-metric-card">
          <div>
            <p className="fu-metric-label">Completed</p>
            <h3 className="fu-metric-val" style={{ color: '#10b981' }}>{completedCount}</h3>
          </div>
          <div className="fu-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="fu-metric-card">
          <div>
            <p className="fu-metric-label">Pending</p>
            <h3 className="fu-metric-val" style={{ color: '#f59e0b' }}>{pendingCount}</h3>
          </div>
          <div className="fu-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="fu-metric-card">
          <div>
            <p className="fu-metric-label">Overdue</p>
            <h3 className="fu-metric-val" style={{ color: '#ef4444' }}>{overdueCount}</h3>
          </div>
          <div className="fu-metric-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="fu-filter-card">
        <div className="fu-search-box">
          <svg className="fu-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, lead ID, or mobile..."
            className="fu-search-input"
          />
        </div>

        <select
          value={telecallerFilter}
          onChange={(e) => setTelecallerFilter(e.target.value)}
          className="fu-select"
        >
          <option>All Telecallers</option>
          <option>Keerthana</option>
          <option>Manikandan</option>
          <option>Divya</option>
          <option>Suresh</option>
          <option>Hari</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="fu-select"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Overdue</option>
          <option>Rescheduled</option>
        </select>

        <button type="button" className="fu-date-btn">
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
            setStatusFilter('All Status');
          }}
          className="fu-btn-reset"
        >
          Reset
        </button>
      </div>

      {/* Follow-up Queue Table */}
      <div className="fu-table-card">
        <table className="fu-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>Lead ID</th>
              <th>Student Name</th>
              <th>Mobile</th>
              <th>Telecaller</th>
              <th>Scheduled On</th>
              <th>Call Notes & Discussion</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.length > 0 ? (
              filteredFollowups.map((item) => (
                <tr key={item.id}>
                  <td style={{ paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{item.leadId}</td>
                  <td style={{ fontWeight: 700 }}>{item.studentName}</td>
                  <td style={{ fontFamily: 'monospace' }}>{item.mobile}</td>
                  <td style={{ color: '#0066ff', fontWeight: 600 }}>{item.telecaller}</td>
                  <td style={{ color: '#64748b' }}>{item.scheduledTime}</td>
                  <td style={{ color: '#475569', maxWidth: '280px' }}>{item.notes}</td>
                  <td>
                    <span className={`fu-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      className="fu-action-btn"
                    >
                      {item.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No follow-up records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="fu-pagination">
          <span>Showing 1 to {filteredFollowups.length} of {followups.length} follow-ups</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>&lt;</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: '#0066ff', color: '#fff', fontWeight: 700 }}>1</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}