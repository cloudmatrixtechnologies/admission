import React, { useState, useEffect } from 'react';
import './ManageTelecallers.css';

// Initial Mock Data matching Source 6
const INITIAL_TELECALLERS = [
  { sNo: 1, name: 'Keerthana', email: 'keerthana@company.com', mobile: '9876543210', username: 'keerthana01', status: 'Active', assigned: 80, date: '10 Oct 2026' },
  { sNo: 2, name: 'Manikandan', email: 'manikandan@company.com', mobile: '9786543211', username: 'mani02', status: 'Active', assigned: 72, date: '09 Oct 2026' },
  { sNo: 3, name: 'Divya', email: 'divya@company.com', mobile: '9123456789', username: 'divya03', status: 'Active', assigned: 64, date: '09 Oct 2026' },
  { sNo: 4, name: 'Suresh', email: 'suresh@company.com', mobile: '9876501234', username: 'suresh04', status: 'Inactive', assigned: 58, date: '08 Oct 2026' },
  { sNo: 5, name: 'Hari', email: 'hari@company.com', mobile: '9843216780', username: 'hari05', status: 'Active', assigned: 52, date: '08 Oct 2026' },
  { sNo: 6, name: 'Priya', email: 'priya@company.com', mobile: '9567812345', username: 'priya06', status: 'Active', assigned: 46, date: '07 Oct 2026' },
  { sNo: 7, name: 'Arun', email: 'arun@company.com', mobile: '9023456781', username: 'arun07', status: 'Active', assigned: 40, date: '07 Oct 2026' },
  { sNo: 8, name: 'Vignesh', email: 'vignesh@company.com', mobile: '9156784321', username: 'vignesh08', status: 'Inactive', assigned: 36, date: '06 Oct 2026' },
];

export default function ManageTelecallersPage({ onNavigateCreate }) {
  const [telecallers, setTelecallers] = useState(INITIAL_TELECALLERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================================
  // BACKEND API INTEGRATION
  // Backend live aana udane intha hook real records fetch seiyum
  // =========================================================================
  useEffect(() => {
    const fetchRealTelecallers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/manager/telecallers');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTelecallers(data);
          }
        }
      } catch (err) {
        // Fallback to local dummy data if backend is not yet reachable
        console.warn('Backend not ready, rendering default telecaller records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealTelecallers();
  }, []);

  const handleDelete = (sNo, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setTelecallers((prev) => prev.filter((item) => item.sNo !== sNo));
    }
  };

  const filtered = telecallers.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-container">
      {/* Top Header & Create Button */}
      <div className="mt-header-row">
        <div>
          <h1 className="mt-title">Manage Telecallers</h1>
          <p className="mt-breadcrumb">Admission Panel / Manager Admin / Manage Telecallers</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateCreate && onNavigateCreate()}
          className="mt-create-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Create Telecaller</span>
        </button>
      </div>

      {/* Filter Row matching Source 6 */}
      <div className="mt-filter-card">
        <div className="mt-search-box">
          <svg className="mt-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or username..."
            className="mt-search-input"
          />
        </div>

        <div className="mt-filter-group">
          <span className="mt-filter-label">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-select"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-filter-group">
          <span className="mt-filter-label">Joining Date</span>
          <button type="button" className="mt-date-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>Select Date Range</span>
          </button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button type="button" className="mt-btn-apply">
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
            }}
            className="mt-btn-reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Telecaller Accounts Table Card */}
      <div className="mt-table-card">
        <div className="mt-table-header">
          <div className="mt-table-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Telecaller Accounts</span>
          </div>
          <button type="button" className="mt-export-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </button>
        </div>

        <table className="mt-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>S.No</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Mobile Number</th>
              <th>Username</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Assigned Leads</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t, index) => (
                <tr key={t.username || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px', paddingLeft: '24px', color: '#94a3b8' }}>{t.sNo || index + 1}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a' }}>{t.name}</td>
                  <td style={{ padding: '14px 18px', color: '#64748b' }}>{t.email}</td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#0f172a' }}>{t.mobile}</td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#64748b' }}>{t.username}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: t.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                        color: t.status === 'Active' ? '#059669' : '#dc2626',
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 800, color: '#0f172a' }}>
                    {t.assigned}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#64748b' }}>{t.date}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', paddingRight: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        title="View Details"
                        className="mt-action-icon view"
                        onClick={() => alert(`View details of ${t.name}`)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Edit Telecaller"
                        className="mt-action-icon edit"
                        onClick={() => alert(`Edit ${t.name}`)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Delete Telecaller"
                        className="mt-action-icon delete"
                        onClick={() => handleDelete(t.sNo, t.name)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No telecaller accounts found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer Pagination matching Source 6 */}
        <div className="mt-pagination">
          <span>Showing 1 to {filtered.length} of {telecallers.length} telecallers</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              disabled
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#94a3b8',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &lt;
            </button>
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: 'none',
                background: '#0066ff',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              1
            </button>
            <button
              disabled
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#94a3b8',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}