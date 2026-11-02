import React, { useState } from 'react';

const DEFAULT_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', tenth: '85', twelfth: '88', status: 'Pending' },
  { id: 'AP-1002', name: 'Priya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: '78', twelfth: '82', status: 'Accepted' },
  { id: 'AP-1003', name: 'Vignesh R', college: 'LMN Engineering College', course: 'B.E. ECE', tenth: '92', twelfth: '90', status: 'Rejected' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', tenth: '88', twelfth: '91', status: 'Pending' },
  { id: 'AP-1005', name: 'Dinesh K', college: 'PQR Polytechnic', course: 'Diploma (ME)', tenth: '80', twelfth: '-', status: 'Pending' },
  { id: 'AP-1006', name: 'Divya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: '86', twelfth: '89', status: 'Accepted' },
  { id: 'AP-1007', name: 'Suresh R', college: 'LMN Engineering College', course: 'B.E. EEE', tenth: '74', twelfth: '80', status: 'In Progress' },
  { id: 'AP-1008', name: 'Hari Prasath', college: 'ABC Engineering College', course: 'B.Tech IT', tenth: '90', twelfth: '93', status: 'Pending' },
  { id: 'AP-1009', name: 'Keerthana S', college: 'XYZ Arts & Science College', course: 'B.Sc. IT', tenth: '82', twelfth: '85', status: 'Accepted' },
  { id: 'AP-1010', name: 'Manikandan K', college: 'PQR Polytechnic', course: 'Diploma (CE)', tenth: '76', twelfth: '79', status: 'Rejected' },
];

export default function AllLeadsPage() {
  const [leads] = useState(DEFAULT_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filtered = leads.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege =
      collegeFilter === 'All Colleges' || item.college === collegeFilter;

    const matchesCourse =
      courseFilter === 'All Courses' || item.course === courseFilter;

    const matchesStatus =
      statusFilter === 'All Status' || item.status === statusFilter;

    return matchesSearch && matchesCollege && matchesCourse && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return { bg: '#dcfce7', color: '#15803d' };
      case 'Rejected':
        return { bg: '#fee2e2', color: '#b91c1c' };
      case 'In Progress':
        return { bg: '#dbeafe', color: '#1d4ed8' };
      default:
        return { bg: '#fef3c7', color: '#b45309' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>All Leads</h1>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: '4px 0 0 0' }}>Admission Panel / Manager Admin / All Leads</p>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Total Leads</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#0066ff', margin: '4px 0 0 0' }}>1,248</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>New Leads</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#10b981', margin: '4px 0 0 0' }}>318</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>In Progress</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#f59e0b', margin: '4px 0 0 0' }}>362</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: 0 }}>Converted</p>
            <h3 style={{ fontSize: '30px', fontWeight: 900, color: '#8b5cf6', margin: '4px 0 0 0' }}>568</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 18px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or Personal ID..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', outline: 'none' }}
          />
        </div>

        <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569', background: '#fff', outline: 'none' }}>
          <option>All Colleges</option>
          <option>ABC Engineering College</option>
          <option>XYZ Arts & Science College</option>
          <option>LMN Engineering College</option>
          <option>PQR Polytechnic</option>
        </select>

        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569', background: '#fff', outline: 'none' }}>
          <option>All Courses</option>
          <option>B.E. CSE</option>
          <option>B.Sc. CS</option>
          <option>B.E. ECE</option>
          <option>B.E. AI & DS</option>
          <option>B.Tech IT</option>
          <option>Diploma (ME)</option>
          <option>Diploma (CE)</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#475569', background: '#fff', outline: 'none' }}>
          <option>All Status</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Rejected</option>
          <option>In Progress</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setCollegeFilter('All Colleges');
            setCourseFilter('All Courses');
            setStatusFilter('All Status');
          }}
          style={{ backgroundColor: '#ffffff', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '9px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      {/* Leads Table Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px 18px', paddingLeft: '24px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Personal ID</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Student Name</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Selected College</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Course</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>10th (%)</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>12th (%)</th>
              <th style={{ padding: '14px 18px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', paddingRight: '24px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const badge = getStatusBadge(lead.status);
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '13px 18px', paddingLeft: '24px', fontWeight: 800, color: '#0f172a' }}>{lead.id}</td>
                  <td style={{ padding: '13px 18px', fontWeight: 700, color: '#1e293b' }}>{lead.name}</td>
                  <td style={{ padding: '13px 18px', color: '#64748b' }}>{lead.college}</td>
                  <td style={{ padding: '13px 18px', fontWeight: 600, color: '#334155' }}>{lead.course}</td>
                  <td style={{ padding: '13px 18px', color: '#334155' }}>{lead.tenth}%</td>
                  <td style={{ padding: '13px 18px', color: '#334155' }}>{lead.twelfth === '-' ? '-' : `${lead.twelfth}%`}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: badge.bg, color: badge.color }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 18px', textAlign: 'right', paddingRight: '24px' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Viewing lead: ${lead.name} (${lead.id})`)}
                      style={{ padding: '4px 12px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#0066ff', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
          <span>Showing 1 to {filtered.length} of 1,248 leads</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>&lt;</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: '#0066ff', color: '#fff', fontWeight: 700 }}>1</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>2</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>3</button>
            <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>125</button>
            <button style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}