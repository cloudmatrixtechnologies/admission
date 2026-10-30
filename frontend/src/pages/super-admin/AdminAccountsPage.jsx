import React, { useState } from 'react';
import './AdminAccounts.css';

export default function AdminAccountsPage({ setActivePage, onViewDetails, accounts = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const safeAccounts = Array.isArray(accounts) ? accounts : [];

  const filtered = safeAccounts.filter((acc) => {
    const name = acc?.name || '';
    const username = acc?.username || '';
    const assigned = acc?.assigned || '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assigned.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || acc?.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || acc?.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="aa-container">
      {/* Title & Top Action Button */}
      <div className="aa-header-row">
        <div>
          <h1 className="aa-title">Admin Accounts</h1>
          <p className="aa-breadcrumb">Admission Panel / Super Admin / Admin Accounts</p>
        </div>
        <button
          type="button"
          onClick={() => setActivePage && setActivePage('create-account')}
          className="aa-create-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>Create Admin Account</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="aa-filter-card">
        <div className="aa-search-box">
          <svg className="aa-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, username or assigned college..."
            className="aa-search-input"
          />
        </div>

        <div className="aa-filter-group">
          <span className="aa-filter-label">Account Type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="aa-select"
          >
            <option value="All">All</option>
            <option value="College Admin">College Admin</option>
            <option value="Consultation Admin">Consultation Admin</option>
          </select>
        </div>

        <div className="aa-filter-group">
          <span className="aa-filter-label">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="aa-select"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setTypeFilter('All');
            setStatusFilter('All');
          }}
          className="aa-reset-btn"
        >
          Reset
        </button>
      </div>

      {/* Accounts Table Container */}
      <div className="aa-table-card">
        <table className="aa-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>S.No</th>
              <th>Name</th>
              <th>Username</th>
              <th>Account Type</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Created On</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((acc, index) => (
                <tr key={acc.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px', paddingLeft: '24px', color: '#94a3b8' }}>{index + 1}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>{acc.name}</td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#64748b' }}>{acc.username}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: acc.type === 'College Admin' ? '#eff6ff' : '#faf5ff',
                      color: acc.type === 'College Admin' ? '#0066ff' : '#9333ea',
                    }}>
                      {acc.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#475569' }}>{acc.assigned}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: acc.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                      color: acc.status === 'Active' ? '#059669' : '#dc2626',
                    }}>
                      {acc.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#64748b' }}>{acc.created}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', paddingRight: '24px' }}>
                    <button
                      type="button"
                      onClick={() => onViewDetails && onViewDetails(acc)}
                      style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid #0066ff', background: '#eff6ff', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: '#0066ff' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="aa-empty-box">
                    <div className="aa-empty-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="aa-empty-title">No admin accounts created yet</p>
                    <p className="aa-empty-desc">
                      College Admin and Consultation Admin accounts will appear here once created or loaded from the backend APIs.
                    </p>
                    {/* Test link to view Ramesh Kumar sample details */}
                    <button
                      type="button"
                      onClick={() => onViewDetails && onViewDetails(null)}
                      style={{ marginTop: '8px', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '11px', fontWeight: 700, color: '#0066ff', cursor: 'pointer' }}
                    >
                      Preview Sample Account Details
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="aa-pagination">
          <span>Showing {filtered.length} to {filtered.length} of {safeAccounts.length} accounts</span>
        </div>
      </div>
    </div>
  );
}