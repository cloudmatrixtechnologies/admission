import React, { useState } from 'react';
import './CollegeLeadsPage.css';
import StudentFullDetailsPage from './StudentFullDetailsPage';
import RejectedReRequestPage from './RejectedReRequestPage';

const INITIAL_LEADS_DATA = [
  {
    id: 1,
    studentId: 'STU-2026-0142',
    initials: 'AK',
    name: 'Arun Kumar',
    applicationDate: '16 Oct 2026',
    mobile: '98765 43210',
    email: 'arunkumar2005@gmail.com',
    dob: '16-07-2005',
    gender: 'Male',
    interestedCoursePrimary: 'B.E. Computer Science',
    allInterestedCourses: ['B.E. Computer Science'],
    total10: '452 / 500',
    percentage10: '90.4',
    total12: '556 / 600',
    percentage12: '92.7',
    status: 'Pending',
    reRequested: false,
    marks10: [
      { subject: 'Tamil', marks: 88, total: 100 },
      { subject: 'English', marks: 92, total: 100 },
      { subject: 'Mathematics', marks: 95, total: 100 },
      { subject: 'Science', marks: 90, total: 100 },
      { subject: 'Social Science', marks: 87, total: 100 },
    ],
    marks12: [
      { subject: 'Tamil', marks: 92, total: 100 },
      { subject: 'English', marks: 89, total: 100 },
      { subject: 'Physics', marks: 95, total: 100 },
      { subject: 'Chemistry', marks: 94, total: 100 },
      { subject: 'Mathematics', marks: 96, total: 100 },
      { subject: 'Computer Science', marks: 90, total: 100 },
    ],
    certificates: [
      {
        title: 'Sports Certificate',
        subtitle: 'District Level - Football',
        issuedBy: 'Salem District Association',
        date: '12 Jan 2024',
        badge: '🏆',
      },
      {
        title: 'NSS Certificate',
        subtitle: 'National Service Scheme',
        issuedBy: 'Anna University',
        date: '08 Mar 2024',
        badge: '🏅',
      },
      {
        title: 'Participation Certificate',
        subtitle: 'State Level - Technical Event',
        issuedBy: 'PSG College of Technology',
        date: '15 Sep 2023',
        badge: '🎖️',
      },
    ],
  },
  {
    id: 2,
    studentId: 'STU-2026-0158',
    initials: 'VR',
    name: 'Vignesh R',
    applicationDate: '15 Oct 2026',
    mobile: '98422 11223',
    email: 'vigneshr2005@gmail.com',
    dob: '22-04-2005',
    gender: 'Male',
    interestedCoursePrimary: 'B.E. ECE, B.E. CSE',
    allInterestedCourses: ['B.E. ECE', 'B.E. CSE'],
    total10: '430 / 500',
    percentage10: '86.0',
    total12: '510 / 600',
    percentage12: '85.0',
    status: 'Pending',
    reRequested: false,
    marks10: [
      { subject: 'Tamil', marks: 85, total: 100 },
      { subject: 'English', marks: 86, total: 100 },
      { subject: 'Mathematics', marks: 90, total: 100 },
      { subject: 'Science', marks: 85, total: 100 },
      { subject: 'Social Science', marks: 84, total: 100 },
    ],
    marks12: [
      { subject: 'Tamil', marks: 85, total: 100 },
      { subject: 'English', marks: 82, total: 100 },
      { subject: 'Physics', marks: 86, total: 100 },
      { subject: 'Chemistry', marks: 84, total: 100 },
      { subject: 'Mathematics', marks: 88, total: 100 },
      { subject: 'Computer Science', marks: 85, total: 100 },
    ],
    certificates: [],
  },
  {
    id: 3,
    studentId: 'STU-2026-0167',
    initials: 'KM',
    name: 'Kavya M',
    applicationDate: '14 Oct 2026',
    mobile: '97890 55443',
    email: 'kavyam2005@gmail.com',
    dob: '11-11-2005',
    gender: 'Female',
    interestedCoursePrimary: 'B.E. Mechanical',
    allInterestedCourses: ['B.E. Mechanical'],
    total10: '398 / 500',
    percentage10: '79.6',
    total12: '462 / 600',
    percentage12: '77.0',
    status: 'Pending',
    reRequested: false,
    marks10: [
      { subject: 'Tamil', marks: 80, total: 100 },
      { subject: 'English', marks: 78, total: 100 },
      { subject: 'Mathematics', marks: 82, total: 100 },
      { subject: 'Science', marks: 79, total: 100 },
      { subject: 'Social Science', marks: 79, total: 100 },
    ],
    marks12: [
      { subject: 'Tamil', marks: 78, total: 100 },
      { subject: 'English', marks: 76, total: 100 },
      { subject: 'Physics', marks: 77, total: 100 },
      { subject: 'Chemistry', marks: 75, total: 100 },
      { subject: 'Mathematics', marks: 80, total: 100 },
      { subject: 'Computer Science', marks: 76, total: 100 },
    ],
    certificates: [],
  },
  {
    id: 4,
    studentId: 'STU-2026-0184',
    initials: 'DS',
    name: 'Divya S',
    applicationDate: '14 Oct 2026',
    mobile: '95678 12345',
    email: 'divyas@gmail.com',
    dob: '05-03-2005',
    gender: 'Female',
    interestedCoursePrimary: 'B.E. Computer Science, B.E. IT',
    allInterestedCourses: ['B.E. Computer Science', 'B.E. IT'],
    total10: '468 / 500',
    percentage10: '93.6',
    total12: '572 / 600',
    percentage12: '95.3',
    status: 'Pending',
    reRequested: false,
    marks10: [
      { subject: 'Tamil', marks: 93, total: 100 },
      { subject: 'English', marks: 94, total: 100 },
      { subject: 'Mathematics', marks: 96, total: 100 },
      { subject: 'Science', marks: 93, total: 100 },
      { subject: 'Social Science', marks: 92, total: 100 },
    ],
    marks12: [
      { subject: 'Tamil', marks: 95, total: 100 },
      { subject: 'English', marks: 94, total: 100 },
      { subject: 'Physics', marks: 96, total: 100 },
      { subject: 'Chemistry', marks: 95, total: 100 },
      { subject: 'Mathematics', marks: 97, total: 100 },
      { subject: 'Computer Science', marks: 95, total: 100 },
    ],
    certificates: [],
  },
];

