import React, { useState } from 'react';
import './MemberAccountsPage.css';

export default function MemberAccountsPage() {
  const [members, setMembers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !tempPassword.trim()) return;

    const newMember = {
      id: Date.now(),
      name: fullName.trim(),
      role: role || 'Staff Member',
      username: username.trim(),
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setMembers((prev) => [newMember, ...prev]);
    setFullName('');
    setRole('');
    setUsername('');
    setTempPassword('');
  };

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <div className="map-container">
      {/* Page Title */}
      <div className="map-header">
        <h1 className="map-title">Member Accounts</h1>
        <p className="map-subtitle">
          Create username and temporary password for staff under this College Admin.
        </p>
      </div>

      <div className="map-grid">
        {/* Left Section: Create Member Login Form */}
        <div className="map-card">
          <h2 className="map-card-title">Create Member Login</h2>

          <form onSubmit={handleCreate} className="map-form">
            <div className="map-field">
              <label className="map-label">
                Member Full Name <span className="map-req">*</span>
              </label>
              <input
                type="text"
                className="map-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter member name"
                required
              />
            </div>

            <div className="map-field">
              <label className="map-label">Member Role</label>
              <select
                className="map-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select member role</option>
                <option value="Admission Officer">Admission Officer</option>
                <option value="Department Coordinator">Department Coordinator</option>
                <option value="Verification Staff">Verification Staff</option>
              </select>
            </div>

            <div className="map-field">
              <label className="map-label">
                Username <span className="map-req">*</span>
              </label>
              <input
                type="text"
                className="map-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Create username"
                required
              />
            </div>

            <div className="map-field">
              <label className="map-label">
                Temporary Password <span className="map-req">*</span>
              </label>
              <input
                type="text"
                className="map-input"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <button type="submit" className="map-submit-btn">
              <span>👤+</span>
              <span>Create Username &amp; Password</span>
            </button>

            <p className="map-note">
              Production note: passwords must be securely hashed and permissions enforced on the
              backend.
            </p>
          </form>
        </div>

        {/* Right Section: Existing Members & Account Permissions */}
        <div className="map-right-col">
          <div className="map-card map-existing-card">
            <h3 className="map-card-title">Existing Members</h3>

            {members.length === 0 ? (
              <div className="map-empty-state">
                <div className="map-empty-icon">👥</div>
                <p className="map-empty-count">0</p>
                <p className="map-empty-text">Created member accounts appear here.</p>
              </div>
            ) : (
              <div className="map-members-list">
                {members.map((member) => (
                  <div key={member.id} className="map-member-item">
                    <div>
                      <p className="map-member-name">{member.name}</p>
                      <p className="map-member-meta">
                        @{member.username} •{' '}
                        <span className="map-member-role">{member.role}</span> • {member.createdAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className="map-del-btn"
                      title="Delete member"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="map-card">
            <h3 className="map-card-title" style={{ marginBottom: '10px' }}>
              Account Permissions
            </h3>
            <div className="map-perm-box">
              <span className="map-perm-badge">i</span>
              <p className="map-perm-text">
                Member access should be restricted according to the assigned role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}