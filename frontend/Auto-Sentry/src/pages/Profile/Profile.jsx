import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import './Profile.css';
import {
  FaUser, FaEnvelope, FaIdBadge, FaCar,
  FaShieldAlt, FaCog, FaCheckCircle,
} from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) return null;

  // Auth0 user fields
  const joinDate = user.updated_at
    ? new Date(user.updated_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null;

  const provider = user.sub?.split('|')[0] ?? 'auth0';
  const providerLabel = {
    google: 'Google',
    auth0:  'Email / Password',
    github: 'GitHub',
  }[provider] ?? provider;

  const INFO_ROWS = [
    { icon: <FaUser />,    label: 'Full Name',   value: user.name        },
    { icon: <FaEnvelope />,label: 'Email',       value: user.email       },
    { icon: <FaIdBadge />, label: 'Username',    value: `@${user.nickname}` },
    { icon: <FaShieldAlt />,label: 'Sign-in Via', value: providerLabel   },
    ...(joinDate ? [{ icon: <FaCheckCircle />, label: 'Member Since', value: joinDate }] : []),
  ];

  const QUICK_LINKS = [
    { to: '/garage',        icon: <FaCar />,     label: 'My Garage',      desc: 'View and manage your vehicles'         },
    { to: '/servicehistory',icon: <FaCheckCircle />,label: 'Service History', desc: 'Browse your maintenance records'  },
    { to: '/settings',      icon: <FaCog />,     label: 'Settings',       desc: 'Manage account preferences'           },
  ];

  return (
    <div className="pf-page">

      {/* ── HEADER ── */}
      <div className="pf-header">
        <div className="pf-header-bg" aria-hidden="true" />
        <div className="pf-container pf-header-inner">
          <span className="pf-eyebrow">Account</span>
          <h1 className="pf-title">My Profile</h1>
          <p className="pf-subtitle">Your account details and quick access to key features.</p>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="pf-body">
        <div className="pf-container pf-body-inner">

          {/* ── LEFT: avatar card ── */}
          <aside className="pf-sidebar">
            <div className="pf-avatar-card">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="pf-avatar-img" />
              ) : (
                <div className="pf-avatar-fallback">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="pf-name">{user.name}</h2>
              <p className="pf-nickname">@{user.nickname}</p>

              {user.email_verified && (
                <span className="pf-verified-badge">
                  <FaCheckCircle /> Verified
                </span>
              )}

              <div className="pf-avatar-divider" />

              <div className="pf-avatar-meta">
                <span className="pf-meta-label">Signed in with</span>
                <span className="pf-meta-value">{providerLabel}</span>
              </div>
              {joinDate && (
                <div className="pf-avatar-meta">
                  <span className="pf-meta-label">Member since</span>
                  <span className="pf-meta-value">{joinDate}</span>
                </div>
              )}

              <NavLink to="/settings" className="pf-edit-btn">
                <FaCog /> Account Settings
              </NavLink>
            </div>
          </aside>

          {/* ── RIGHT: details + quick links ── */}
          <main className="pf-main">

            {/* Info card */}
            <div className="pf-info-card">
              <div className="pf-card-header">
                <FaUser className="pf-card-icon" />
                <h2>Account Information</h2>
              </div>
              <div className="pf-info-rows">
                {INFO_ROWS.map(row => (
                  <div className="pf-info-row" key={row.label}>
                    <div className="pf-info-icon">{row.icon}</div>
                    <div className="pf-info-content">
                      <span className="pf-info-label">{row.label}</span>
                      <span className="pf-info-value">{row.value ?? '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="pf-links-card">
              <div className="pf-card-header">
                <FaCar className="pf-card-icon" />
                <h2>Quick Access</h2>
              </div>
              <div className="pf-links-grid">
                {QUICK_LINKS.map(link => (
                  <NavLink to={link.to} key={link.to} className="pf-link-item">
                    <div className="pf-link-icon">{link.icon}</div>
                    <div className="pf-link-body">
                      <span className="pf-link-label">{link.label}</span>
                      <span className="pf-link-desc">{link.desc}</span>
                    </div>
                    <HiArrowRight className="pf-link-arrow" />
                  </NavLink>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
