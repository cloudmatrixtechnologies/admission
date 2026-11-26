import React, { useState, useRef, useEffect } from 'react';
import './FollowUps.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Initial Follow-up Records (Matching Manager Follow-ups UI)
const INITIAL_FOLLOWUPS = [
  { id: 'FU-201', leadId: 'AP-1001', studentName: 'Arun Kumar', mobile: '9876543210', telecaller: 'Keerthana', scheduledTime: 'Today, 11:30 AM', scheduledDate: '2026-11-20', notes: 'Wants fee concession details for B.E. CSE', status: 'Pending' },
  { id: 'FU-202', leadId: 'AP-1002', studentName: 'Priya S', mobile: '9786543211', telecaller: 'Manikandan', scheduledTime: 'Today, 02:00 PM', scheduledDate: '2026-11-20', notes: 'Parent discussion pending regarding hostel', status: 'Pending' },
  { id: 'FU-203', leadId: 'AP-1003', studentName: 'Vignesh R', mobile: '9123456789', telecaller: 'Divya', scheduledTime: 'Today, 10:00 AM', scheduledDate: '2026-11-20', notes: 'Visited campus; confirmed seat reservation', status: 'Completed' },
  { id: 'FU-204', leadId: 'AP-1004', studentName: 'Kavya M', mobile: '9876501234', telecaller: 'Suresh', scheduledTime: 'Yesterday, 04:30 PM', scheduledDate: '2026-11-19', notes: 'Call not answered; need to re-dial', status: 'Overdue' },
  { id: 'FU-205', leadId: 'AP-1005', studentName: 'Dinesh K', mobile: '9843216780', telecaller: 'Hari', scheduledTime: 'Today, 04:00 PM', scheduledDate: '2026-11-20', notes: 'Requested brochure on WhatsApp', status: 'Rescheduled' },
  { id: 'FU-206', leadId: 'AP-1006', studentName: 'Divya S', mobile: '9567812345', telecaller: 'Keerthana', scheduledTime: 'Today, 01:15 PM', scheduledDate: '2026-11-20', notes: 'Scholarship eligibility checked', status: 'Completed' },
  { id: 'FU-207', leadId: 'AP-1007', studentName: 'Suresh R', mobile: '9023456781', telecaller: 'Manikandan', scheduledTime: 'Yesterday, 05:00 PM', scheduledDate: '2026-11-19', notes: 'Comparing with neighboring polytechnic', status: 'Overdue' },
];

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState(INITIAL_FOLLOWUPS);

  // Draft Filter States (User select pannum podhu inga store aagum)
  const [draftSearch, setDraftSearch] = useState('');
  const [draftTelecaller, setDraftTelecaller] = useState('All Telecallers');
  const [draftStatus, setDraftStatus] = useState('All Status');
  const [draftDate, setDraftDate] = useState(''); // 'YYYY-MM-DD'

  // Applied Filter States ("Apply" button click panna apparam mattume table filter aagum)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    telecaller: 'All Telecallers',
    status: 'All Status',
    date: '',
  });

  // Calendar Popover States
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const calendarRef = useRef(null);

  // Outside click panna calendar close aaga
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Backend API Integration
  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        const res = await fetch('/api/admin/manager/follow-ups');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setFollowups(data);
        }
      } catch (err) {
        // Fallback to initial followups
      }
    };
    fetchFollowups();
  }, []);

  // 'YYYY-MM-DD' format generator
  const toDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Button-la readable date kaatta (e.g., 20 Nov 2026)
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calendar Grid Calculation
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // Date click panna draftDate-la highlight aagum
  const handleDateClick = (day) => {
    if (!day) return;
    const clickedKey = toDateKey(year, month, day);
    setDraftDate(clickedKey);
  };

  // Today quick select
  const handleSelectToday = () => {
    const now = new Date();
    const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setDraftDate(todayKey);
  };

  // Apply Button Handler -> Selected date & filters-ai view-kku apply seiyum
  const handleApplyFilters = () => {
    setAppliedFilters({
      search: draftSearch.trim(),
      telecaller: draftTelecaller,
      status: draftStatus,
      date: draftDate,
    });
    setShowCalendar(false);
  };

  // Reset Button Handler
  const handleResetFilters = () => {
    setDraftSearch('');
    setDraftTelecaller('All Telecallers');
    setDraftStatus('All Status');
    setDraftDate('');
    setAppliedFilters({
      search: '',
      telecaller: 'All Telecallers',
      status: 'All Status',
      date: '',
    });
    setShowCalendar(false);
  };

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

  // Applied Filters vaitthu table data filter seithal
  const filteredFollowups = followups.filter((item) => {
    const query = appliedFilters.search.toLowerCase();
    const matchesSearch =
      !query ||
      item.studentName.toLowerCase().includes(query) ||
      item.leadId.toLowerCase().includes(query) ||
      item.mobile.includes(query);

    const matchesTelecaller =
      appliedFilters.telecaller === 'All Telecallers' || item.telecaller === appliedFilters.telecaller;

    const matchesStatus =
      appliedFilters.status === 'All Status' || item.status === appliedFilters.status;

    const matchesDate =
      !appliedFilters.date || item.scheduledDate === appliedFilters.date;

    return matchesSearch && matchesTelecaller && matchesStatus && matchesDate;
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

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

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

      {/* Filter Bar */}
      <div className="fu-filter-card">
        <div className="fu-search-box">
          <svg className="fu-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by student name, lead ID, or mobile..."
            className="fu-search-input"
          />
        </div>

        <select
          value={draftTelecaller}
          onChange={(e) => setDraftTelecaller(e.target.value)}
          className="fu-select"
        >
          <option value="All Telecallers">All Telecallers</option>
          <option value="Keerthana">Keerthana</option>
          <option value="Manikandan">Manikandan</option>
          <option value="Divya">Divya</option>
          <option value="Suresh">Suresh</option>
          <option value="Hari">Hari</option>
        </select>

        <select
          value={draftStatus}
          onChange={(e) => setDraftStatus(e.target.value)}
          className="fu-select"
        >
          <option value="All Status">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
          <option value="Rescheduled">Rescheduled</option>
        </select>

        {/* Single Date Interactive Calendar Picker */}
        <div className="fu-date-wrapper" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar((prev) => !prev)}
            className={`fu-date-btn ${draftDate ? 'active' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{formatDisplayDate(draftDate)}</span>
          </button>

          {/* Calendar Dropdown Popover */}
          {showCalendar && (
            <div className="fu-calendar-popover">
              <div className="fu-cal-header">
                <button
                  type="button"
                  className="fu-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                >
                  ‹
                </button>
                <span className="fu-cal-month-title">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  type="button"
                  className="fu-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                >
                  ›
                </button>
              </div>

              <div className="fu-cal-weekdays">
                {WEEK_DAYS.map((dayName) => (
                  <span key={dayName} className="fu-cal-weekday">
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="fu-cal-grid">
                {calendarCells.map((day, idx) => {
                  if (!day) {
                    return <span key={`empty-${idx}`} className="fu-cal-empty" />;
                  }
                  const cellKey = toDateKey(year, month, day);
                  const isSelected = draftDate === cellKey;
                  const isToday = todayKey === cellKey;

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`fu-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Footer with Apply Button */}
              <div className="fu-cal-footer">
                <div className="fu-cal-footer-left">
                  <button
                    type="button"
                    onClick={handleSelectToday}
                    className="fu-cal-today-btn"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftDate('')}
                    className="fu-cal-clear-btn"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="fu-cal-apply-btn"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Apply & Reset Buttons */}
        <div className="fu-filter-actions">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="fu-btn-apply"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="fu-btn-reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Follow-up Queue Table */}
      <div className="fu-table-card">
        <div className="fu-table-scroll">
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
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{item.studentName}</td>
                    <td style={{ fontFamily: 'monospace' }}>{item.mobile}</td>
                    <td style={{ color: '#0066ff', fontWeight: 600 }}>{item.telecaller}</td>
                    <td style={{ color: '#64748b' }}>{item.scheduledTime}</td>
                    <td style={{ color: '#475569', maxWidth: '280px', whiteSpace: 'normal' }}>{item.notes}</td>
                    <td>
                      <span className={`fu-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`fu-action-btn ${item.status === 'Completed' ? 'is-completed' : ''}`}
                      >
                        {item.status === 'Completed' ? 'Mark Pending' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '44px', color: '#94a3b8', fontWeight: 600 }}>
                    {appliedFilters.date
                      ? `No follow-ups scheduled on ${formatDisplayDate(appliedFilters.date)}.`
                      : 'No follow-up records found matching your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="fu-pagination">
          <span>Showing 1 to {filteredFollowups.length} of {followups.length} follow-ups</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="fu-page-btn">&lt;</button>
            <button className="fu-page-btn active">1</button>
            <button className="fu-page-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}