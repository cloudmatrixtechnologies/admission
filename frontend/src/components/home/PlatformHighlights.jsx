// src/components/home/PlatformHighlights.jsx
import React from 'react';
import './PlatformHighlights.css';

const HIGHLIGHTS_DATA = [
  {
    id: 1,
    title: 'Comprehensive College Profiles',
    description:
      'Verified intake capacities, affiliating university accreditations, autonomous status, and campus facilities across government, aided, and private institutions.',
    tags: ['NAAC & NBA Grades', 'Campus Infrastructure', 'Hostel & Mess Info'],
  },
  {
    id: 2,
    title: 'Curriculum & Specializations',
    description:
      'In-depth program catalogs covering 4-year engineering branches, 3-year arts & science streams, diploma trades, and emerging tech specializations.',
    tags: ['Semester Syllabi', 'Emerging Tech Electives', 'Industry Certifications'],
  },
  {
    id: 3,
    title: 'Transparent Fee Breakdown',
    description:
      'Clear visibility on tuition fee structures, government quota fee caps, management fee guidelines, exam fees, and available institutional fee concessions.',
    tags: ['Annual Tuition Fees', 'Quota-wise Rates', 'Fee Concessions'],
  },
  {
    id: 4,
    title: 'Eligibility & Cut-Off Insights',
    description:
      'Direct requirements for 10th pass, 12th board marks, lateral entry eligibility for polytechnic diploma holders, and community-wise quota cut-off trends.',
    tags: ['Board Percentage Criteria', 'Community Cut-offs', 'Lateral Entry Entry'],
  },
  {
    id: 5,
    title: 'Objective Side-by-Side Comparison',
    description:
      'Evaluate multiple colleges simultaneously across verified tuition fees, faculty-student ratios, lab equipment, and authenticated placement records.',
    tags: ['Multi-College Compare', 'Placement Metrics', 'Campus Ratings'],
  },
  {
    id: 6,
    title: 'Accredited & Verified Sources',
    description:
      'Every record is regularly cross-checked with official university gazettes, AICTE approvals, DOTE notifications, and state higher education council releases.',
    tags: ['AICTE & UGC Validated', 'DOTE Aligned', 'Official Council Data'],
  },
  {
    id: 7,
    title: 'State-Wide Institutional Reach',
    description:
      'Complete coverage of colleges across every district in Tamil Nadu, from premier metropolitan institutes to prominent tier-2 and tier-3 regional centers.',
    tags: ['All Regional Districts', 'Govt & Private Colleges', 'Polytechnic & ITIs'],
  },
  {
    id: 8,
    title: 'Dedicated Guidance & Support',
    description:
      'Personalized support for students and parents navigating the admission cycle, branch selection, application documentation, and counselling schedules.',
    tags: ['1-on-1 Helpdesk', 'Document Checklists', 'Counselling Alerts'],
  },
];

export default function PlatformHighlights() {
  return (
    <section className="highlights-section">
      <div className="highlights-intro">
        <span className="highlights-pill">WHAT WE PROVIDE</span>
        <h2>Our Platform Details</h2>
        <p>Complete tools, verified institutional data, and transparent guidance to support your college discovery.</p>
      </div>

      <div className="highlights-grid">
        {HIGHLIGHTS_DATA.map((item) => (
          <div key={item.id} className="highlight-item-card">
            <div className="highlight-card-header">
              <span className="highlight-check">✓</span>
              <h3>{item.title}</h3>
            </div>
            <p>{item.description}</p>
            <div className="highlight-card-tags">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="highlight-mini-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}