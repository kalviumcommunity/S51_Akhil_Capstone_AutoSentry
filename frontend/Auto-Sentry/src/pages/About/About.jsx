import './About.css';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  FaCheckCircle, FaCar, FaCalendarAlt, FaHistory,
  FaShieldAlt, FaUsers, FaCloudUploadAlt, FaBolt,
  FaGithub, FaLinkedin,
} from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import linkedinImage from '../../assets/linkedin.png';
import githubImage   from '../../assets/github.png';

const WHY_US = [
  { icon: <FaCar />,            text: 'Centralised maintenance log'       },
  { icon: <FaCheckCircle />,    text: 'Priority-based task tracking'      },
  { icon: <FaCalendarAlt />,    text: 'Google Calendar integration'       },
  { icon: <FaHistory />,        text: 'Firebase-backed service history'   },
  { icon: <FaUsers />,          text: 'Multi-vehicle support'             },
  { icon: <FaShieldAlt />,      text: 'Auth0 secure authentication'       },
  { icon: <FaCloudUploadAlt />, text: 'Photo uploads via Firebase'        },
  { icon: <FaBolt />,           text: 'Real-time state updates'           },
];

const TECH_STACK = [
  { name: 'React 18',        desc: 'Component-based UI',              color: '#61dafb' },
  { name: 'Express',         desc: 'REST API backend',                color: '#68d391' },
  { name: 'MongoDB',         desc: 'Vehicle & task storage',          color: '#4db33d' },
  { name: 'Firebase',        desc: 'Image storage & service history', color: '#ffca28' },
  { name: 'Auth0',            desc: 'Secure authentication',          color: '#eb5424' },
  { name: 'Google Calendar', desc: 'Maintenance scheduling',          color: '#4285f4' },
  { name: 'Vite',            desc: 'Lightning-fast build tool',       color: '#646cff' },
  { name: 'Node.js',         desc: 'JavaScript runtime',              color: '#8cc84b' },
];

const TEAM = [
  {
    initial:  'A',
    name:     'Akhil K Kurian',
    role:     'Full-Stack Developer',
    bio:      'Built Auto Sentry from the ground up as a capstone project — designing the Express API, MongoDB data models, React frontend, and all third-party integrations.',
    github:   'https://github.com/akhilk49',
    linkedin: 'https://www.linkedin.com/in/akhil-k-kurian-2a473a281/',
  },
];

const About = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="about-page">

      {/* ── HEADER BAND ── */}
      <div className="about-header">
        <div className="about-header-inner">
          <span className="about-eyebrow">Our Story</span>
          <h1 className="about-title">About Auto Sentry</h1>
          <p className="about-subtitle">
            A modern maintenance tracker built to keep every vehicle on the road.
          </p>
        </div>
      </div>

      {/* ── MISSION ── */}
      <section className="about-mission">
        <div className="about-container about-mission-inner">
          <div className="about-mission-text">
            <span className="about-section-eyebrow">What We Do</span>
            <h2>Your vehicle's health, always in view.</h2>
            <p>
              Auto Sentry is a full-stack vehicle maintenance tracker that helps you
              stay ahead of repairs, services, and scheduled upkeep — all in one
              place. Whether you own a single car or manage a small fleet, it turns
              scattered maintenance notes into a structured, searchable history.
            </p>
            <blockquote className="about-mission-quote">
              We believe no vehicle owner should be caught off guard by a missed oil
              change or an overdue inspection. Auto Sentry's mission is to give every
              driver a clear, effortless view of their vehicle's health — and the
              tools to act on it.
            </blockquote>
            <div className="about-mission-actions">
              {isAuthenticated ? (
                <NavLink to="/garage" className="about-btn about-btn--primary">
                  Go to My Garage <HiArrowRight />
                </NavLink>
              ) : (
                <button className="about-btn about-btn--primary" onClick={() => loginWithRedirect()}>
                  Get Started <HiArrowRight />
                </button>
              )}
              <NavLink to="/services" className="about-btn about-btn--ghost">
                View Services
              </NavLink>
            </div>
          </div>

          <div className="about-mission-visual">
            <div className="about-stat-stack">
              {[
                { num: '10K+', lbl: 'Vehicles Tracked'      },
                { num: '50K+', lbl: 'Tasks Completed'        },
                { num: '98%',  lbl: 'Satisfaction Rate'      },
                { num: '24/7', lbl: 'Always Available'        },
              ].map(s => (
                <div className="about-stat" key={s.lbl}>
                  <span className="about-stat-num">{s.num}</span>
                  <span className="about-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="about-why">
        <div className="about-container">
          <div className="about-section-head">
            <span className="about-section-eyebrow">Why Auto Sentry</span>
            <h2>Everything you need, nothing you don't.</h2>
          </div>
          <div className="about-why-grid">
            {WHY_US.map(item => (
              <div className="about-why-card" key={item.text}>
                <span className="about-why-icon">{item.icon}</span>
                <span className="about-why-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team">
        <div className="about-container">
          <div className="about-section-head about-section-head--center">
            <span className="about-section-eyebrow about-section-eyebrow--light">The People</span>
            <h2 className="about-section-title--light">Meet the Team</h2>
            <p className="about-section-sub--light">
              Auto Sentry was built by a passionate developer dedicated to solving
              real-world vehicle maintenance challenges.
            </p>
          </div>
          <div className="about-team-grid">
            {TEAM.map(m => (
              <div className="about-team-card" key={m.name}>
                <div className="about-team-avatar">{m.initial}</div>
                <h3 className="about-team-name">{m.name}</h3>
                <p className="about-team-role">{m.role}</p>
                <p className="about-team-bio">{m.bio}</p>
                <div className="about-team-links">
                  <a href={m.github}   target="_blank" rel="noreferrer" aria-label="GitHub"   className="about-social-btn">
                    <img src={githubImage}   alt="GitHub"   />
                  </a>
                  <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="about-social-btn">
                    <img src={linkedinImage} alt="LinkedIn" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="about-tech">
        <div className="about-container">
          <div className="about-section-head about-section-head--center">
            <span className="about-section-eyebrow">Under the Hood</span>
            <h2>Built With</h2>
            <p className="about-section-sub">
              Auto Sentry is powered by a modern, production-ready technology stack.
            </p>
          </div>
          <div className="about-tech-grid">
            {TECH_STACK.map(t => (
              <div className="about-tech-card" key={t.name}>
                <div className="about-tech-dot" style={{ background: t.color }} />
                <h4 className="about-tech-name">{t.name}</h4>
                <p className="about-tech-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta-card">
            <div className="about-cta-bg" aria-hidden="true" />
            <div className="about-cta-content">
              <span className="about-section-eyebrow about-section-eyebrow--light">Ready?</span>
              <h2>Start tracking your vehicles today.</h2>
              <p>Join thousands of car owners who trust Auto Sentry to keep their vehicles running smoothly.</p>
              {isAuthenticated ? (
                <NavLink to="/garage" className="about-btn about-btn--primary">
                  Open My Garage <HiArrowRight />
                </NavLink>
              ) : (
                <button className="about-btn about-btn--primary" onClick={() => loginWithRedirect()}>
                  Get Started for Free <HiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
