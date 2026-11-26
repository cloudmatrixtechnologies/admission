import React, { useState, useRef, useEffect } from 'react';
import './ManageTelecallers.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Initial Telecaller Accounts Data (Matching UI)
const INITIAL_TELECALLERS = [
  { id: 1, name: 'Keerthana', email: 'keerthana@company.com', mobile: '9876543210', username: 'keerthana01', status: 'Active', assignedLeads: 80, createdDate: '2026-10-10' },
  { id: 2, name: 'Manikandan', email: 'manikandan@company.com', mobile: '9786543211', username: 'mani02', status: 'Active', assignedLeads: 72, createdDate: '2026-10-09' },
  { id: 3, name: 'Divya', email: 'divya@company.com', mobile: '9123456789', username: 'divya03', status: 'Active', assignedLeads: 64, createdDate: '2026-10-09' },
  { id: 4, name: 'Suresh', email: 'suresh@company.com', mobile: '9876501234', username: 'suresh04', status: 'Inactive', assignedLeads: 58, createdDate: '2026-10-08' },
  { id: 5, name: 'Hari', email: 'hari@company.com', mobile: '9843216780', username: 'hari05', status: 'Active', assignedLeads: 52, createdDate: '2026-10-08' },
];

export default function ManageTelecallersPage({ onCreateTelecaller, onViewTelecaller }) {
  const [telecallers, setTelecallers] = useState(INITIAL_TELECALLERS);

  // Draft Filter States (User select pannum pothu inga store aagum)
  const [draftSearch, setDraftSearch] = useState('');
  const [draftStatus, setDraftStatus] = useState('All');
  const [draftDate, setDraftDate] = useState(''); // 'YYYY-MM-DD'

  // Applied Filter States ("Apply" button click panna apparam view update aagum)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'All',
    date: '',
  });

  // Calendar Popover States
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 9, 1)); // Default Oct 2026
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

  // Backend API connect aanadhum auto-fetch seiyum
  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        const res = await fetch('/api/admin/manager/telecallers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTelecallers(data);
          }
        }
      } catch (err) {
        // Fallback to initial data
      }
    };
    fetchTelecallers();
  }, []);

  // 'YYYY-MM-DD' format generator
  const toDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // '2026-10-10' -> '10 Oct 2026' format
  const formatDisplayDate = (dateStr, fallbackText = 'Select Date') => {
    if (!dateStr) return fallbackText;
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
      status: draftStatus,
      date: draftDate,
    });
    setShowCalendar(false);
  };

  // Reset Button Handler
  const handleResetFilters = () => {
    setDraftSearch('');
    setDraftStatus('All');
    setDraftDate('');
    setAppliedFilters({
      search: '',
      status: 'All',
      date: '',
    });
    setShowCalendar(false);
  };

  // Delete telecaller row
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setTelecallers((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Applied Filters vaitthu table data filter seithal
  const filteredTelecallers = telecallers.filter((tc) => {
    const query = appliedFilters.search.toLowerCase();
    const matchesSearch =
      !query ||
      tc.name.toLowerCase().includes(query) ||
      tc.email.toLowerCase().includes(query) ||
      tc.username.toLowerCase().includes(query);

    const matchesStatus =
      appliedFilters.status === 'All' || tc.status === appliedFilters.status;

    const matchesDate =
      !appliedFilters.date || tc.createdDate === appliedFilters.date;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="mt-container">
      {/* Top Title Row & + Create Telecaller CTA */}
      <div className="mt-top-header">
        <div>
          <h1 className="mt-title">Manage Telecallers</h1>
          <p className="mt-breadcrumb">Admission Panel / Manager Admin / Manage Telecallers</p>
        </div>

        <button
          type="button"
          onClick={() => (onCreateTelecaller ? onCreateTelecaller() : alert('Opening Create Telecaller form...'))}
          className="mt-create-btn"
        >
          <span className="mt-plus-icon">+</span>
          <span>Create Telecaller</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mt-filter-bar">
        {/* Search Box */}
        <div className="mt-search-box">
          <svg className="mt-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by name, email or username..."
            className="mt-search-input"
          />
        </div>

        {/* Status Dropdown */}
        <div className="mt-filter-group">
          <span className="mt-filter-label">Status</span>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            className="mt-select"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Joining Date Calendar Picker */}
        <div className="mt-filter-group">
          <span className="mt-filter-label">Joining Date</span>
          <div className="mt-date-wrapper" ref={calendarRef}>
            <button
              type="button"
              onClick={() => setShowCalendar((prev) => !prev)}
              className={`mt-date-btn ${draftDate ? 'active' : ''}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>{formatDisplayDate(draftDate, 'Select Date')}</span>
            </button>

            {/* Calendar Dropdown Popover */}
            {showCalendar && (
              <div className="mt-calendar-popover">
                <div className="mt-cal-header">
                  <button
                    type="button"
                    className="mt-cal-nav-btn"
                    onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  >
                    ‹
                  </button>
                  <span className="mt-cal-month-title">
                    {MONTH_NAMES[month]} {year}
                  </span>
                  <button
                    type="button"
                    className="mt-cal-nav-btn"
                    onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  >
                    ›
                  </button>
                </div>

                <div className="mt-cal-weekdays">
                  {WEEK_DAYS.map((dayName) => (
                    <span key={dayName} className="mt-cal-weekday">
                      {dayName}
                    </span>
                  ))}
                </div>

                <div className="mt-cal-grid">
                  {calendarCells.map((day, idx) => {
                    if (!day) {
                      return <span key={`empty-${idx}`} className="mt-cal-empty" />;
                    }
                    const cellKey = toDateKey(year, month, day);
                    const isSelected = draftDate === cellKey;
                    const isToday = todayKey === cellKey;

                    return (
                      <button
                        key={cellKey}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className={`mt-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Footer with Apply Button */}
                <div className="mt-cal-footer">
                  <div className="mt-cal-footer-left">
                    <button
                      type="button"
                      onClick={handleSelectToday}
                      className="mt-cal-today-btn"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftDate('')}
                      className="mt-cal-clear-btn"
                    >
                      Clear
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="mt-cal-apply-btn"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apply & Reset Buttons */}
        <div className="mt-filter-actions">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="mt-apply-btn"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-reset-btn"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Telecaller Accounts Table Card */}
      <div className="mt-table-card">
        <div className="mt-table-header">
          <div className="mt-table-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h2 className="mt-table-title">
              Telecaller Accounts {appliedFilters.date ? `(${formatDisplayDate(appliedFilters.date)})` : ''}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Telecaller Accounts list...')}
            className="mt-export-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <div className="mt-table-scroll">
          <table className="mt-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email ID</th>
                <th>Mobile Number</th>
                <th>Username</th>
                <th>Status</th>
                <th>Assigned Leads</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTelecallers.map((tc, idx) => (
                <tr key={tc.id}>
                  <td className="mt-td-sno">{idx + 1}</td>
                  <td className="mt-td-name">{tc.name}</td>
                  <td className="mt-td-email">{tc.email}</td>
                  <td className="mt-td-mobile">{tc.mobile}</td>
                  <td className="mt-td-user">{tc.username}</td>
                  <td>
                    <span className={`mt-status-badge ${tc.status === 'Active' ? 'active' : 'inactive'}`}>
                      {tc.status}
                    </span>
                  </td>
                  <td className="mt-td-leads">{tc.assignedLeads}</td>
                  <td className="mt-td-date">{formatDisplayDate(tc.createdDate)}</td>
                  <td>
                    <div className="mt-action-group">
                      {/* View Icon */}
                      <button
                        type="button"
                        title="View Details"
                        onClick={() => (onViewTelecaller ? onViewTelecaller(tc) : alert(`Viewing ${tc.name} (${tc.username})`))}
                        className="mt-icon-btn blue"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {/* Edit Icon */}
                      <button
                        type="button"
                        title="Edit Telecaller"
                        onClick={() => alert(`Editing ${tc.name}`)}
                        className="mt-icon-btn blue"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        title="Delete Telecaller"
                        onClick={() => handleDelete(tc.id, tc.name)}
                        className="mt-icon-btn red"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTelecallers.length === 0 && (
          <div className="mt-empty-box">
            <div className="mt-empty-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="mt-empty-title">
              {appliedFilters.date
                ? `No telecallers joined on ${formatDisplayDate(appliedFilters.date)}`
                : 'No telecaller accounts found matching your filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}