import React from 'react';
import './AdminAccounts.css';

export default function AdminAccountDetailsPage({ account, onBack, onEdit }) {
  // Default values if no dynamic account is passed yet
  const data = account || {
    name: 'Ramesh Kumar',
    username: 'ramesh_col',
    type: 'College Admin',
    id: 'ADM-1001',
    email: 'ramesh@abcollege.edu.in',
    assigned: 'ABC Engineering College',
    created: '10 Oct 2026, 11:30 AM',
    lastLogin: '16 Oct 2026, 04:20 PM',
    status: 'Active',
    permissions: {
      viewLeads: true,
      manageApplications: true,
      updateStatus: true,
      manageCollegeDetails: true,
      accessReports: true,
      manageOtherAdmins: false,
    },
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="aa-container" style={{ maxWidth: '1100px' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#0066ff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '8px',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Admin Accounts</span>
          </button>
          <h1 className="aa-title">Admin Account Details</h1>
          <p className="aa-breadcrumb">
            Admission Panel / Super Admin / Admin Accounts / Admin Details
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit && onEdit(data)}
          style={{
            backgroundColor: '#0066ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 102, 255, 0.25)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit Account</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#e0edff',
              color: '#0066ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '19px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            {getInitials(data.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {data.name}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, margin: '4px 0 0 0' }}>
              {data.type} <span style={{ color: '#cbd5e1', margin: '0 6px' }}>•</span> {data.id || 'ADM-1001'}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: data.status === 'Active' ? '#ecfdf5' : '#fef2f2',
              color: data.status === 'Active' ? '#059669' : '#dc2626',
            }}
          >
            {data.status || 'Active'}
          </span>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0 0', fontWeight: 500 }}>
            Created on: {data.created}
          </p>
        </div>
      </div>

      {/* Account Information Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{ color: '#0066ff', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Account Information
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px 20px', fontSize: '12px' }}>
          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Full Name</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{data.name}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Username</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0, fontFamily: 'monospace' }}>{data.username}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Account Type</p>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                color: '#0066ff',
              }}
            >
              {data.type}
            </span>
          </div>

          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Email ID</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{data.email}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Created On</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{data.created}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Last Login</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{data.lastLogin || '16 Oct 2026, 04:20 PM'}</p>
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <p style={{ color: '#94a3b8', fontWeight: 600, margin: '0 0 5px 0' }}>Assigned College</p>
            <p style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>{data.assigned}</p>
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ color: '#0066ff', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Permissions
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px 24px', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.viewLeads ?? true} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span>View Leads</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.manageCollegeDetails ?? true} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span>Manage College Details</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.manageApplications ?? true} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span>Manage Applications</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.accessReports ?? true} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span>Access Reports</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.updateStatus ?? true} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span>Update Application Status</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={data.permissions?.manageOtherAdmins ?? false} readOnly style={{ accentColor: '#0066ff', width: '15px', height: '15px' }} />
            <span style={{ color: '#94a3b8' }}>Manage Other Admins</span>
          </div>
        </div>
      </div>

      {/* Account Status Footer Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#0066ff', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Account Status</h4>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0' }}>
              This admin can sign in to the assigned college portal and manage the allotted features.
            </p>
          </div>
        </div>

        <span
          style={{
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#ecfdf5',
            color: '#059669',
          }}
        >
          {data.status || 'Active'}
        </span>
      </div>
    </div>
  );
}