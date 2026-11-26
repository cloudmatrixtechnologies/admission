import React, { useState, useRef, useEffect } from 'react';
import './FollowUpResults.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function FollowUpResultsPage() {
  // Backend API connect aanadhum follow-up records inga varum
  // Expected item format: { id, leadId, studentName, mobile, telecaller, lastFollowUp: '2026-11-19', nextFollowUp, status, remarks }
  const [results] = useState([]);

  // Draft Filter States (Select pannum podhu inga store aagum; Apply kudutha apparam thaan view maarum)
  const [draftSearch, setDraftSearch] = useState('');
  const [draftTelecaller, setDraftTelecaller] = useState('All');
  const [draftStatus, setDraftStatus] = useState('All');
  const [draftDate, setDraftDate] = useState(''); // 'YYYY-MM-DD'

  // Applied Filter States
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    telecaller: 'All',
    status: 'All',
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

  // 'YYYY-MM-DD' format generator
  const toDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Button-la readable date kaatta (e.g., 19 Nov 2026)
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

  // Date click panna draftDate-la set aagum
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
    setDraftTelecaller('All');
    setDraftStatus('All');
    setDraftDate('');
    setAppliedFilters({
      search: '',
      telecaller: 'All',
      status: 'All',
      date: '',
    });
    setShowCalendar(false);
  };

  // Filtered Results Logic
  const filteredResults = results.filter((item) => {
    const query = appliedFilters.search.toLowerCase();
    const matchesSearch =
      !query ||
      item.studentName?.toLowerCase().includes(query) ||
      item.leadId?.toLowerCase().includes(query) ||
      item.mobile?.includes(query);

    const matchesTelecaller =
      appliedFilters.telecaller === 'All' || item.telecaller === appliedFilters.telecaller;

    const matchesStatus =
      appliedFilters.status === 'All' || item.status === appliedFilters.status;

    const matchesDate =
      !appliedFilters.date ||
      item.lastFollowUp === appliedFilters.date ||
      item.nextFollowUp === appliedFilters.date;

    return matchesSearch && matchesTelecaller && matchesStatus && matchesDate;
  });

  // Dynamic Metrics & Percentage Calculation
  const totalFollowUps = filteredResults.length;
  const convertedCount = filteredResults.filter((r) => r.status === 'Converted').length;
  const inFollowUpCount = filteredResults.filter((r) => r.status === 'In Follow-up').length;
  const notInterestedCount = filteredResults.filter((r) => r.status === 'Not Interested').length;

  const calcPercent = (count) =>
    totalFollowUps === 0 ? '0.0%' : `${((count / totalFollowUps) * 100).toFixed(1)}%`;

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="fur-container">
      {/* Page Header */}
      <div>
        <h1 className="fur-title">Follow-up Results</h1>
        <p className="fur-breadcrumb">Admission Panel / Super Admin / Follow-up Results</p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="fur-metrics-grid">
        <div className="fur-metric-card">
          <div>
            <p className="fur-metric-label">Total Follow-ups</p>
            <h3 className="fur-metric-val">{totalFollowUps}</h3>
          </div>
          <div className="fur-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="fur-metric-card">
          <div>
            <p className="fur-metric-label">Converted</p>
            <div className="fur-metric-row">
              <h3 className="fur-metric-val" style={{ color: '#10b981' }}>{convertedCount}</h3>
              <span className="fur-metric-pct">({calcPercent(convertedCount)})</span>
            </div>
          </div>
          <div className="fur-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="fur-metric-card">
          <div>
            <p className="fur-metric-label">In Follow-up</p>
            <div className="fur-metric-row">
              <h3 className="fur-metric-val" style={{ color: '#f59e0b' }}>{inFollowUpCount}</h3>
              <span className="fur-metric-pct">({calcPercent(inFollowUpCount)})</span>
            </div>
          </div>
          <div className="fur-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="fur-metric-card">
          <div>
            <p className="fur-metric-label">Not Interested</p>
            <div className="fur-metric-row">
              <h3 className="fur-metric-val" style={{ color: '#ef4444' }}>{notInterestedCount}</h3>
              <span className="fur-metric-pct">({calcPercent(notInterestedCount)})</span>
            </div>
          </div>
          <div className="fur-metric-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="fur-filter-bar">
        {/* Search Input */}
        <div className="fur-search-box">
          <svg className="fur-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by name, mobile number or lead ID..."
            className="fur-search-input"
          />
        </div>

        {/* Telecaller Dropdown */}
        <div className="fur-filter-group">
          <span className="fur-filter-label">Telecaller</span>
          <select
            value={draftTelecaller}
            onChange={(e) => setDraftTelecaller(e.target.value)}
            className="fur-select"
          >
            <option value="All">All</option>
            <option value="Keerthana">Keerthana</option>
            <option value="Manikandan">Manikandan</option>
            <option value="Divya">Divya</option>
          </select>
        </div>

        {/* Follow-up Status Dropdown */}
        <div className="fur-filter-group">
          <span className="fur-filter-label">Follow-up Status</span>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            className="fur-select"
          >
            <option value="All">All</option>
            <option value="Converted">Converted</option>
            <option value="In Follow-up">In Follow-up</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>

        {/* Single Date Calendar Picker */}
        <div className="fur-date-wrapper" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar((prev) => !prev)}
            className={`fur-date-btn ${draftDate ? 'active' : ''}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{formatDisplayDate(draftDate)}</span>
          </button>

          {/* Calendar Popover with Apply Button */}
          {showCalendar && (
            <div className="fur-calendar-popover">
              <div className="fur-cal-header">
                <button
                  type="button"
                  className="fur-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                >
                  ‹
                </button>
                <span className="fur-cal-month-title">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  type="button"
                  className="fur-cal-nav-btn"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                >
                  ›
                </button>
              </div>

              <div className="fur-cal-weekdays">
                {WEEK_DAYS.map((dayName) => (
                  <span key={dayName} className="fur-cal-weekday">
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="fur-cal-grid">
                {calendarCells.map((day, idx) => {
                  if (!day) {
                    return <span key={`empty-${idx}`} className="fur-cal-empty" />;
                  }
                  const cellKey = toDateKey(year, month, day);
                  const isSelected = draftDate === cellKey;
                  const isToday = todayKey === cellKey;

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      onClick={() => handleDateClick(day)}
                      className={`fur-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Popover Footer: Today, Clear & Apply */}
              <div className="fur-cal-footer">
                <div className="fur-cal-footer-left">
                  <button
                    type="button"
                    onClick={handleSelectToday}
                    className="fur-cal-today-btn"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftDate('')}
                    className="fur-cal-clear-btn"
                  >
                    Clear
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="fur-cal-apply-btn"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Apply & Reset Buttons */}
        <div className="fur-filter-actions">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="fur-apply-btn"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="fur-reset-btn"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Follow-up Results Table Card (Horizontal Scroll Enabled) */}
      <div className="fur-table-card">
        <div className="fur-table-header">
          <div className="fur-table-title-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <h2 className="fur-table-title">
              Follow-up Results {appliedFilters.date ? `(${formatDisplayDate(appliedFilters.date)})` : ''}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Follow-up Results report...')}
            className="fur-export-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <div className="fur-table-scroll">
          <table className="fur-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Lead ID</th>
                <th>Student Name</th>
                <th>Mobile Number</th>
                <th>Assigned To</th>
                <th>Last Follow-up</th>
                <th>Next Follow-up</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{row.leadId}</td>
                  <td style={{ fontWeight: 700, color: '#1e293b' }}>{row.studentName}</td>
                  <td>{row.mobile}</td>
                  <td>{row.telecaller}</td>
                  <td>{row.lastFollowUp}</td>
                  <td>{row.nextFollowUp}</td>
                  <td>{row.status}</td>
                  <td>{row.remarks}</td>
                  <td>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="fur-empty-box">
            <div className="fur-empty-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="fur-empty-title">
              {appliedFilters.date
                ? `No follow-up results recorded on ${formatDisplayDate(appliedFilters.date)}`
                : 'No follow-up results recorded yet'}
            </p>
            <p className="fur-empty-desc">
              Follow-up progression and student feedback logs will appear here once connected to the backend API.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}