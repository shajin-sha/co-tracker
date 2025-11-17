import { useState, useEffect } from 'react'
import './App.css'

const NICHES = [
  "Online fitness coaches (selling 1 to 1 plans)",
  "Local gyms and fitness centers",
  "Yoga studios",
  "Pilates and boutique fitness studios",
  "Nutritionists and dietitians",
  "Skin clinics and dermatologists",
  "Dental clinics",
  "Cosmetic clinics and aesthetic centers",
  "Hair salons and barbershops",
  "Spas and wellness centers",
  "Nail studios and lash studios",
  "Tattoo studios",
  "Local restaurants",
  "Cloud kitchens",
  "Cafes and coffee shops",
  "Bakeries and home bakers",
  "Hostels and PGs",
  "Co working spaces",
  "Real estate agents (residential rentals)",
  "Real estate agents (sales, projects)",
  "Real estate property management companies",
  "Tuition centers (school level)",
  "Competitive exam coaching (JEE, NEET, UPSC etc)",
  "Language training centers (IELTS, TOEFL, PTE)",
  "Music schools and academies",
  "Dance studios and academies",
  "Art and hobby classes (drawing, crafts, coding for kids)",
  "Driving schools",
  "Daycare centers and preschools",
  "Wedding photographers",
  "Freelance photographers (non wedding)",
  "Event planners (small to mid size)",
  "Decorators and balloon decor businesses",
  "B2C SaaS tools for small businesses",
  "Course creators (online coaching programs)",
  "Instagram shop owners (fashion and accessories)",
  "Small D2C brands (skincare, haircare, wellness)",
  "Pet grooming salons",
  "Pet boarding and daycare centers",
  "Cleaning services (home, office)",
  "Home maintenance services (plumbing, electrical, handyman)",
  "Interior designers (mid market)",
  "Small NGOs and community groups",
  "Local churches/temples/mosques groups and spiritual events",
  "Club owners and nightlife events",
  "Gyms and coaches running 30 day challenges",
  "Barbers and grooming product sellers combined",
  "Printing and stationery shops that sell custom print products",
  "Local sports academies (cricket, football, badminton)",
  "Small HR/recruitment agencies"
];

