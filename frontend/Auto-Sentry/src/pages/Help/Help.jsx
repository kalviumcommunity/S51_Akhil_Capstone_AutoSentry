import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Help.css';
import {
  FaCar, FaClipboardList, FaHistory, FaCalendarAlt,
  FaUserShield, FaChevronDown, FaChevronUp,
  FaSearch, FaEnvelope, FaBook, FaQuestionCircle,
} from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

/* ── FAQ data grouped by category ── */
const CATEGORIES = [
  {
    id: 'getting-started',
    icon: <FaBook />,
    label: 'Getting Started',
    color: '#5de0a5',
    faqs: [
      { q: 'How do I create an account?',          a: 'Click "Get Started" or "Log In" in the top navigation. Auto Sentry uses Auth0 — you can sign in with your Google account or create an email/password account in seconds.' },
      { q: 'Is Auto Sentry free to use?',          a: 'Yes, completely free. No credit card required. Sign in and start tracking immediately.' },
      { q: 'How do I add my first vehicle?',       a: 'After logging in, go to My Garage and click "Add Vehicle". Enter the make, model, year, VIN, and an optional image URL. The make field has autocomplete for popular brands.' },
      { q: 'Can I add multiple vehicles?',         a: 'Yes. There\'s no limit on the number of vehicles you can register. Each vehicle has its own independent task list and service history.' },
    ],
  },
  {
    id: 'maintenance',
    icon: <FaClipboardList />,
    label: 'Maintenance Tasks',
    color: '#15cdfc',
    faqs: [
      { q: 'How do I create a maintenance task?',  a: 'Navigate to My Garage, click "Maintenance" on any vehicle card. Use the "Create New Task" form to add a task name, priority (High/Medium/Low), due date, and description.' },
      { q: 'What do the priority levels mean?',    a: 'High (red) — needs attention soon. Medium (amber) — scheduled but not urgent. Low (green) — routine future task. Overdue tasks are automatically flagged regardless of priority.' },
      { q: 'How do I mark a task as complete?',   a: 'In the Upcoming tab, click the green checkmark button on the right side of any task row. It moves to the Completed tab instantly.' },
      { q: 'What happens to overdue tasks?',       a: 'Tasks past their due date show a pulsing red "Overdue" badge. They stay in the Upcoming tab until completed or deleted.' },
    ],
  },
  {
    id: 'service-history',
    icon: <FaHistory />,
    label: 'Service History',
    color: '#a78bfa',
    faqs: [
      { q: 'How do I log a service record?',       a: 'Go to Service History from the Garage. Click "Add New Record", fill in the service type, date, mileage, cost, and optionally upload a photo receipt via Firebase.' },
      { q: 'Where are service photos stored?',     a: 'Photos are uploaded to Firebase Storage (project: autosentry-file-history) and the download URL is saved in Firestore. They are tied to your account.' },
      { q: 'Can I delete a service record?',       a: 'Yes. Click the trash icon on any record row. A confirmation modal will appear before the record is permanently deleted.' },
      { q: 'What fields can I log?',               a: 'Service type, date, odometer/mileage, cost (₹), a free-text description, and an optional image attachment.' },
    ],
  },
  {
    id: 'calendar',
    icon: <FaCalendarAlt />,
    label: 'Google Calendar',
    color: '#f59e0b',
    faqs: [
      { q: 'How does Google Calendar sync work?',  a: 'On any upcoming task, click the calendar icon. You\'ll be taken to the Google Calendar page where the task name and due date are pre-filled. Sign in with Google via Supabase OAuth to save the event.' },
      { q: 'Do I need a Google account?',          a: 'Only for the Calendar integration. The rest of Auto Sentry works fully with any Auth0-supported sign-in method.' },
      { q: 'Will reminders sync automatically?',  a: 'Currently the calendar page opens with the task pre-filled — you confirm and save in Google Calendar. Automatic push sync is planned for a future release.' },
    ],
  },
  {
    id: 'account',
    icon: <FaUserShield />,
    label: 'Account & Security',
    color: '#f87171',
    faqs: [
      { q: 'How is my data secured?',             a: 'Authentication is handled by Auth0. Vehicle and task data is stored in MongoDB Atlas with TLS encryption. Service history and images are in Firebase with project-level security rules.' },
      { q: 'How do I update my profile?',         a: 'Your name, email, and profile photo are managed by Auth0. Visit the Auth0 user portal to make changes — they\'ll reflect in Auto Sentry automatically.' },
      { q: 'How do I delete my account?',         a: 'Go to Settings → Danger Zone → Delete Account. This permanently removes all your vehicles, tasks, and service history. This action cannot be undone.' },
      { q: 'Who can see my vehicle data?',        a: 'Only you. Each vehicle and task is filtered by your Auth0 nickname server-side, so no other user can access your garage.' },
    ],
  },
];

