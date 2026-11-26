import React, { useRef, useState } from 'react';
import './AddCollegePage.css';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80';

const DEFAULT_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=300&q=75',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=75',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=75',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=75',
];

const FACILITIES_LIST = [
  'Hostel (Boys & Girls)',
  'Transport Facility',
  'Library',
  'Cafeteria',
  'Sports Facilities',
  'Wi-Fi Campus',
];

const APPROVALS_LIST = [
  'Affiliated to Anna University',
  'Approved by AICTE',
  'Recognized by UGC',
  'NAAC Accredited',
  'NBA Accredited (Select Departments)',
];

const INITIAL_FORM_STATE = {
  collegeName: '',
  collegeCode: '',
  establishedYear: '',
  institutionType: 'Private',
  affiliatedUniversity: '',
  approvedBy: '',
  collegeLocation: '',
  shortDescription: '',
  coverImage: DEFAULT_COVER_IMAGE,
  collegePhone: '',
  officialEmail: '',
  website: '',
  fullAddress: '',
  aboutCollege: '',
  totalStudents: '',
  facultyCount: '',
  totalDepartments: '',
  placementSupport: '',
  facilities: ['Hostel (Boys & Girls)', 'Transport Facility', 'Library', 'Wi-Fi Campus'],
  coursesOffered: [
    {
      id: 1,
      courseName: '',
      courseLevel: 'B.E',
      duration: '4 Years',
      seats: '60',
    },
  ],
  accreditations: [
    'Affiliated to Anna University',
    'Approved by AICTE',
    'Recognized by UGC',
    'NAAC Accredited',
  ],
  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
  },
  galleryImages: DEFAULT_GALLERY_IMAGES,
  extraGalleryCount: 8,
};

