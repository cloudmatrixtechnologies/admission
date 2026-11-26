import React, { useState, useRef, useEffect } from 'react';
import './TelecallerActivity.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function TelecallerActivityPage() {
  // Backend API connect aanadhum data inga varum (format: { id, name, date: '2026-11-19', assigned, completed, pending, followUpToday, conversion, status })
  const [activities] = useState([]);

  // Draft Filter States (User select pannum pothu inga store aagum, udane view maaradhu)
  const [draftTelecaller, setDraftTelecaller] = useState('All');
  const [draftStatus, setDraftStatus] = useState('All');
  const [draftDate, setDraftDate] = useState(''); // 'YYYY-MM-DD'

  // Applied Filter States ("Apply" button click panna apparam mattume update aagum)
  const [appliedFilters, setAppliedFilters] = useState({
    telecaller: 'All',
    status: 'All',
    date: '',
  });

  // Calendar Popover States
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const calendarRef = useRef(null);

  // Outside click panna calendar popup close aaga
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

  // Date click panna draftDate-la set aagum (Apply kudutha apparam thaan view aagum)
  const handleDateClick = (day) => {
    if (!day) return;
    const clickedKey = toDateKey(year, month, day);
    setDraftDate(clickedKey);
  };

  // Today shortcut (draftDate-la Today set pannum)
  const handleSelectToday = () => {
    const now = new Date();
    const todayKey = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setDraftDate(todayKey);
  };

  // Apply Button Handler -> Selected date & filters-ai view-kku apply seiyum
  const handleApplyFilters = () => {
    setAppliedFilters({
      telecaller: draftTelecaller,
      status: draftStatus,
      date: draftDate,
    });
    setShowCalendar(false);
  };

  // Reset Button Handler -> Ella filters-um clear seiyum
  const handleResetFilters = () => {
    setDraftTelecaller('All');
    setDraftStatus('All');
    setDraftDate('');
    setAppliedFilters({
      telecaller: 'All',
      status: 'All',
      date: '',
    });
    setShowCalendar(false);
  };

  // Applied Filters vaitthu table data filter seithal
  const filteredActivities = activities.filter((item) => {
    const matchesTelecaller =
      appliedFilters.telecaller === 'All' || item.name === appliedFilters.telecaller;
    const matchesStatus =
      appliedFilters.status === 'All' || item.status === appliedFilters.status;
    const matchesDate =
      !appliedFilters.date || item.date === appliedFilters.date;

    return matchesTelecaller && matchesStatus && matchesDate;
  });

  // Applied date-kku undaana summary counts
  const totalTelecallers = filteredActivities.length;
  const totalAssigned = filteredActivities.reduce((sum, item) => sum + (item.assigned || 0), 0);
  const totalCompleted = filteredActivities.reduce((sum, item) => sum + (item.completed || 0), 0);
  const totalPendingFollowups = filteredActivities.reduce((sum, item) => sum + (item.followUpToday || 0), 0);

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="ta-container">
      {/* Page Header */}
      <div>
        <h1 className="ta-title">Telecaller Activity</h1>
        <p className="ta-breadcrumb">Admission Panel / Super Admin / Telecaller Activity</p>
      </div>

      {/* 4 Metrics Cards */}
      <div className="ta-metrics-grid">
        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Total Telecallers</p>
            <h3 className="ta-metric-val">{totalTelecallers}</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Assigned Leads</p>
            <h3 className="ta-metric-val">{totalAssigned}</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Completed Calls</p>
            <h3 className="ta-metric-val">{totalCompleted}</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="ta-metric-card">
          <div>
            <p className="ta-metric-label">Pending Follow-ups</p>
            <h3 className="ta-metric-val">{totalPendingFollowups}</h3>
          </div>
          <div className="ta-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ta-filter-bar">
        <div className="ta-filter-left">
          {/* Telecaller Dropdown */}
          <div className="ta-filter-group">
            <span className="ta-filter-label">Telecaller</span>
            <select
              value={draftTelecaller}
              onChange={(e) => setDraftTelecaller(e.target.value)}
              className="ta-select"
            >
              <option value="All">All</option>
              <option value="Keerthana">Keerthana</option>
              <option value="Manikandan">Manikandan</option>
              <option value="Divya">Divya</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="ta-filter-group">
            <span className="ta-filter-label">Status</span>
            <select
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value)}
              className="ta-select"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Single Date Calendar Picker */}
          <div className="ta-filter-group">
            <span className="ta-filter-label">Date</span>
            <div className="ta-date-wrapper" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setShowCalendar((prev) => !prev)}
                className={`ta-date-btn ${draftDate ? 'active' : ''}`}
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
                <div className="ta-calendar-popover">
                  {/* Month Navigation */}
                  <div className="ta-cal-header">
                    <button
                      type="button"
                      className="ta-cal-nav-btn"
                      onClick={() => setViewDate(new Date(year, month - 1, 1))}
                    >
                      ‹
                    </button>
                    <span className="ta-cal-month-title">
                      {MONTH_NAMES[month]} {year}
                    </span>
                    <button
                      type="button"
                      className="ta-cal-nav-btn"
                      onClick={() => setViewDate(new Date(year, month + 1, 1))}
                    >
                      ›
                    </button>
                  </div>

                  {/* Weekday Labels */}
                  <div className="ta-cal-weekdays">
                    {WEEK_DAYS.map((dayName) => (
                      <span key={dayName} className="ta-cal-weekday">
                        {dayName}
                      </span>
                    ))}
                  </div>

                  {/* Date Cells */}
                  <div className="ta-cal-grid">
                    {calendarCells.map((day, idx) => {
                      if (!day) {
                        return <span key={`empty-${idx}`} className="ta-cal-empty" />;
                      }
                      const cellKey = toDateKey(year, month, day);
                      const isSelected = draftDate === cellKey;
                      const isToday = todayKey === cellKey;

                      return (
                        <button
                          key={cellKey}
                          type="button"
                          onClick={() => handleDateClick(day)}
                          className={`ta-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Popover Footer (Today, Clear, Apply) */}
                  <div className="ta-cal-footer">
                    <div className="ta-cal-footer-left">
                      <button
                        type="button"
                        onClick={handleSelectToday}
                        className="ta-cal-today-btn"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftDate('')}
                        className="ta-cal-clear-btn"
                      >
                        Clear
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="ta-cal-apply-btn"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Apply & Reset Buttons */}
        <div className="ta-filter-actions">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="ta-apply-btn"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="ta-reset-btn"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Telecaller Performance Table Card (Horizontal Scroll Enabled) */}
      <div className="ta-table-card">
        <div className="ta-table-header">
          <div className="ta-table-title-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <h2 className="ta-table-title">
              Telecaller Performance {appliedFilters.date ? `(${formatDisplayDate(appliedFilters.date)})` : ''}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Telecaller Activity report...')}
            className="ta-export-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <div className="ta-table-scroll">
          <table className="ta-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Telecaller Name</th>
                <th>Assigned Leads</th>
                <th>Completed Calls</th>
                <th>Pending</th>
                <th>Follow-up Today</th>
                <th>Conversion</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</td>
                  <td>{row.assigned}</td>
                  <td>{row.completed}</td>
                  <td>{row.pending}</td>
                  <td>{row.followUpToday}</td>
                  <td>{row.conversion}</td>
                  <td>{row.status}</td>
                  <td>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredActivities.length === 0 && (
          <div className="ta-empty-box">
            <div className="ta-empty-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="ta-empty-title">
              {appliedFilters.date
                ? `No telecaller work recorded on ${formatDisplayDate(appliedFilters.date)}`
                : 'No telecaller activity recorded yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}