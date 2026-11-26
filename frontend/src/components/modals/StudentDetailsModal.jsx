import React from 'react';
import './StudentDetailsModal.css';

export default function StudentDetailsModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  return (
    <div className="sdm-overlay" onClick={onClose}>
      <div className="sdm-card" onClick={(e) => e.stopPropagation()}>
        {/* Blue Header (Screenshot 12) */}
        <div className="sdm-header">
          <div className="sdm-header-left">
            <div className="sdm-avatar-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="sdm-title">Student Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sdm-header-close"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="sdm-body">
          {/* Top Info Bar */}
          <div className="sdm-top-info">
            <div>
              <p className="sdm-info-lbl">Student ID</p>
              <p className="sdm-info-val-id">{student.studentId}</p>
            </div>
            <div>
              <p className="sdm-info-lbl">Interested Courses</p>
              <p className="sdm-info-val-course">{student.interestedCoursePrimary}</p>
            </div>
          </div>

          {/* Marks Grid: 10th and 12th side-by-side */}
          <div className="sdm-marks-grid">
            {/* 10th Standard Marks Card */}
            <div className="sdm-mark-box">
              <div className="sdm-mark-box-header">10th Standard Marks</div>
              <table className="sdm-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Subject</th>
                    <th style={{ textAlign: 'right' }}>Marks / Total</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks10.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.subject}</td>
                      <td className="mark-val">
                        {row.marks} / {row.total}
                      </td>
                    </tr>
                  ))}
                  <tr className="sdm-total-row">
                    <td>Total: {student.total10}</td>
                    <td className="pct-val">Percentage: {student.percentage10}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 12th Standard Marks Card */}
            <div className="sdm-mark-box">
              <div className="sdm-mark-box-header">12th Standard Marks</div>
              <table className="sdm-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Subject</th>
                    <th style={{ textAlign: 'right' }}>Marks / Total</th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks12.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.subject}</td>
                      <td className="mark-val">
                        {row.marks} / {row.total}
                      </td>
                    </tr>
                  ))}
                  <tr className="sdm-total-row">
                    <td>Total: {student.total12}</td>
                    <td className="pct-val">Percentage: {student.percentage12}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interested Courses Badges */}
          <div>
            <div className="sdm-courses-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Interested Courses</span>
            </div>
            <div className="sdm-badges-list">
              {student.allInterestedCourses.map((c, i) => (
                <span
                  key={i}
                  className={`sdm-course-pill ${i === 0 ? 'primary' : ''}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="sdm-footer">
            <button type="button" onClick={onClose} className="sdm-close-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}