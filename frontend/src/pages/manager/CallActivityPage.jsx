import React, { useState, useRef, useEffect } from 'react';
import './CallActivity.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Initial Call Activity Logs (Matching Manager Call Activity UI)
const INITIAL_CALL_LOGS = [
  { id: 'CALL-501', studentName: 'Arun Kumar', leadId: 'AP-1001', mobile: '9876543210', telecaller: 'Keerthana', duration: '4m 12s', outcome: 'Follow-up', notes: 'Interested in B.E CSE; asked for fee structure and hostel details', timestamp: 'Today, 11:15 AM', callDate: '2026-11-20' },
  { id: 'CALL-502', studentName: 'Priya S', leadId: 'AP-1002', mobile: '9786543211', telecaller: 'Manikandan', duration: '6m 45s', outcome: 'Connected', notes: 'Parent confirmed admission counseling visit this Friday', timestamp: 'Today, 10:40 AM', callDate: '2026-11-20' },
  { id: 'CALL-503', studentName: 'Vignesh R', leadId: 'AP-1003', mobile: '9123456789', telecaller: 'Divya', duration: '1m 20s', outcome: 'Not Interested', notes: 'Joined Anna University counseling quota; closed lead', timestamp: 'Today, 09:55 AM', callDate: '2026-11-20' },
  { id: 'CALL-504', studentName: 'Kavya M', leadId: 'AP-1004', mobile: '9876501234', telecaller: 'Suresh', duration: '0m 42s', outcome: 'Busy / No Answer', notes: 'Ringing not answered; scheduled callback for evening', timestamp: 'Yesterday, 04:30 PM', callDate: '2026-11-19' },
  { id: 'CALL-505', studentName: 'Dinesh K', leadId: 'AP-1005', mobile: '9843216780', telecaller: 'Hari', duration: '5m 10s', outcome: 'Follow-up', notes: 'Requested brochure and placement record on WhatsApp', timestamp: 'Yesterday, 02:15 PM', callDate: '2026-11-19' },
  { id: 'CALL-506', studentName: 'Divya S', leadId: 'AP-1006', mobile: '9567812345', telecaller: 'Keerthana', duration: '7m 05s', outcome: 'Connected', notes: 'Scholarship eligibility verified; token advance discussed', timestamp: '18 Nov 2026, 03:20 PM', callDate: '2026-11-18' },
];