const STATUS_OPTIONS = [
  "Contacted",
  "No Reply",
  "Follow Up Sent",
  "Replied",
  "Rejected",
  "Qualified",
  "Negotiating",
  "Converted"
];

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    profileLink: '',
    niche: '',
    contactType: 'DM',
    status: 'Contacted',
    firstMessageDate: getTodayDate(),
    replied: false,
    sentConcepts: false,
    signedUp: false,
    paid: false,
    mrr: 0,
    notes: ''
  });
  const [nicheSearch, setNicheSearch] = useState('');
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('outreachEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('outreachEntries', JSON.stringify(entries));
  }, [entries]);

  const filteredNiches = NICHES.filter(niche =>
    niche.toLowerCase().includes(nicheSearch.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNicheSelect = (niche) => {
    setFormData(prev => ({ ...prev, niche }));
    setNicheSearch(niche);
    setShowNicheDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingEntry !== null) {
      // Update existing entry
      const updated = [...entries];
      updated[editingEntry] = { ...formData, id: entries[editingEntry].id };
      setEntries(updated);
    } else {
      // Add new entry
      setEntries([...entries, { ...formData, id: Date.now() }]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      profileLink: '',
      niche: '',
      contactType: 'DM',
      status: 'Contacted',
      firstMessageDate: getTodayDate(),
      replied: false,
      sentConcepts: false,
      signedUp: false,
      paid: false,
      mrr: 0,
      notes: ''
    });
    setNicheSearch('');
    setShowModal(false);
    setEditingEntry(null);
  };

  const handleEdit = (index) => {
    setEditingEntry(index);
    const entry = entries[index];
    setFormData(entry);
    setNicheSearch(entry.niche);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  // Calculate funnel metrics
  const totalEntries = entries.length;
  const repliedCount = entries.filter(e => e.replied).length;
  const sentConceptsCount = entries.filter(e => e.sentConcepts).length;
  const signedUpCount = entries.filter(e => e.signedUp).length;
  const paidCount = entries.filter(e => e.paid).length;
  const totalMRR = entries.filter(e => e.paid).reduce((sum, e) => sum + Number(e.mrr || 0), 0);

  // Status-based metrics
  const statusCounts = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = entries.filter(e => e.status === status).length;
    return acc;
  }, {});

  const noReplyCount = statusCounts["No Reply"] || 0;
  const rejectedCount = statusCounts["Rejected"] || 0;
  const followUpCount = statusCounts["Follow Up Sent"] || 0;

  // Calculate drop-off rates
  const replyRate = totalEntries > 0 ? ((repliedCount / totalEntries) * 100).toFixed(1) : 0;
  const conceptRate = repliedCount > 0 ? ((sentConceptsCount / repliedCount) * 100).toFixed(1) : 0;
  const signupRate = sentConceptsCount > 0 ? ((signedUpCount / sentConceptsCount) * 100).toFixed(1) : 0;
  const paidRate = signedUpCount > 0 ? ((paidCount / signedUpCount) * 100).toFixed(1) : 0;
  const overallConversion = totalEntries > 0 ? ((paidCount / totalEntries) * 100).toFixed(2) : 0;

  // Drop-off analysis
  const contactedButNoReply = totalEntries - repliedCount;
  const repliedButNoConcepts = repliedCount - sentConceptsCount;
  const conceptsButNoSignup = sentConceptsCount - signedUpCount;
  const signedUpButNotPaid = signedUpCount - paidCount;

  // Niche analysis
  const nicheBreakdown = entries.reduce((acc, entry) => {
    if (!acc[entry.niche]) {
      acc[entry.niche] = { total: 0, replied: 0, paid: 0, mrr: 0 };
    }
    acc[entry.niche].total++;
    if (entry.replied) acc[entry.niche].replied++;
    if (entry.paid) {
      acc[entry.niche].paid++;
      acc[entry.niche].mrr += Number(entry.mrr || 0);
    }
    return acc;
  }, {});

  const topNiches = Object.entries(nicheBreakdown)
    .map(([niche, data]) => ({
      niche,
      ...data,
      replyRate: ((data.replied / data.total) * 100).toFixed(1),
      conversionRate: ((data.paid / data.total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 5);

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status.toLowerCase().replace(/ /g, '-')}`;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SaaS Outreach Tracker</h1>
        <div className="goal-banner">
          <span className="goal-label">Goal: $500 MRR</span>
          <span className="current-mrr">${totalMRR} MRR ({((totalMRR/500)*100).toFixed(1)}%)</span>
        </div>
      </header>

      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalEntries}</div>
            <div className="stat-label">Total Outreach</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{repliedCount}</div>
            <div className="stat-label">Replied ({replyRate}%)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sentConceptsCount}</div>
            <div className="stat-label">Sent Concepts ({conceptRate}%)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{signedUpCount}</div>
            <div className="stat-label">Signed Up ({signupRate}%)</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value">{paidCount}</div>
            <div className="stat-label">Paid ({paidRate}%)</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value">{overallConversion}%</div>
            <div className="stat-label">Overall Conversion</div>
          </div>
        </div>

        <div className="funnel-visual">
          <h3>Conversion Funnel</h3>
          <div className="funnel-bars">
            <div className="funnel-bar">
              <div className="funnel-bar-fill" style={{width: '100%'}}></div>
              <span>{totalEntries} Contacted</span>
            </div>
            <div className="funnel-bar">
              <div className="funnel-bar-fill" style={{width: `${replyRate}%`}}></div>
              <span>{repliedCount} Replied</span>
            </div>
            <div className="funnel-bar">
              <div className="funnel-bar-fill" style={{width: `${totalEntries > 0 ? (sentConceptsCount/totalEntries)*100 : 0}%`}}></div>
              <span>{sentConceptsCount} Sent Concepts</span>
            </div>
            <div className="funnel-bar">
              <div className="funnel-bar-fill" style={{width: `${totalEntries > 0 ? (signedUpCount/totalEntries)*100 : 0}%`}}></div>
              <span>{signedUpCount} Signed Up</span>
            </div>
            <div className="funnel-bar">
              <div className="funnel-bar-fill" style={{width: `${totalEntries > 0 ? (paidCount/totalEntries)*100 : 0}%`}}></div>
              <span>{paidCount} Paid (${totalMRR} MRR)</span>
            </div>
          </div>
        </div>

        <div className="reports-section">
          <h3>Detailed Analytics & Drop-Off Report</h3>

          <div className="report-grid">
            <div className="report-card">
              <h4>Status Breakdown</h4>
              <div className="report-item">
                <span className="report-label">No Reply</span>
                <span className="report-value negative">{noReplyCount} ({totalEntries > 0 ? ((noReplyCount/totalEntries)*100).toFixed(1) : 0}%)</span>
              </div>
              <div className="report-item">
                <span className="report-label">Follow Up Sent</span>
                <span className="report-value">{followUpCount}</span>
              </div>
              <div className="report-item">
                <span className="report-label">Rejected</span>
                <span className="report-value negative">{rejectedCount}</span>
              </div>
              <div className="report-item">
                <span className="report-label">Qualified</span>
                <span className="report-value positive">{statusCounts["Qualified"] || 0}</span>
              </div>
              <div className="report-item">
                <span className="report-label">Negotiating</span>
                <span className="report-value">{statusCounts["Negotiating"] || 0}</span>
              </div>
            </div>

            <div className="report-card">
              <h4>Drop-Off Analysis</h4>
              <div className="report-item">
                <span className="report-label">Contacted but no reply</span>
                <span className="report-value negative">{contactedButNoReply} lost</span>
              </div>
              <div className="report-item">
                <span className="report-label">Replied but no concepts</span>
                <span className="report-value negative">{repliedButNoConcepts} lost</span>
              </div>
              <div className="report-item">
                <span className="report-label">Concepts but no signup</span>
                <span className="report-value negative">{conceptsButNoSignup} lost</span>
              </div>
              <div className="report-item">
                <span className="report-label">Signed up but not paid</span>
                <span className="report-value negative">{signedUpButNotPaid} lost</span>
              </div>
              <div className="report-item">
                <span className="report-label">Total Lost Opportunities</span>
                <span className="report-value negative">{contactedButNoReply + repliedButNoConcepts + conceptsButNoSignup + signedUpButNotPaid}</span>
              </div>
            </div>

            <div className="report-card">
              <h4>Where Most People Drop Off</h4>
              {totalEntries > 0 ? (
                <>
                  <div className="report-item">
                    <span className="report-label">1st Biggest Drop-Off</span>
                    <span className="report-value negative">
                      {contactedButNoReply >= repliedButNoConcepts && contactedButNoReply >= conceptsButNoSignup && contactedButNoReply >= signedUpButNotPaid
                        ? `No Reply Stage (${contactedButNoReply})`
                        : repliedButNoConcepts >= conceptsButNoSignup && repliedButNoConcepts >= signedUpButNotPaid
                        ? `After Reply (${repliedButNoConcepts})`
                        : conceptsButNoSignup >= signedUpButNotPaid
                        ? `After Concepts (${conceptsButNoSignup})`
                        : `After Signup (${signedUpButNotPaid})`}
                    </span>
                  </div>
                  <div className="report-item">
                    <span className="report-label">Reply Rate</span>
                    <span className={`report-value ${replyRate >= 20 ? 'positive' : replyRate >= 10 ? '' : 'negative'}`}>{replyRate}%</span>
                  </div>
                  <div className="report-item">
                    <span className="report-label">Action Needed</span>
                    <span className="report-value">
                      {replyRate < 10 ? 'Improve messaging' : replyRate < 20 ? 'Follow up more' : 'Keep going!'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="report-item">
                  <span className="report-label">No data yet</span>
                  <span className="report-value">Start adding entries</span>
                </div>
              )}
            </div>
          </div>

          {topNiches.length > 0 && (
            <>
              <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: '#1f2937'}}>Top Performing Niches</h4>
              <div className="report-grid">
                {topNiches.map(({ niche, total, replied, paid, mrr, replyRate, conversionRate }) => (
                  <div key={niche} className="report-card">
                    <h4 style={{fontSize: '0.9rem', marginBottom: '0.75rem'}}>{niche}</h4>
                    <div className="report-item">
                      <span className="report-label">Total Contacted</span>
                      <span className="report-value">{total}</span>
                    </div>
                    <div className="report-item">
                      <span className="report-label">Reply Rate</span>
                      <span className={`report-value ${replyRate >= 20 ? 'positive' : ''}`}>{replyRate}%</span>
                    </div>
                    <div className="report-item">
                      <span className="report-label">Paid Customers</span>
                      <span className="report-value positive">{paid}</span>
                    </div>
                    <div className="report-item">
                      <span className="report-label">MRR Generated</span>
                      <span className="report-value positive">${mrr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <button className="btn-add" onClick={() => setShowModal(true)}>
          + Add New Entry
        </button>

        <div className="entries-table">
          <h3>All Entries ({entries.length})</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Niche</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Replied</th>
                  <th>Concepts</th>
                  <th>Signed Up</th>
                  <th>Paid</th>
                  <th>MRR</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="12" style={{textAlign: 'center', padding: '2rem'}}>
                      No entries yet. Click "Add New Entry" to start tracking!
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>
                        {entry.profileLink ? (
                          <a href={entry.profileLink} target="_blank" rel="noopener noreferrer">
                            {entry.name}
                          </a>
                        ) : (
                          entry.name
                        )}
                      </td>
                      <td className="niche-cell">{entry.niche}</td>
                      <td>{entry.contactType}</td>
                      <td>
                        <span className={getStatusBadgeClass(entry.status || 'Contacted')}>
                          {entry.status || 'Contacted'}
                        </span>
                      </td>
                      <td>{entry.firstMessageDate}</td>
                      <td>{entry.replied ? '✓' : '✗'}</td>
                      <td>{entry.sentConcepts ? '✓' : '✗'}</td>
                      <td>{entry.signedUp ? '✓' : '✗'}</td>
                      <td>{entry.paid ? '✓' : '✗'}</td>
                      <td>${entry.mrr || 0}</td>
                      <td className="notes-cell">{entry.notes}</td>
                      <td>
                        <button className="btn-icon" onClick={() => handleEdit(index)}>✏️</button>
                        <button className="btn-icon" onClick={() => handleDelete(index)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEntry !== null ? 'Edit Entry' : 'Add New Entry'}</h2>
              <button className="btn-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Link</label>
                <input
                  type="url"
                  name="profileLink"
                  value={formData.profileLink}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div className="form-group">
                <label>Niche *</label>
                <div className="niche-search-container">
                  <input
                    type="text"
                    value={nicheSearch}
                    onChange={(e) => {
                      setNicheSearch(e.target.value);
                      setShowNicheDropdown(true);
                    }}
                    onFocus={() => setShowNicheDropdown(true)}
                    placeholder="Search niches..."
                    required
                  />
                  {showNicheDropdown && (
                    <div className="niche-dropdown">
                      {filteredNiches.map((niche, idx) => (
                        <div
                          key={idx}
                          className="niche-option"
                          onClick={() => handleNicheSelect(niche)}
                        >
                          {niche}
                        </div>
                      ))}
                      {filteredNiches.length === 0 && (
                        <div className="niche-option disabled">No matches found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Contact Type *</label>
                <select
                  name="contactType"
                  value={formData.contactType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="DM">DM</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>First Message Date *</label>
                <input
                  type="date"
                  name="firstMessageDate"
                  value={formData.firstMessageDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="replied"
                      checked={formData.replied}
                      onChange={handleInputChange}
                    />
                    Replied?
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="sentConcepts"
                      checked={formData.sentConcepts}
                      onChange={handleInputChange}
                    />
                    Sent Concepts?
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="signedUp"
                      checked={formData.signedUp}
                      onChange={handleInputChange}
                    />
                    Signed Up?
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="paid"
                      checked={formData.paid}
                      onChange={handleInputChange}
                    />
                    Paid?
                  </label>
                </div>
              </div>

              {formData.paid && (
                <div className="form-group">
                  <label>MRR Amount ($) *</label>
                  <input
                    type="number"
                    name="mrr"
                    value={formData.mrr}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    required
                    placeholder="9 or 19"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingEntry !== null ? 'Update Entry' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
