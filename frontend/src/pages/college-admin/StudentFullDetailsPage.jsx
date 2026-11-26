import React, { useState } from 'react';
import './StudentFullDetailsPage.css';

export default function StudentFullDetailsPage({
  student,
  admittedLeads = [],
  onBack,
  onSelectStudent,
}) {
  const [showAdmittedTable, setShowAdmittedTable] = useState(false);

  if (!student) return null;

  // View after Accept: Admitted Leads Table matching the screenshot ("accept the leads after admitted")
  if (showAdmittedTable) {
    return (
      <div className="sfd-container">
        <div className="sfd-top-bar">
          <button
            type="button"
            onClick={() => setShowAdmittedTable(false)}
            className="sfd-back-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Student Full Details</span>
          </button>

          <button type="button" onClick={onBack} className="sfd-back-btn">
            <span>← All Leads</span>
          </button>
        </div>

        <div className="clp-table-card">
          <div
            style={{
              padding: '16px 22px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Admitted Leads
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Accepted applications marked as Admitted
              </p>
            </div>
            <span className="sfd-accepted-pill">
              {admittedLeads.length} Admitted
            </span>
          </div>

          <div className="clp-table-scroll">
            <table className="clp-table">
              <thead>
                <tr>
                  <th className="first">#</th>
                  <th>Student ID</th>
                  <th>10th Marks</th>
                  <th>12th Marks</th>
                  <th>Interested Courses</th>
                  <th className="center">Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admittedLeads.map((row, index) => (
                  <tr key={row.studentId}>
                    <td className="first">{index + 1}</td>
                    <td className="id-cell">{row.studentId}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.total10}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>({row.percentage10}%)</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.total12}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>({row.percentage12}%)</div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#334155' }}>
                      {row.allInterestedCourses.join(', ')}
                    </td>
                    <td className="center">
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '5px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          fontSize: '11.5px',
                          fontWeight: 700,
                        }}
                      >
                        Admitted
                      </span>
                    </td>
                    <td className="right">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdmittedTable(false);
                          if (onSelectStudent) onSelectStudent(row);
                        }}
                        className="clp-btn-view"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sfd-container">
      {/* Top Bar with Back & Admitted Leads View */}
      <div className="sfd-top-bar">
        <button type="button" onClick={onBack} className="sfd-back-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Leads</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowAdmittedTable(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            View Admitted Leads ({admittedLeads.length}) →
          </button>

          <span className="sfd-accepted-pill">Admitted</span>
        </div>
      </div>

      {/* Full Student Details Card */}
      <div className="sfd-card">
        <div className="sfd-card-header">
          <div className="sfd-header-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="sfd-header-title">Student Details</h2>
            <p className="sfd-header-sub">Complete information about the student application</p>
          </div>
        </div>

        <div className="sfd-body">
          {/* Student Profile & Contact Info Box */}
          <div className="sfd-profile-box">
            <div className="sfd-profile-top">
              <div className="sfd-identity">
                <div className="sfd-initials">{student.initials}</div>
                <div>
                  <h3 className="sfd-name">{student.name}</h3>
                  <p className="sfd-id">
                    Student ID: <strong>{student.studentId}</strong>
                  </p>
                </div>
              </div>

              <div className="sfd-date-badge">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <div>
                  <p className="sfd-date-lbl">Application Date</p>
                  <p className="sfd-date-val">{student.applicationDate}</p>
                </div>
              </div>
            </div>

            <div className="sfd-contact-grid">
              <div className="sfd-contact-item">
                <div>
                  <p className="sfd-contact-lbl">Mobile Number</p>
                  <p className="sfd-contact-val">{student.mobile}</p>
                </div>
              </div>

              <div className="sfd-contact-item">
                <div>
                  <p className="sfd-contact-lbl">Email ID</p>
                  <p className="sfd-contact-val">{student.email}</p>
                </div>
              </div>

              <div className="sfd-contact-item">
                <div>
                  <p className="sfd-contact-lbl">Date of Birth</p>
                  <p className="sfd-contact-val">{student.dob}</p>
                </div>
              </div>

              <div className="sfd-contact-item">
                <div>
                  <p className="sfd-contact-lbl">Gender</p>
                  <p className="sfd-contact-val">{student.gender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 10th & 12th Standard Marks Side-by-Side */}
          <div className="sfd-marks-grid">
            <div className="sfd-mark-card">
              <div className="sfd-mark-top">
                <h4 className="sfd-mark-title">10th Standard Marks</h4>
                <span className="sfd-mark-total">
                  Total: {student.total10} ({student.percentage10}%)
                </span>
              </div>
              <table className="sfd-mark-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Subject</th>
                    <th style={{ textAlign: 'right' }}>Marks (Out of 100)</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks10.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.subject}</td>
                      <td className="score">
                        {m.marks} / {m.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sfd-mark-card">
              <div className="sfd-mark-top">
                <h4 className="sfd-mark-title">12th Standard Marks</h4>
                <span className="sfd-mark-total">
                  Total: {student.total12} ({student.percentage12}%)
                </span>
              </div>
              <table className="sfd-mark-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Subject</th>
                    <th style={{ textAlign: 'right' }}>Marks (Out of 100)</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks12.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.subject}</td>
                      <td className="score">
                        {m.marks} / {m.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interested Courses */}
          <div className="sfd-box">
            <div className="sfd-box-header">
              <h4 className="sfd-box-title">Interested Courses</h4>
            </div>
            <div className="sfd-chips">
              {student.allInterestedCourses.map((c, idx) => (
                <span key={idx} className={`sfd-chip ${idx === 0 ? 'primary' : ''}`}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Other Certificates */}
          <div className="sfd-box">
            <div className="sfd-box-header">
              <h4 className="sfd-box-title">Other Certificates</h4>
              <span className="sfd-cert-badge">{student.certificates.length} Certificates</span>
            </div>

            {student.certificates.length > 0 ? (
              <div className="sfd-certs-grid">
                {student.certificates.map((cert, idx) => (
                  <div key={idx} className="sfd-cert-card">
                    <div className="sfd-cert-thumb">CERTIFICATE</div>
                    <div>
                      <h5 className="sfd-cert-name">
                        {cert.badge} {cert.title}
                      </h5>
                      <p className="sfd-cert-sub">{cert.subtitle}</p>
                      <p className="sfd-cert-meta">Issued by: {cert.issuedBy}</p>
                      <p className="sfd-cert-meta">Date: {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                No additional certificates uploaded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}