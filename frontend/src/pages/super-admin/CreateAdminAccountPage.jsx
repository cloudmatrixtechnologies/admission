import React, { useState } from 'react';
import './AdminAccounts.css';

export default function CreateAdminAccountPage({ onBack, onAccountCreated }) {
  const [accountType, setAccountType] = useState('College Admin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('PM7@kL9#');
  const [assignedInstitution, setAssignedInstitution] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [permissions, setPermissions] = useState({
    viewLeads: true,
    manageApplications: true,
    updateStatus: true,
    manageCollegeDetails: true,
    accessReports: true,
    manageOtherAdmins: false,
  });

  const generateNewPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTemporaryPassword(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !username || !assignedInstitution) {
      alert('Please fill all mandatory fields!');
      return;
    }

    const newAccount = {
      id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      username: username,
      email: email,
      type: accountType,
      assigned: assignedInstitution,
      status: isActive ? 'Active' : 'Inactive',
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 11:30 AM',
      lastLogin: 'Never logged in',
      permissions: permissions,
    };

    if (onAccountCreated) {
      onAccountCreated(newAccount); // Passes newly created account and triggers AdminAccountDetailsPage
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1000px' }}>
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
        <h1 className="aa-title">Create Admin Account</h1>
        <p className="aa-breadcrumb">
          Admission Panel / Super Admin / Admin Accounts / Create Admin Account
        </p>
      </div>

      <div className="ca-card">
        <div className="ca-header">
          <div className="ca-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Account Details</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Create a new login account for College Admin or Consultation Admin[cite: 8].
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '12px' }}>
          <div>
            <label className="ca-label">Account Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <label
                onClick={() => setAccountType('College Admin')}
                className="ca-radio-tile"
                style={{
                  border: accountType === 'College Admin' ? '1.5px solid #0066ff' : '1.5px solid #e2e8f0',
                  backgroundColor: accountType === 'College Admin' ? '#f0f7ff' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="accType"
                  checked={accountType === 'College Admin'}
                  onChange={() => setAccountType('College Admin')}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '12px' }}>College Admin</p>
                  <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '11px' }}>Manage college admissions and applications[cite: 8].</p>
                </div>
              </label>

              <label
                onClick={() => setAccountType('Consultation Admin')}
                className="ca-radio-tile"
                style={{
                  border: accountType === 'Consultation Admin' ? '1.5px solid #0066ff' : '1.5px solid #e2e8f0',
                  backgroundColor: accountType === 'Consultation Admin' ? '#f0f7ff' : '#ffffff',
                }}
              >
                <input
                  type="radio"
                  name="accType"
                  checked={accountType === 'Consultation Admin'}
                  onChange={() => setAccountType('Consultation Admin')}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '12px' }}>Consultation Admin</p>
                  <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '11px' }}>Manage consultancy leads and student guidance[cite: 8].</p>
                </div>
              </label>
            </div>
          </div>

          <div className="ca-grid-2">
            <div>
              <label className="ca-label">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                required
                className="ca-input"
              />
            </div>
            <div>
              <label className="ca-label">Email ID *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="ca-input"
              />
            </div>
          </div>

          <div className="ca-grid-2">
            <div>
              <label className="ca-label">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="ca-input"
              />
              <p style={{ margin: '4px 0 0 2px', fontSize: '10px', color: '#94a3b8' }}>Only letters, numbers and underscore allowed[cite: 8].</p>
            </div>
            <div>
              <label className="ca-label">Temporary Password *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  readOnly
                  value={temporaryPassword}
                  className="ca-input"
                  style={{ backgroundColor: '#f8fafc', paddingRight: '40px', fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={generateNewPassword}
                  title="Generate new temporary password"
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                </button>
              </div>
              <p style={{ margin: '4px 0 0 2px', fontSize: '10px', color: '#0066ff' }}>You can change the password or generate a new one[cite: 8].</p>
            </div>
          </div>

          <div className="ca-grid-2" style={{ alignItems: 'center' }}>
            <div>
              <label className="ca-label">Assign College / Consultancy *</label>
              <select
                value={assignedInstitution}
                onChange={(e) => setAssignedInstitution(e.target.value)}
                required
                className="ca-input"
              >
                <option value="">Select college / consultancy</option>
                <option value="ABC Engineering College">ABC Engineering College</option>
                <option value="XYZ Educational Consultancy">XYZ Educational Consultancy</option>
                <option value="LMN Engineering College">LMN Engineering College</option>
              </select>
            </div>
            <div>
              <label className="ca-label">Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  style={{
                    width: '42px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#0066ff' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '2px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      transform: isActive ? 'translateX(18px)' : 'translateX(0)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={onBack}
              style={{ padding: '10px 18px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#0066ff', color: '#ffffff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,102,255,0.25)' }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}