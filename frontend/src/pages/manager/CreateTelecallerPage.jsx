import React, { useState, useEffect } from 'react';
import './CreateTelecaller.css';

// Initial Mock Records matching Screenshot 3
const INITIAL_TELECALLERS = [
  { sNo: 1, name: 'Keerthana', email: 'keerthana@company.com', mobile: '9876543210', username: 'keerthana01', status: 'Active', date: '10 Oct 2026' },
  { sNo: 2, name: 'Manikandan', email: 'manikandan@company.com', mobile: '9786543211', username: 'mani02', status: 'Active', date: '09 Oct 2026' },
  { sNo: 3, name: 'Divya', email: 'divya@company.com', mobile: '9123456789', username: 'divya03', status: 'Active', date: '09 Oct 2026' },
  { sNo: 4, name: 'Suresh', email: 'suresh@company.com', mobile: '9876501234', username: 'suresh04', status: 'Inactive', date: '08 Oct 2026' },
  { sNo: 5, name: 'Hari', email: 'hari@company.com', mobile: '9843216780', username: 'hari05', status: 'Active', date: '08 Oct 2026' },
];

export default function CreateTelecallerPage() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('Active');

  // Permissions State (Screenshot 3 exact list)
  const [permissions, setPermissions] = useState({
    viewAssignedLeads: true,
    viewStudentDetails: true,
    updateCallOutcomes: true,
    scheduleFollowups: true,
    addCallNotes: true,
    downloadReports: false,
  });

  // Table & Filter State
  const [telecallers, setTelecallers] = useState(INITIAL_TELECALLERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================================
  // BACKEND API INTEGRATION PLACEHOLDER
  // Backend endpoints ready aagumbodhu uncomment pannikalam
  // =========================================================================
  /*
  useEffect(() => {
    const fetchTelecallers = async () => {
      try {
        setIsLoading(true);
        // const res = await fetch('/api/admin/manager/telecallers');
        // const data = await res.json();
        // setTelecallers(data);
      } catch (err) {
        console.error('Failed to fetch telecallers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTelecallers();
  }, []);
  */

  const handleClear = () => {
    setFullName('');
    setEmail('');
    setMobile('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setStatus('Active');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !mobile || !username || !password) {
      alert('Please fill in all mandatory fields!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // New Telecaller Payload
    const newTelecallerPayload = {
      name: fullName,
      email: email,
      mobile: mobile,
      username: username,
      password: password,
      status: status,
      permissions: permissions,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    // =======================================================================
    // 1. BACKEND POST CALL (Uncomment when Dilep/Shreya endpoint is active)
    // =======================================================================
    /*
    try {
      const res = await fetch('/api/admin/manager/telecallers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTelecallerPayload),
      });
      const savedData = await res.json();
      // setTelecallers((prev) => [savedData, ...prev]);
    } catch (err) {
      console.error(err);
    }
    */

    // 2. REAL-TIME LOCAL UPDATE (Instant UI reflection)
    const newAccount = {
      sNo: telecallers.length + 1,
      name: fullName,
      email: email,
      mobile: mobile,
      username: username,
      status: status,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setTelecallers((prev) => [newAccount, ...prev]);
    alert(`Telecaller account "${fullName}" created successfully!`);
    handleClear();
  };

  // Delete Action Handler
  const handleDelete = (sNo) => {
    if (window.confirm('Are you sure you want to delete this telecaller?')) {
      setTelecallers((prev) => prev.filter((item) => item.sNo !== sNo));
    }
  };

  // Filter Logic
  const filteredTelecallers = telecallers.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ct-container">
      {/* Title & Breadcrumb (Screenshot 3 exact match) */}
      <div>
        <h1 className="ct-title">Create Telecaller Account</h1>
        <p className="ct-breadcrumb">Admission Panel / Manager Admin / Create Telecaller</p>
      </div>

      {/* Top 2-Column Grid: Left Forms + Right Permissions */}
      <form onSubmit={handleSubmit} className="ct-form-grid">
        {/* Left Card: Basic Details & Login Credentials */}
        <div className="ct-card">
          <div>
            {/* Section 1: Basic Details */}
            <h2 className="ct-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6m3-3h-6" />
              </svg>
              <span>Basic Details</span>
            </h2>

            <div className="ct-grid-3">
              <div>
                <label className="ct-label">Full Name *</label>
                <div className="ct-input-wrap">
                  <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter telecaller full name"
                    className="ct-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ct-label">Email ID *</label>
                <div className="ct-input-wrap">
                  <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="telecaller@company.com"
                    className="ct-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="ct-label">Mobile Number *</label>
                <div className="ct-input-wrap">
                  <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    className="ct-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Login Credentials */}
            <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
              <h2 className="ct-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Login Credentials</span>
              </h2>

              <div className="ct-grid-3">
                <div>
                  <label className="ct-label">Username *</label>
                  <div className="ct-input-wrap">
                    <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Create username"
                      className="ct-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="ct-label">Temporary Password *</label>
                  <div className="ct-input-wrap">
                    <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create temporary password"
                      className="ct-input"
                      style={{ paddingRight: '36px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ct-toggle-eye"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="ct-label">Confirm Password *</label>
                  <div className="ct-input-wrap">
                    <svg className="ct-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="ct-input"
                      style={{ paddingRight: '36px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="ct-toggle-eye"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Radio Tiles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '18px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                <span>Account Status</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="statusRadio"
                    checked={status === 'Active'}
                    onChange={() => setStatus('Active')}
                    style={{ accentColor: '#0066ff' }}
                  />
                  <span>Active</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="statusRadio"
                    checked={status === 'Inactive'}
                    onChange={() => setStatus('Inactive')}
                    style={{ accentColor: '#0066ff' }}
                  />
                  <span>Inactive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Access Permissions */}
        <div className="ct-card">
          <div>
            <h2 className="ct-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Access Permissions</span>
            </h2>

            <div className="ct-perm-notice">
              Select the permissions for this telecaller account.
            </div>

            <div className="ct-perm-list">
              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.viewAssignedLeads}
                  onChange={(e) => setPermissions({ ...permissions, viewAssignedLeads: e.target.checked })}
                />
                <span>View Assigned Leads</span>
              </label>

              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.viewStudentDetails}
                  onChange={(e) => setPermissions({ ...permissions, viewStudentDetails: e.target.checked })}
                />
                <span>View Student Details (Assigned)</span>
              </label>

              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.updateCallOutcomes}
                  onChange={(e) => setPermissions({ ...permissions, updateCallOutcomes: e.target.checked })}
                />
                <span>Update Call Outcomes</span>
              </label>

              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.scheduleFollowups}
                  onChange={(e) => setPermissions({ ...permissions, scheduleFollowups: e.target.checked })}
                />
                <span>Schedule Follow-ups</span>
              </label>

              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.addCallNotes}
                  onChange={(e) => setPermissions({ ...permissions, addCallNotes: e.target.checked })}
                />
                <span>Add Call Notes</span>
              </label>

              <label className="ct-perm-item">
                <input
                  type="checkbox"
                  checked={permissions.downloadReports}
                  onChange={(e) => setPermissions({ ...permissions, downloadReports: e.target.checked })}
                />
                <span>Download Reports</span>
              </label>
            </div>
          </div>

          <div className="ct-actions-row">
            <button type="button" onClick={handleClear} className="ct-btn-clear">
              Clear Form
            </button>
            <button type="submit" className="ct-btn-submit">
              Create Account
            </button>
          </div>
        </div>
      </form>

      {/* Bottom Table: Telecaller Accounts (Screenshot 3 exact match) */}
      <div className="ct-table-card">
        <div className="ct-table-header">
          <div className="ct-table-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Telecaller Accounts</span>
          </div>

          <div className="ct-table-filters">
            <div className="ct-table-search">
              <svg className="ct-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or username..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ct-table-select"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <table className="ct-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '24px' }}>S.No</th>
              <th>Name</th>
              <th>Email ID</th>
              <th>Mobile Number</th>
              <th>Username</th>
              <th>Status</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTelecallers.length > 0 ? (
              filteredTelecallers.map((a, index) => (
                <tr key={a.username || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px', paddingLeft: '24px', color: '#94a3b8' }}>{index + 1}</td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>{a.name}</td>
                  <td style={{ padding: '14px 18px', color: '#64748b' }}>{a.email}</td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#0f172a' }}>{a.mobile}</td>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#64748b' }}>{a.username}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: a.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                        color: a.status === 'Active' ? '#059669' : '#dc2626',
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#64748b' }}>{a.date}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right', paddingRight: '24px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0066ff' }}>
                      <button
                        type="button"
                        title="View Details"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0066ff', padding: '2px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Edit Telecaller"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0066ff', padding: '2px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.sNo)}
                        title="Delete Telecaller"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}
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
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No telecaller accounts match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}