export default function CallActivityPage() {
  const [callLogs, setCallLogs] = useState(INITIAL_CALL_LOGS);

  // Draft Filter States (User select pannum podhu inga store aagum)
  const [draftSearch, setDraftSearch] = useState('');
  const [draftTelecaller, setDraftTelecaller] = useState('All Telecallers');
  const [draftOutcome, setDraftOutcome] = useState('All Outcomes');
  const [draftDate, setDraftDate] = useState(''); // 'YYYY-MM-DD'

  // Applied Filter States ("Apply" button click panna apparam mattume table filter aagum)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    telecaller: 'All Telecallers',
    outcome: 'All Outcomes',
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
    const fetchCallLogs = async () => {
      try {
        const res = await fetch('/api/admin/manager/call-activity');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setCallLogs(data);
        }
      } catch (err) {
        // Fallback to initial call logs
      }
    };
    fetchCallLogs();
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
      outcome: draftOutcome,
      date: draftDate,
    });
    setShowCalendar(false);
  };

  // Reset Button Handler
  const handleResetFilters = () => {
    setDraftSearch('');
    setDraftTelecaller('All Telecallers');
    setDraftOutcome('All Outcomes');
    setDraftDate('');
    setAppliedFilters({
      search: '',
      telecaller: 'All Telecallers',
      outcome: 'All Outcomes',
      date: '',
    });
    setShowCalendar(false);
  };

  // Applied Filters vaitthu table data filter seithal
  const filteredLogs = callLogs.filter((item) => {
    const query = appliedFilters.search.toLowerCase();
    const matchesSearch =
      !query ||
      item.studentName.toLowerCase().includes(query) ||
      item.leadId.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.mobile.includes(query);

    const matchesTelecaller =
      appliedFilters.telecaller === 'All Telecallers' || item.telecaller === appliedFilters.telecaller;

    const matchesOutcome =
      appliedFilters.outcome === 'All Outcomes' || item.outcome === appliedFilters.outcome;

    const matchesDate =
      !appliedFilters.date || item.callDate === appliedFilters.date;

    return matchesSearch && matchesTelecaller && matchesOutcome && matchesDate;
  });

  const getOutcomeClass = (outcome) => {
    switch (outcome) {
      case 'Connected': return 'connected';
      case 'Follow-up': return 'followup';
      case 'Not Interested': return 'not-interested';
      default: return 'busy';
    }
  };

  // Filter apply aagirundha filtered counts kaattum, illana overall totals kaattum
  const isFiltered = Boolean(
    appliedFilters.search ||
    appliedFilters.telecaller !== 'All Telecallers' ||
    appliedFilters.outcome !== 'All Outcomes' ||
    appliedFilters.date
  );

  const totalCallsCount = isFiltered ? filteredLogs.length : 892;
  const connectedCount = isFiltered ? filteredLogs.filter((l) => l.outcome === 'Connected').length : 654;
  const followUpCount = isFiltered ? filteredLogs.filter((l) => l.outcome === 'Follow-up').length : 186;
  const notInterestedCount = isFiltered ? filteredLogs.filter((l) => l.outcome === 'Not Interested').length : 52;

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="ca-container">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="ca-title">Call Activity</h1>
        <p className="ca-breadcrumb">Admission Panel / Manager Admin / Call Activity</p>
      </div>

      {/* 4 Stat Metrics */}
      <div className="ca-metrics-grid">
        <div className="ca-metric-card">
          <div>
            <p className="ca-metric-label">Total Calls</p>
            <h3 className="ca-metric-val" style={{ color: '#0066ff' }}>{totalCallsCount}</h3>
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
            <h3 className="ca-metric-val" style={{ color: '#10b981' }}>{connectedCount}</h3>
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
            <h3 className="ca-metric-val" style={{ color: '#f59e0b' }}>{followUpCount}</h3>
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
            <h3 className="ca-metric-val" style={{ color: '#ef4444' }}>{notInterestedCount}</h3>
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

      {/* Filter Bar */}
      <div className="ca-filter-card">
        <div className="ca-search-box">
          <svg className="ca-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by student name, lead ID, or mobile..."
            className="ca-search-input"
          />
        </div>

        <select
          value={draftTelecaller}
          onChange={(e) => setDraftTelecaller(e.target.value)}
          className="ca-select"
        >
          <option value="All Telecallers">All Telecallers</option>
          <option value="Keerthana">Keerthana</option>
          <option value="Manikandan">Manikandan</option>
          <option value="Divya">Divya</option>
          <option value="Suresh">Suresh</option>
          <option value="Hari">Hari</option>
        </select>

        <select
          value={draftOutcome}
          onChange={(e) => setDraftOutcome(e.target.value)}
          className="ca-select"
        >
          <option value="All Outcomes">All Outcomes</option>
          <option value="Connected">Connected</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Busy / No Answer">Busy / No Answer</option>
        </select>

        {/* Single Date Interactive Calendar Picker */}
        <div className="ca-date-wrapper" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar((prev) => !prev)}
            className={`ca-date-btn ${draftDate ? 'active' : ''}`}
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
            <div className="ca-calendar-popover">
              <div className="ca-cal-header">
                <button
                  type="button"
                  className="ca-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                >
                  ‹
                </button>
                <span className="ca-cal-month-title">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  type="button"
                  className="ca-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                >
                  ›
                </button>
              </div>

              <div className="ca-cal-weekdays">
                {WEEK_DAYS.map((dayName) => (
                  <span key={dayName} className="ca-cal-weekday">
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="ca-cal-grid">
                {calendarCells.map((day, idx) => {
                  if (!day) {
                    return <span key={`empty-${idx}`} className="ca-cal-empty" />;
                  }
                  const cellKey = toDateKey(year, month, day);
                  const isSelected = draftDate === cellKey;
                  const isToday = todayKey === cellKey;

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`ca-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Footer with Apply Button */}
              <div className="ca-cal-footer">
                <div className="ca-cal-footer-left">
                  <button
                    type="button"
                    onClick={handleSelectToday}
                    className="ca-cal-today-btn"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftDate('')}
                    className="ca-cal-clear-btn"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="ca-cal-apply-btn"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Apply & Reset Buttons */}
        <div className="ca-filter-actions">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="ca-btn-apply"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="ca-btn-reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Call Activity Logs Table Card */}
      <div className="ca-table-card">
        <div className="ca-table-header">
          <div className="ca-table-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <h2 className="ca-table-title">
              Call Activity Logs {appliedFilters.date ? `(${formatDisplayDate(appliedFilters.date)})` : ''}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Call Activity Report...')}
            className="ca-export-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>

        <div className="ca-table-scroll">
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
                <th style={{ paddingRight: '24px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{log.id}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{log.studentName}</td>
                    <td style={{ color: '#64748b', fontWeight: 700 }}>{log.leadId}</td>
                    <td style={{ fontFamily: 'monospace' }}>{log.mobile}</td>
                    <td style={{ color: '#0066ff', fontWeight: 700 }}>{log.telecaller}</td>
                    <td style={{ color: '#334155', fontWeight: 700 }}>{log.duration}</td>
                    <td>
                      <span className={`ca-badge ${getOutcomeClass(log.outcome)}`}>
                        {log.outcome}
                      </span>
                    </td>
                    <td style={{ color: '#475569', maxWidth: '280px', whiteSpace: 'normal' }}>{log.notes}</td>
                    <td style={{ color: '#64748b', paddingRight: '24px' }}>{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '44px', color: '#94a3b8', fontWeight: 600 }}>
                    {appliedFilters.date
                      ? `No call activity logs recorded on ${formatDisplayDate(appliedFilters.date)}.`
                      : 'No call activity logs found matching your filters.'}
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