const QUICK_LINKS = [
  { to: '/garage',        icon: <FaCar />,          label: 'Open My Garage',       desc: 'Manage your vehicles'          },
  { to: '/servicehistory',icon: <FaHistory />,       label: 'Service History',      desc: 'View past service records'     },
  { to: '/Googlecalender',icon: <FaCalendarAlt />,   label: 'Google Calendar',      desc: 'Sync maintenance schedules'    },
  { to: '/contact-us',    icon: <FaEnvelope />,      label: 'Contact Support',      desc: 'Send us a message'             },
];

const Help = () => {
  const [openItems, setOpenItems]     = useState({});
  const [activeCategory, setActive]  = useState('getting-started');
  const [search, setSearch]          = useState('');

  const toggle = (id) =>
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));

  // Filter FAQs based on search
  const filtered = search.trim().length > 1
    ? CATEGORIES.map(c => ({
        ...c,
        faqs: c.faqs.filter(
          f => f.q.toLowerCase().includes(search.toLowerCase()) ||
               f.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.faqs.length > 0)
    : CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <div className="hp-page">

      {/* ── HEADER ── */}
      <div className="hp-header">
        <div className="hp-header-bg" aria-hidden="true" />
        <div className="hp-container hp-header-inner">
          <span className="hp-eyebrow">Help Centre</span>
          <h1 className="hp-title">How can we help?</h1>
          <p className="hp-subtitle">Find answers, guides, and support for Auto Sentry.</p>

          {/* Search */}
          <div className="hp-search-wrap">
            <FaSearch className="hp-search-icon" />
            <input
              type="text"
              className="hp-search"
              placeholder="Search for answers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="hp-body">
        <div className="hp-container">

          {/* ── QUICK LINKS ── */}
          <div className="hp-quick-grid">
            {QUICK_LINKS.map(l => (
              <NavLink to={l.to} key={l.to} className="hp-quick-card">
                <div className="hp-quick-icon">{l.icon}</div>
                <div className="hp-quick-body">
                  <span className="hp-quick-label">{l.label}</span>
                  <span className="hp-quick-desc">{l.desc}</span>
                </div>
                <HiArrowRight className="hp-quick-arrow" />
              </NavLink>
            ))}
          </div>

          {/* ── FAQ SECTION ── */}
          <div className="hp-faq-section">

            {/* Category tabs (hidden during search) */}
            {!search.trim() && (
              <div className="hp-cat-tabs">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    className={`hp-cat-tab${activeCategory === c.id ? ' hp-cat-tab--active' : ''}`}
                    onClick={() => setActive(c.id)}
                    style={activeCategory === c.id ? { borderBottomColor: c.color } : {}}
                  >
                    <span className="hp-cat-tab-icon" style={activeCategory === c.id ? { background: `${c.color}22`, color: c.color } : {}}>
                      {c.icon}
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search results heading */}
            {search.trim().length > 1 && (
              <p className="hp-search-result-label">
                {filtered.reduce((n, c) => n + c.faqs.length, 0)} result{filtered.reduce((n,c)=>n+c.faqs.length,0) !== 1 ? 's' : ''} for "<strong>{search}</strong>"
              </p>
            )}

            {/* FAQ accordion */}
            <div className="hp-accordion">
              {filtered.length === 0 && (
                <div className="hp-no-results">
                  <FaQuestionCircle className="hp-no-results-icon" />
                  <p>No results found for "<strong>{search}</strong>"</p>
                  <NavLink to="/contact-us" className="hp-no-results-link">
                    Contact support <HiArrowRight />
                  </NavLink>
                </div>
              )}
              {filtered.map(cat => (
                <div key={cat.id} className="hp-cat-group">
                  {search.trim().length > 1 && (
                    <div className="hp-cat-group-label">
                      <span className="hp-cat-group-icon" style={{ background: `${cat.color}22`, color: cat.color }}>
                        {cat.icon}
                      </span>
                      {cat.label}
                    </div>
                  )}
                  {cat.faqs.map((faq, i) => {
                    const key = `${cat.id}-${i}`;
                    const open = !!openItems[key];
                    return (
                      <div key={key} className={`hp-item${open ? ' hp-item--open' : ''}`}>
                        <button className="hp-item-q" onClick={() => toggle(key)}>
                          <span>{faq.q}</span>
                          {open ? <FaChevronUp className="hp-item-chevron" /> : <FaChevronDown className="hp-item-chevron" />}
                        </button>
                        {open && <div className="hp-item-a">{faq.a}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── CONTACT CTA ── */}
          <div className="hp-cta-card">
            <div className="hp-cta-bg" aria-hidden="true" />
            <div className="hp-cta-content">
              <span className="hp-cta-eyebrow">Still need help?</span>
              <h2>Get in touch with us</h2>
              <p>Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.</p>
              <NavLink to="/contact-us" className="hp-cta-btn">
                Contact Support <HiArrowRight />
              </NavLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;
