import React, { useState, useEffect } from 'react';
import './AssignLeads.css';

// Initial Mock Unassigned / Assigned Leads
const INITIAL_LEADS = [
  { id: 'AP-1001', name: 'Arun Kumar', college: 'ABC Engineering College', course: 'B.E. CSE', tenth: 85, twelfth: 88, assignedTo: 'Unassigned', status: 'Pending' },
  { id: 'AP-1002', name: 'Priya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: 78, twelfth: 82, assignedTo: 'Keerthana', status: 'Assigned' },
  { id: 'AP-1003', name: 'Vignesh R', college: 'LMN Engineering College', course: 'B.E. ECE', tenth: 92, twelfth: 90, assignedTo: 'Unassigned', status: 'Pending' },
  { id: 'AP-1004', name: 'Kavya M', college: 'ABC Engineering College', course: 'B.E. AI & DS', tenth: 88, twelfth: 91, assignedTo: 'Unassigned', status: 'Pending' },
  { id: 'AP-1005', name: 'Dinesh K', college: 'PQR Polytechnic', course: 'Diploma (ME)', tenth: 80, twelfth: 84, assignedTo: 'Unassigned', status: 'Pending' },
  { id: 'AP-1006', name: 'Divya S', college: 'XYZ Arts & Science College', course: 'B.Sc. CS', tenth: 86, twelfth: 89, assignedTo: 'Manikandan', status: 'Assigned' },
  { id: 'AP-1007', name: 'Suresh R', college: 'LMN Engineering College', course: 'B.E. EEE', tenth: 74, twelfth: 80, assignedTo: 'Unassigned', status: 'Pending' },
  { id: 'AP-1008', name: 'Hari Prasath', college: 'ABC Engineering College', course: 'B.Tech IT', tenth: 90, twelfth: 93, assignedTo: 'Unassigned', status: 'Pending' },
];

const TELECALLER_OPTIONS = [
  { id: 'TC-01', name: 'Keerthana (keerthana01)', activeLeads: 48 },
  { id: 'TC-02', name: 'Manikandan (mani02)', activeLeads: 52 },
  { id: 'TC-03', name: 'Divya (divya03)', activeLeads: 46 },
  { id: 'TC-04', name: 'Hari (hari05)', activeLeads: 44 },
  { id: 'TC-05', name: 'Priya (priya06)', activeLeads: 40 },
];

export default function AssignLeadsPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [selectedTelecaller, setSelectedTelecaller] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');

  // =========================================================================
  // BACKEND API INTEGRATION
  // Uncomment when /api/admin/manager/leads/unassigned is live
  // =========================================================================
  useEffect(() => {
    const fetchUnassignedLeads = async () => {
      try {
        const res = await fetch('/api/admin/manager/leads/unassigned');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setLeads(data);
        }
      } catch (err) {
        console.warn('Backend not ready, rendering initial mock leads for assignment.');
      }
    };
    fetchUnassignedLeads();
  }, []);

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege =
      collegeFilter === 'All Colleges' || lead.college === collegeFilter;

    const matchesAssignment =
      assignmentFilter === 'All'
        ? true
        : assignmentFilter === 'Unassigned'
        ? lead.assignedTo === 'Unassigned'
        : lead.assignedTo !== 'Unassigned';

    return matchesSearch && matchesCollege && matchesAssignment;
  });

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = filteredLeads.map((item) => item.id);
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  // Assign leads action
  const handleAssignSubmit = async () => {
    if (selectedLeadIds.length === 0) {
      alert('Please select at least one lead to assign!');
      return;
    }
    if (!selectedTelecaller) {
      alert('Please select a telecaller from the dropdown!');
      return;
    }

    const telecallerName = selectedTelecaller.split(' (')[0];

    // Optional: Backend POST API payload
    /*
    try {
      await fetch('/api/admin/manager/leads/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeadIds,
          telecaller: telecallerName
        })
      });
    } catch(err) {
      console.error(err);
    }
    */

    // Real-time Local UI State Update
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (selectedLeadIds.includes(lead.id)) {
          return {
            ...lead,
            assignedTo: telecallerName,
            status: 'Assigned',
          };
        }
        return lead;
      })
    );

    alert(`Successfully assigned ${selectedLeadIds.length} lead(s) to ${telecallerName}!`);
    setSelectedLeadIds([]);
    setSelectedTelecaller('');
  };

  const unassignedCount = leads.filter((l) => l.assignedTo === 'Unassigned').length;
  const assignedCount = leads.filter((l) => l.assignedTo !== 'Unassigned').length;

  return (
    <div className="asl-container">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="asl-title">Assign Leads</h1>
        <p className="asl-breadcrumb">Admission Panel / Manager Admin / Assign Leads</p>
      </div>

      {/* 3 Metric Cards */}
      <div className="asl-stats-grid">
        <div className="asl-stat-card">
          <div>
            <p className="asl-stat-label">Unassigned Leads</p>
            <h3 className="asl-stat-val" style={{ color: '#ef4444' }}>{unassignedCount}</h3>
          </div>
          <div className="asl-stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <div className="asl-stat-card">
          <div>
            <p className="asl-stat-label">Assigned Leads</p>
            <h3 className="asl-stat-val" style={{ color: '#10b981' }}>{assignedCount}</h3>
          </div>
          <div className="asl-stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <div className="asl-stat-card">
          <div>
            <p className="asl-stat-label">Active Telecallers</p>
            <h3 className="asl-stat-val" style={{ color: '#0066ff' }}>{TELECALLER_OPTIONS.length}</h3>
          </div>
          <div className="asl-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#0066ff' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bulk Action & Telecaller Selection Bar */}
      <div className="asl-assign-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0066ff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
              Selected Leads: <span style={{ color: '#0066ff' }}>{selectedLeadIds.length}</span>
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
              Choose a telecaller to allocate the checked students.
            </p>
          </div>
        </div>

        <div className="asl-assign-controls">
          <select
            value={selectedTelecaller}
            onChange={(e) => setSelectedTelecaller(e.target.value)}
            className="asl-select-telecaller"
          >
            <option value="">-- Choose Telecaller --</option>
            {TELECALLER_OPTIONS.map((tc) => (
              <option key={tc.id} value={tc.name}>
                {tc.name} ({tc.activeLeads} leads active)
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAssignSubmit}
            disabled={selectedLeadIds.length === 0 || !selectedTelecaller}
            className="asl-btn-submit"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Assign Selected Leads</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="asl-filter-card">
        <div className="asl-search-box">
          <svg className="asl-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student name or Lead ID..."
            className="asl-search-input"
          />
        </div>

        <select
          value={assignmentFilter}
          onChange={(e) => setAssignmentFilter(e.target.value)}
          className="asl-select"
        >
          <option value="All">All Lead Status</option>
          <option value="Unassigned">Unassigned Only</option>
          <option value="Assigned">Assigned Only</option>
        </select>

        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="asl-select"
        >
          <option>All Colleges</option>
          <option>ABC Engineering College</option>
          <option>XYZ Arts & Science College</option>
          <option>LMN Engineering College</option>
          <option>PQR Polytechnic</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setAssignmentFilter('All');
            setCollegeFilter('All Colleges');
            setSelectedLeadIds([]);
          }}
          style={{ padding: '8px 14px', border: '1.5px solid #e2e8f0', background: '#fff', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      {/* Table Container */}
      <div className="asl-table-card">
        <table className="asl-table">
          <thead>
            <tr>
              <th style={{ width: '40px', paddingLeft: '20px' }}>
                <input
                  type="checkbox"
                  checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                  onChange={handleSelectAll}
                  style={{ accentColor: '#0066ff', width: '15px', height: '15px', cursor: 'pointer' }}
                />
              </th>
              <th>Lead ID</th>
              <th>Student Name</th>
              <th>Target College</th>
              <th>Course</th>
              <th>10th / 12th (%)</th>
              <th>Assigned Telecaller</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                const isUnassigned = lead.assignedTo === 'Unassigned';
                return (
                  <tr
                    key={lead.id}
                    style={{
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <td style={{ paddingLeft: '20px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(lead.id)}
                        style={{ accentColor: '#0066ff', width: '15px', height: '15px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>{lead.id}</td>
                    <td style={{ fontWeight: 700 }}>{lead.name}</td>
                    <td style={{ color: '#64748b' }}>{lead.college}</td>
                    <td style={{ fontWeight: 600 }}>{lead.course}</td>
                    <td>{lead.tenth}% / {lead.twelfth}%</td>
                    <td>
                      <span style={{ fontWeight: 700, color: isUnassigned ? '#dc2626' : '#0066ff' }}>
                        {lead.assignedTo}
                      </span>
                    </td>
                    <td>
                      <span className={`asl-badge ${isUnassigned ? 'unassigned' : 'assigned'}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}