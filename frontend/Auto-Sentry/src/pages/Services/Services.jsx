import './Services.css';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  FaTools, FaClipboardList, FaCalendarAlt, FaCar,
  FaShieldAlt, FaBell, FaChartBar, FaCheckCircle,
} from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import trackimg    from '../../assets/trackimg.png';
import scheduleimg from '../../assets/scheduleimg.png';
import maintainimg from '../../assets/maintainimg.jpg';

const SERVICES = [
  {
    icon:  <FaTools />,
    title: 'Maintenance Tracking',
    desc:  'Stay on top of every service interval. Track upcoming and completed tasks with priority levels — High, Medium, or Low — so nothing slips through the cracks.',
    link:  '/garage',
    color: '#5de0a5',
  },
  {
    icon:  <FaClipboardList />,
    title: 'Service History',
    desc:  'Keep a complete, searchable log of every repair and service your vehicle has received. Attach photos and notes to each record.',
    link:  '/servicehistory',
    color: '#15cdfc',
  },
  {
    icon:  <FaCalendarAlt />,
    title: 'Google Calendar Sync',
    desc:  'Schedule maintenance reminders directly on your Google Calendar. Never miss an oil change or tire rotation by syncing due dates.',
    link:  '/Googlecalender',
    color: '#f59e0b',
  },
  {
    icon:  <FaCar />,
    title: 'Vehicle Garage',
    desc:  'Manage your entire fleet in one place. Add multiple vehicles, store their details and photos, and switch between them effortlessly.',
    link:  '/garage',
    color: '#a78bfa',
  },
  {
    icon:  <FaBell />,
    title: 'Smart Reminders',
    desc:  'Receive overdue task alerts and upcoming service notifications so you always know what needs attention before it becomes a problem.',
    link:  '/garage',
    color: '#f87171',
  },
  {
    icon:  <FaShieldAlt />,
    title: 'Secure Authentication',
    desc:  'Powered by Auth0. Your data is protected with industry-standard security — sign in with your existing Google or social accounts.',
    link:  '/garage',
    color: '#34d399',
  },
  {
    icon:  <FaChartBar />,
    title: 'Service Analytics',
    desc:  'Track total costs, mileage trends, and service frequency across all your vehicles to make informed maintenance decisions.',
    link:  '/servicehistory',
    color: '#60a5fa',
  },
  {
    icon:  <FaCheckCircle />,
    title: 'Book a Service',
    desc:  'Get redirected to your vehicle brand\'s official service portal with one click. No searching — we handle the routing automatically.',
    link:  '/garage',
    color: '#fb923c',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Add Your Vehicle',    desc: 'Register your car with make, model, year, VIN, and a photo. Takes under a minute.' },
  { step: '02', title: 'Create Tasks',        desc: 'Add maintenance tasks with priority levels and due dates to stay organised.' },
  { step: '03', title: 'Track & Complete',    desc: 'Mark tasks complete as you go. Overdue tasks are automatically flagged for you.' },
  { step: '04', title: 'Log Service History', desc: 'Record every service with date, cost, mileage, and photo receipts.' },
];

const FEATURE_HIGHLIGHTS = [
  { img: trackimg,    title: 'Track Everything',       desc: 'One dashboard for all your vehicles and all their maintenance history.' },
  { img: maintainimg, title: 'Stay Ahead of Repairs',  desc: 'Priority-based tasks and overdue alerts keep you proactive, not reactive.' },
  { img: scheduleimg, title: 'Sync with Your Calendar', desc: 'Push maintenance due dates straight to Google Calendar in one click.' },
];

const Services = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="sv-page">

      {/* ── HEADER ── */}
      <div className="sv-header">
        <div className="sv-header-bg" aria-hidden="true" />
        <div className="sv-container sv-header-inner">
          <span className="sv-eyebrow">What We Offer</span>
          <h1 className="sv-title">Our Services</h1>
          <p className="sv-subtitle">
            Everything you need to keep your vehicles running smoothly —
            tracking, history, scheduling, and more, all in one place.
          </p>
          <div className="sv-header-actions">
            {isAuthenticated ? (
              <NavLink to="/garage" className="sv-btn sv-btn--primary">
                Open My Garage <HiArrowRight />
              </NavLink>
            ) : (
              <button className="sv-btn sv-btn--primary" onClick={() => loginWithRedirect()}>
                Get Started Free <HiArrowRight />
              </button>
            )}
            <NavLink to="/about" className="sv-btn sv-btn--ghost">Learn More</NavLink>
          </div>
        </div>
      </div>

      {/* ── SERVICE CARDS GRID ── */}
      <section className="sv-section sv-section--light">
        <div className="sv-container">
          <div className="sv-section-head sv-section-head--center">
            <span className="sv-eyebrow">Core Features</span>
            <h2>Everything under one roof</h2>
            <p className="sv-section-sub">
              Auto Sentry brings together the tools every vehicle owner needs,
              without the complexity.
            </p>
          </div>
          <div className="sv-cards-grid">
            {SERVICES.map(s => (
              <NavLink to={s.link} key={s.title} className="sv-card">
                <div className="sv-card-icon" style={{ background: `${s.color}1a`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="sv-card-accent" style={{ background: s.color }} />
                <h3 className="sv-card-title">{s.title}</h3>
                <p className="sv-card-desc">{s.desc}</p>
                <span className="sv-card-link">
                  Explore <HiArrowRight />
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="sv-section sv-section--dark">
        <div className="sv-container">
          <div className="sv-section-head sv-section-head--center">
            <span className="sv-eyebrow sv-eyebrow--light">Simple Process</span>
            <h2 className="sv-h2--light">How it works</h2>
            <p className="sv-section-sub--light">
              From setup to service history in four easy steps.
            </p>
          </div>
          <div className="sv-steps">
            {HOW_IT_WORKS.map((s, i) => (
              <div className="sv-step" key={s.step}>
                <div className="sv-step-num">{s.step}</div>
                {i < HOW_IT_WORKS.length - 1 && <div className="sv-step-line" />}
                <h3 className="sv-step-title">{s.title}</h3>
                <p className="sv-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ── */}
      <section className="sv-section sv-section--light">
        <div className="sv-container">
          <div className="sv-section-head sv-section-head--center">
            <span className="sv-eyebrow">In Detail</span>
            <h2>Built for every driver</h2>
          </div>
          <div className="sv-highlights">
            {FEATURE_HIGHLIGHTS.map(f => (
              <div className="sv-highlight" key={f.title}>
                <div className="sv-highlight-img-wrap">
                  <img src={f.img} alt={f.title} />
                </div>
                <div className="sv-highlight-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sv-cta-section">
        <div className="sv-container">
          <div className="sv-cta-card">
            <div className="sv-cta-bg" aria-hidden="true" />
            <div className="sv-cta-content">
              <span className="sv-eyebrow sv-eyebrow--light">Get Started</span>
              <h2>Ready to take control of your maintenance?</h2>
              <p>Join thousands of vehicle owners who trust Auto Sentry to stay on top of their car care.</p>
              {isAuthenticated ? (
                <NavLink to="/garage" className="sv-btn sv-btn--primary">
                  Open My Garage <HiArrowRight />
                </NavLink>
              ) : (
                <button className="sv-btn sv-btn--primary" onClick={() => loginWithRedirect()}>
                  Start for Free <HiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