export default function AddCollegePage({ onCollegeSaved }) {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedMessage, setSavedMessage] = useState('');

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFieldChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSocialChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  const toggleFacility = (facility) => {
    setFormState((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((item) => item !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const toggleAccreditation = (item) => {
    setFormState((prev) => {
      const exists = prev.accreditations.includes(item);
      return {
        ...prev,
        accreditations: exists
          ? prev.accreditations.filter((acc) => acc !== item)
          : [...prev.accreditations, item],
      };
    });
  };

  const handleAddCourseRow = () => {
    setFormState((prev) => ({
      ...prev,
      coursesOffered: [
        ...prev.coursesOffered,
        {
          id: Date.now(),
          courseName: '',
          courseLevel: 'B.E',
          duration: '4 Years',
          seats: '60',
        },
      ],
    }));
  };

  const handleCourseChange = (id, key, value) => {
    setFormState((prev) => ({
      ...prev,
      coursesOffered: prev.coursesOffered.map((course) =>
        course.id === id ? { ...course, [key]: value } : course
      ),
    }));
  };

  const handleRemoveCourseRow = (id) => {
    setFormState((prev) => {
      if (prev.coursesOffered.length === 1) return prev;
      return {
        ...prev,
        coursesOffered: prev.coursesOffered.filter((course) => course.id !== id),
      };
    });
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFormState((prev) => ({ ...prev, coverImage: objectUrl }));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormState((prev) => ({
      ...prev,
      galleryImages: [...urls, ...prev.galleryImages].slice(0, 4),
      extraGalleryCount: prev.extraGalleryCount + files.length,
    }));
  };

  const handleReset = () => {
    setFormState(INITIAL_FORM_STATE);
    setSavedMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parts = formState.collegeLocation.split(',').map((s) => s.trim());
    const payload = {
      ...formState,
      collegeCode: formState.collegeCode.trim().toUpperCase(),
      city: parts[0] || '',
      state: parts[1] || '',
    };

    setSavedMessage(
      `Saved "${payload.collegeName || payload.collegeCode || 'New College'}" to portal state.`
    );
    if (onCollegeSaved) {
      onCollegeSaved(payload);
    }
  };

  return (
    <form className="acp-container" onSubmit={handleSubmit}>
      <div className="acp-page-header">
        <div>
          <h1 className="acp-title">Add New College</h1>
          <p className="acp-subtitle">Enter college information to add a college to the portal</p>
        </div>

        {savedMessage && <div className="acp-toast">✓ {savedMessage}</div>}
      </div>

      {/* ROW 1: College Basic Information + College Cover Image */}
      <div className="acp-top-grid">
        <div className="acp-card">
          <div className="acp-card-header">
            <div className="acp-card-title-wrap">
              <span className="acp-card-icon">🏛</span>
              <h2 className="acp-card-title">College Basic Information</h2>
            </div>
          </div>

          <div className="acp-field-grid-2">
            <div className="acp-field">
              <label className="acp-label">
                College Name <span className="acp-req">*</span>
              </label>
              <input
                type="text"
                className="acp-input"
                placeholder="Enter college name"
                value={formState.collegeName}
                onChange={(e) => handleFieldChange('collegeName', e.target.value)}
                required
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                College Code <span className="acp-req">*</span>
              </label>
              <input
                type="text"
                className="acp-input"
                placeholder="e.g. SVC001"
                value={formState.collegeCode}
                onChange={(e) => handleFieldChange('collegeCode', e.target.value)}
                required
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Established Year <span className="acp-req">*</span>
              </label>
              <input
                type="text"
                className="acp-input"
                placeholder="e.g. 2004"
                value={formState.establishedYear}
                onChange={(e) => handleFieldChange('establishedYear', e.target.value)}
                required
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                College Type <span className="acp-req">*</span>
              </label>
              <div className="acp-radio-row">
                <label className="acp-radio-label">
                  <input
                    type="radio"
                    name="institutionType"
                    value="Private"
                    checked={formState.institutionType === 'Private'}
                    onChange={(e) => handleFieldChange('institutionType', e.target.value)}
                  />
                  <span>Private</span>
                </label>

                <label className="acp-radio-label">
                  <input
                    type="radio"
                    name="institutionType"
                    value="Government"
                    checked={formState.institutionType === 'Government'}
                    onChange={(e) => handleFieldChange('institutionType', e.target.value)}
                  />
                  <span>Government</span>
                </label>
              </div>
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Affiliated University <span className="acp-req">*</span>
              </label>
              <select
                className="acp-select"
                value={formState.affiliatedUniversity}
                onChange={(e) => handleFieldChange('affiliatedUniversity', e.target.value)}
                required
              >
                <option value="">Select university</option>
                <option value="Anna University">Anna University</option>
                <option value="Periyar University">Periyar University</option>
                <option value="Bharathiar University">Bharathiar University</option>
                <option value="Autonomous">Autonomous</option>
              </select>
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Approved By <span className="acp-req">*</span>
              </label>
              <select
                className="acp-select"
                value={formState.approvedBy}
                onChange={(e) => handleFieldChange('approvedBy', e.target.value)}
                required
              >
                <option value="">Select approval body</option>
                <option value="AICTE">AICTE</option>
                <option value="UGC">UGC</option>
                <option value="DOTE">DOTE</option>
              </select>
            </div>

            <div className="acp-field">
              <label className="acp-label">
                College Location <span className="acp-req">*</span>
              </label>
              <input
                type="text"
                className="acp-input"
                placeholder="Enter location (City, State)"
                value={formState.collegeLocation}
                onChange={(e) => handleFieldChange('collegeLocation', e.target.value)}
                required
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Short Description <span className="acp-req">*</span>
              </label>
              <textarea
                className="acp-textarea"
                placeholder="Brief description about the college..."
                value={formState.shortDescription}
                onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* College Cover Image */}
        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">🖼</span>
            <h2 className="acp-card-title">College Cover Image</h2>
          </div>

          <div className="acp-cover-grid">
            <div className="acp-upload-box">
              <div style={{ fontSize: '24px', color: '#0066ff' }}>☁↑</div>
              <p className="acp-upload-title">Upload College Cover Image</p>
              <p className="acp-upload-hint">JPG, PNG up to 5MB</p>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="acp-choose-btn"
                onClick={() => coverInputRef.current?.click()}
              >
                Choose File
              </button>
            </div>

            <div className="acp-cover-preview">
              <img
                src={formState.coverImage}
                alt="College Cover Preview"
                className="acp-cover-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Contact Information + College Overview + Quick Highlights */}
      <div className="acp-mid-grid">
        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">📞</span>
            <h2 className="acp-card-title">Contact Information</h2>
          </div>

          <div className="acp-field-grid-2">
            <div className="acp-field">
              <label className="acp-label">
                College Phone <span className="acp-req">*</span>
              </label>
              <input
                type="text"
                className="acp-input"
                placeholder="0427-1234567"
                value={formState.collegePhone}
                onChange={(e) => handleFieldChange('collegePhone', e.target.value)}
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Official Email <span className="acp-req">*</span>
              </label>
              <input
                type="email"
                className="acp-input"
                placeholder="info@college.edu.in"
                value={formState.officialEmail}
                onChange={(e) => handleFieldChange('officialEmail', e.target.value)}
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">Website</label>
              <input
                type="text"
                className="acp-input"
                placeholder="www.college.edu.in"
                value={formState.website}
                onChange={(e) => handleFieldChange('website', e.target.value)}
              />
            </div>

            <div className="acp-field">
              <label className="acp-label">
                Full Address <span className="acp-req">*</span>
              </label>
              <textarea
                className="acp-textarea"
                style={{ minHeight: '58px' }}
                placeholder="Enter full address with pincode..."
                value={formState.fullAddress}
                onChange={(e) => handleFieldChange('fullAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">📄</span>
            <h2 className="acp-card-title">College Overview</h2>
          </div>

          <div className="acp-field">
            <label className="acp-label">
              About College <span className="acp-req">*</span>
            </label>
            <textarea
              className="acp-overview-textarea"
              placeholder="Write about the college, vision, mission, infrastructure, etc..."
              value={formState.aboutCollege}
              onChange={(e) => handleFieldChange('aboutCollege', e.target.value)}
            />
          </div>
        </div>

        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">📊</span>
            <h2 className="acp-card-title">Quick Highlights</h2>
          </div>

          <div className="acp-highlights-grid">
            <div className="acp-highlight-box blue">
              <label className="acp-highlight-lbl">🎓 Total Students</label>
              <input
                type="text"
                className="acp-highlight-input"
                placeholder="e.g. 5000"
                value={formState.totalStudents}
                onChange={(e) => handleFieldChange('totalStudents', e.target.value)}
              />
            </div>

            <div className="acp-highlight-box green">
              <label className="acp-highlight-lbl">👥 Faculty Members</label>
              <input
                type="text"
                className="acp-highlight-input"
                placeholder="e.g. 300"
                value={formState.facultyCount}
                onChange={(e) => handleFieldChange('facultyCount', e.target.value)}
              />
            </div>

            <div className="acp-highlight-box amber">
              <label className="acp-highlight-lbl">🏫 Departments</label>
              <input
                type="text"
                className="acp-highlight-input"
                placeholder="e.g. 10"
                value={formState.totalDepartments}
                onChange={(e) => handleFieldChange('totalDepartments', e.target.value)}
              />
            </div>

            <div className="acp-highlight-box purple">
              <label className="acp-highlight-lbl">🏆 Placement Support</label>
              <input
                type="text"
                className="acp-highlight-input"
                placeholder="e.g. 100%"
                value={formState.placementSupport}
                onChange={(e) => handleFieldChange('placementSupport', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: Facilities + Courses Offered + Approvals & Affiliations */}
      <div className="acp-facilities-courses-grid">
        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">⚙</span>
            <h2 className="acp-card-title">Facilities</h2>
          </div>

          <div className="acp-facilities-grid">
            {FACILITIES_LIST.map((fac) => {
              const active = formState.facilities.includes(fac);
              return (
                <button
                  key={fac}
                  type="button"
                  onClick={() => toggleFacility(fac)}
                  className={`acp-facility-btn ${active ? 'selected' : ''}`}
                >
                  {fac}
                </button>
              );
            })}
          </div>
        </div>

        <div className="acp-card">
          <div className="acp-card-header">
            <div className="acp-card-title-wrap">
              <span className="acp-card-icon">📖</span>
              <h2 className="acp-card-title">Courses Offered</h2>
            </div>
            <button
              type="button"
              onClick={handleAddCourseRow}
              className="acp-add-course-btn"
            >
              + Add Course
            </button>
          </div>

          <div className="acp-courses-scroll">
            <table className="acp-courses-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Name</th>
                  <th>Degree</th>
                  <th>Duration</th>
                  <th>Seats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formState.coursesOffered.map((course, idx) => (
                  <tr key={course.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="acp-input"
                        placeholder="e.g. Computer Science"
                        value={course.courseName}
                        onChange={(e) =>
                          handleCourseChange(course.id, 'courseName', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="acp-select"
                        value={course.courseLevel}
                        onChange={(e) =>
                          handleCourseChange(course.id, 'courseLevel', e.target.value)
                        }
                      >
                        <option value="B.E">B.E</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.E">M.E</option>
                        <option value="MBA">MBA</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="acp-select"
                        value={course.duration}
                        onChange={(e) =>
                          handleCourseChange(course.id, 'duration', e.target.value)
                        }
                      >
                        <option value="4 Years">4 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="2 Years">2 Years</option>
                      </select>
                    </td>
                    <td style={{ width: '68px' }}>
                      <input
                        type="number"
                        className="acp-input"
                        value={course.seats}
                        onChange={(e) =>
                          handleCourseChange(course.id, 'seats', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourseRow(course.id)}
                        className="acp-del-btn"
                        title="Remove Course"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">🛡</span>
            <h2 className="acp-card-title">Approvals & Affiliations</h2>
          </div>

          <div className="acp-checks-list">
            {APPROVALS_LIST.map((item) => (
              <label key={item} className="acp-check-item">
                <input
                  type="checkbox"
                  checked={formState.accreditations.includes(item)}
                  onChange={() => toggleAccreditation(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4: Social Media Links + Gallery Images & Save Action */}
      <div className="acp-bottom-grid">
        <div className="acp-card">
          <div className="acp-card-title-wrap">
            <span className="acp-card-icon">🔗</span>
            <h2 className="acp-card-title">Social Media Links</h2>
          </div>

          <div className="acp-social-list">
            <div className="acp-social-row">
              <span className="acp-social-badge" style={{ backgroundColor: '#e1306c' }}>
                IG
              </span>
              <input
                type="text"
                className="acp-input"
                placeholder="https://instagram.com/yourcollege"
                value={formState.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
              />
            </div>

            <div className="acp-social-row">
              <span className="acp-social-badge" style={{ backgroundColor: '#1877f2' }}>
                f
              </span>
              <input
                type="text"
                className="acp-input"
                placeholder="https://facebook.com/yourcollege"
                value={formState.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
              />
            </div>

            <div className="acp-social-row">
              <span className="acp-social-badge" style={{ backgroundColor: '#ff0000' }}>
                ▶
              </span>
              <input
                type="text"
                className="acp-input"
                placeholder="https://youtube.com/@yourcollege"
                value={formState.socialLinks.youtube}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
              />
            </div>

            <div className="acp-social-row">
              <span className="acp-social-badge" style={{ backgroundColor: '#0a66c2' }}>
                in
              </span>
              <input
                type="text"
                className="acp-input"
                placeholder="https://linkedin.com/company/yourcollege"
                value={formState.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="acp-card" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="acp-card-title-wrap" style={{ marginBottom: '12px' }}>
              <span className="acp-card-icon">🖼</span>
              <h2 className="acp-card-title">Gallery Images</h2>
            </div>

            <div className="acp-gallery-row">
              <div className="acp-gallery-upload">
                <div style={{ fontSize: '18px', color: '#0066ff' }}>☁↑</div>
                <p className="acp-upload-title">Upload Gallery Images</p>
                <p className="acp-upload-hint">JPG, PNG up to 5MB</p>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleGalleryUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="acp-choose-btn"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  Choose Files
                </button>
              </div>

              <div className="acp-gallery-thumbs">
                {formState.galleryImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="acp-gallery-thumb"
                  />
                ))}
                <div className="acp-gallery-more">+{formState.extraGalleryCount} More Photos</div>
              </div>
            </div>
          </div>

          <div className="acp-footer-actions">
            <button type="button" onClick={handleReset} className="acp-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="acp-save-btn">
              <span>💾 Save College</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}