export default function CollegeLeadsPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewStudent, setPreviewStudent] = useState(null);
  const [acceptedStudentPage, setAcceptedStudentPage] = useState(null);
  const [openReRequestPage, setOpenReRequestPage] = useState(false);

  // Accept -> updates status to 'Admitted' & opens StudentFullDetailsPage
  const handleAcceptApplication = (student) => {
    const updatedStudent = { ...student, status: 'Admitted', reRequested: false };
    setLeads((prev) =>
      prev.map((item) => (item.id === student.id ? updatedStudent : item))
    );
    setPreviewStudent(null);
    setOpenReRequestPage(false);
    setAcceptedStudentPage(updatedStudent);
  };

  // Reject -> updates status to 'Rejected' & closes modal (NO full details page shown)
  const handleRejectApplication = (student) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === student.id ? { ...item, status: 'Rejected' } : item
      )
    );
    setPreviewStudent(null);
    setAcceptedStudentPage(null);
  };

  // Toggle Re-request flag on rejected lead
  const handleReRequestStudent = (studentId) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, reRequested: !item.reRequested }
          : item
      )
    );
  };

  const admittedLeads = leads.filter((item) => item.status === 'Admitted');
  const rejectedLeads = leads.filter((item) => item.status === 'Rejected');

  // 1. If Accept was clicked, render StudentFullDetailsPage
  if (acceptedStudentPage) {
    return (
      <StudentFullDetailsPage
        student={acceptedStudentPage}
        admittedLeads={admittedLeads}
        onBack={() => setAcceptedStudentPage(null)}
        onSelectStudent={(st) => setAcceptedStudentPage(st)}
      />
    );
  }

  // 2. If Re-request page was opened, render dedicated RejectedReRequestPage
  if (openReRequestPage) {
    return (
      <RejectedReRequestPage
        rejectedLeads={rejectedLeads}
        onBackToLeads={() => setOpenReRequestPage(false)}
        onReRequestStudent={handleReRequestStudent}
        onViewStudent={(st) => setPreviewStudent(st)}
      />
    );
  }

  const filteredLeads = leads.filter(
    (item) =>
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interestedCoursePrimary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clp-container">
      {/* Header & Search */}
      <div className="clp-header-row">
        <div>
          <h1 className="clp-title">Leads</h1>
          <p className="clp-subtitle">Manage and review student applications</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setOpenReRequestPage(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #fcd34d',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Re-request ({rejectedLeads.length}) →
          </button>

          <div className="clp-search-box">
            <svg
              className="clp-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Student ID..."
              className="clp-search-input"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="clp-table-card">
        <div className="clp-table-scroll">
          <table className="clp-table">
            <thead>
              <tr>
                <th className="first">#</th>
                <th>Student ID</th>
                <th>10th Marks</th>
                <th>12th Marks</th>
                <th>Interested Courses</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((row) => (
                <tr key={row.id}>
                  <td className="first">{row.id}</td>
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
                    {row.interestedCoursePrimary}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor:
                          row.status === 'Admitted'
                            ? '#16a34a'
                            : row.status === 'Rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          row.status === 'Admitted'
                            ? '#ffffff'
                            : row.status === 'Rejected'
                            ? '#b91c1c'
                            : '#b45309',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="right">
                    <button
                      type="button"
                      onClick={() => setPreviewStudent(row)}
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

      {/* ================= STAGE 1: STUDENT DETAILS MODAL ================= */}
      {previewStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setPreviewStudent(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue Header */}
            <div
              style={{
                backgroundColor: '#0066ff',
                color: '#ffffff',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Student Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewStudent(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  backgroundColor: '#f8fafc',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>
                    STUDENT ID
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '3px 0 0 0' }}>
                    {previewStudent.studentId}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>
                    INTERESTED COURSES
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: '4px 0 0 0' }}>
                    {previewStudent.interestedCoursePrimary}
                  </p>
                </div>
              </div>

              {/* 10th & 12th Marks Tables */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#0052cc', color: '#ffffff', fontSize: '12px', fontWeight: 700, padding: '10px 14px' }}>
                    10th Standard Marks
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '9px 14px', textAlign: 'left' }}>Subject</th>
                        <th style={{ padding: '9px 14px', textAlign: 'right' }}>Marks / Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewStudent.marks10.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 14px', color: '#334155' }}>{m.subject}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 700 }}>
                            {m.marks} / {m.total}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                        <td style={{ padding: '10px 14px' }}>Total: {previewStudent.total10}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#059669' }}>
                          Percentage: {previewStudent.percentage10}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#0052cc', color: '#ffffff', fontSize: '12px', fontWeight: 700, padding: '10px 14px' }}>
                    12th Standard Marks
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '9px 14px', textAlign: 'left' }}>Subject</th>
                        <th style={{ padding: '9px 14px', textAlign: 'right' }}>Marks / Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewStudent.marks12.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 14px', color: '#334155' }}>{m.subject}</td>
                          <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 700 }}>
                            {m.marks} / {m.total}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                        <td style={{ padding: '10px 14px' }}>Total: {previewStudent.total12}</td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#059669' }}>
                          Percentage: {previewStudent.percentage12}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Bottom Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreviewStudent(null)}
                  className="sdm-btn-close"
                >
                  ✕ Close
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleRejectApplication(previewStudent)}
                    className="clp-btn-reject"
                    style={{ padding: '9px 18px', fontSize: '12px' }}
                  >
                    ✕ Reject Application
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAcceptApplication(previewStudent)}
                    className="clp-btn-accept"
                    style={{ padding: '9px 18px', fontSize: '12px' }}
                  >
                    ✓ Accept Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}