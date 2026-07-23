import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import './Settings.css';
import {
  FaBell, FaCar, FaShieldAlt, FaPalette,
  FaSignOutAlt, FaTrash, FaToggleOn, FaToggleOff,
  FaChevronRight, FaCalendarAlt, FaEnvelope,
} from 'react-icons/fa';

/* ── Default preference state ── */
const DEFAULT_NOTIFS = {
  emailReminders:   true,
  overdueAlerts:    true,
  weeklyDigest:     false,
  serviceReminders: true,
  appUpdates:       false,
};

const DEFAULT_GARAGE = {
  defaultMileageUnit: 'km',
  reminderDaysBefore: '7',
  autoArchiveDone:    true,
};

const Settings = () => {
  const { user, isAuthenticated, logout } = useAuth0();

  const [notifs, setNotifs]         = useState(DEFAULT_NOTIFS);
  const [garage, setGarage]         = useState(DEFAULT_GARAGE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving]         = useState(false);

  if (!isAuthenticated) return null;

  const toggleNotif = (key) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved');
      setSaving(false);
    }, 600);
  };

  /* ── Section data ── */
  const NOTIF_TOGGLES = [
    { key: 'emailReminders',   icon: <FaEnvelope />,    label: 'Email Reminders',       desc: 'Receive email reminders for upcoming maintenance tasks' },
    { key: 'overdueAlerts',    icon: <FaBell />,        label: 'Overdue Alerts',        desc: 'Get notified when a task passes its due date' },
    { key: 'serviceReminders', icon: <FaCalendarAlt />, label: 'Service Reminders',     desc: 'Reminders before scheduled service appointments' },
    { key: 'weeklyDigest',     icon: <FaEnvelope />,    label: 'Weekly Digest',         desc: 'A weekly summary of your garage activity' },
    { key: 'appUpdates',       icon: <FaBell />,        label: 'Product Updates',       desc: 'News about new features and improvements' },
  ];

  return (
    <div className="st-page">

      {/* ── HEADER ── */}
      <div className="st-header">
        <div className="st-header-bg" aria-hidden="true" />
        <div className="st-container st-header-inner">
          <div>
            <span className="st-eyebrow">Account</span>
            <h1 className="st-title">Settings</h1>
            <p className="st-subtitle">Manage your preferences and account options.</p>
          </div>
          <NavLink to="/profile" className="st-back-btn">← My Profile</NavLink>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="st-body">
        <div className="st-container st-body-inner">

          {/* ── LEFT NAV ── */}
          <nav className="st-sidenav">
            {[
              { href: '#notifications', icon: <FaBell />,      label: 'Notifications'   },
              { href: '#garage-prefs',  icon: <FaCar />,       label: 'Garage'          },
              { href: '#appearance',    icon: <FaPalette />,   label: 'Appearance'      },
              { href: '#security',      icon: <FaShieldAlt />, label: 'Security'        },
              { href: '#danger-zone',   icon: <FaTrash />,     label: 'Danger Zone'     },
            ].map(item => (
              <a key={item.href} href={item.href} className="st-sidenav-item">
                <span className="st-sidenav-icon">{item.icon}</span>
                {item.label}
                <FaChevronRight className="st-sidenav-arrow" />
              </a>
            ))}
          </nav>

          {/* ── MAIN PANELS ── */}
          <div className="st-panels">

            {/* ── NOTIFICATIONS ── */}
            <section className="st-card" id="notifications">
              <div className="st-card-header">
                <FaBell className="st-card-icon" />
                <h2>Notifications</h2>
              </div>
              <div className="st-card-body">
                {NOTIF_TOGGLES.map(t => (
                  <div className="st-toggle-row" key={t.key}>
                    <div className="st-toggle-icon">{t.icon}</div>
                    <div className="st-toggle-info">
                      <span className="st-toggle-label">{t.label}</span>
                      <span className="st-toggle-desc">{t.desc}</span>
                    </div>
                    <button
                      className={`st-toggle-btn${notifs[t.key] ? ' st-toggle-btn--on' : ''}`}
                      onClick={() => toggleNotif(t.key)}
                      aria-label={`Toggle ${t.label}`}
                      aria-checked={notifs[t.key]}
                      role="switch"
                    >
                      {notifs[t.key] ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ── GARAGE PREFERENCES ── */}
            <section className="st-card" id="garage-prefs">
              <div className="st-card-header">
                <FaCar className="st-card-icon" />
                <h2>Garage Preferences</h2>
              </div>
              <div className="st-card-body">

                <div className="st-field-row">
                  <div className="st-field-info">
                    <span className="st-field-label">Default Mileage Unit</span>
                    <span className="st-field-desc">Used across all vehicles and service records</span>
                  </div>
                  <div className="st-field-control">
                    <div className="st-segment">
                      {['km', 'miles'].map(unit => (
                        <button
                          key={unit}
                          className={`st-segment-btn${garage.defaultMileageUnit === unit ? ' st-segment-btn--active' : ''}`}
                          onClick={() => setGarage(p => ({ ...p, defaultMileageUnit: unit }))}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="st-field-row">
                  <div className="st-field-info">
                    <span className="st-field-label">Reminder Lead Time</span>
                    <span className="st-field-desc">Days before due date to send a reminder</span>
                  </div>
                  <div className="st-field-control">
                    <select
                      className="st-select"
                      value={garage.reminderDaysBefore}
                      onChange={e => setGarage(p => ({ ...p, reminderDaysBefore: e.target.value }))}
                    >
                      {['1', '3', '5', '7', '14', '30'].map(d => (
                        <option key={d} value={d}>{d} day{d !== '1' ? 's' : ''} before</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="st-toggle-row">
                  <div className="st-toggle-icon"><FaCar /></div>
                  <div className="st-toggle-info">
                    <span className="st-toggle-label">Auto-archive Completed Tasks</span>
                    <span className="st-toggle-desc">Automatically move completed tasks out of the active view</span>
                  </div>
                  <button
                    className={`st-toggle-btn${garage.autoArchiveDone ? ' st-toggle-btn--on' : ''}`}
                    onClick={() => setGarage(p => ({ ...p, autoArchiveDone: !p.autoArchiveDone }))}
                    role="switch"
                    aria-checked={garage.autoArchiveDone}
                  >
                    {garage.autoArchiveDone ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>

              </div>
            </section>

            {/* ── APPEARANCE ── */}
            <section className="st-card" id="appearance">
              <div className="st-card-header">
                <FaPalette className="st-card-icon" />
                <h2>Appearance</h2>
              </div>
              <div className="st-card-body">
                <div className="st-field-row">
                  <div className="st-field-info">
                    <span className="st-field-label">Theme</span>
                    <span className="st-field-desc">Choose your preferred colour scheme</span>
                  </div>
                  <div className="st-field-control">
                    <div className="st-segment">
                      {['Light', 'Dark', 'System'].map(t => (
                        <button
                          key={t}
                          className={`st-segment-btn${t === 'Light' ? ' st-segment-btn--active' : ''}`}
                          onClick={() => toast.info('Theme switching coming soon')}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="st-field-row">
                  <div className="st-field-info">
                    <span className="st-field-label">Accent Colour</span>
                    <span className="st-field-desc">Primary colour used across buttons and highlights</span>
                  </div>
                  <div className="st-field-control st-colour-swatches">
                    {['#5de0a5', '#15cdfc', '#a78bfa', '#f87171', '#f59e0b'].map(c => (
                      <button
                        key={c}
                        className={`st-swatch${c === '#5de0a5' ? ' st-swatch--active' : ''}`}
                        style={{ background: c }}
                        onClick={() => toast.info('Custom themes coming soon')}
                        aria-label={`Select colour ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECURITY ── */}
            <section className="st-card" id="security">
              <div className="st-card-header">
                <FaShieldAlt className="st-card-icon" />
                <h2>Security</h2>
              </div>
              <div className="st-card-body">

                <div className="st-info-row">
                  <div className="st-info-icon"><FaShieldAlt /></div>
                  <div className="st-info-content">
                    <span className="st-info-label">Authentication Provider</span>
                    <span className="st-info-value">
                      Managed by Auth0 — your password and sign-in are handled securely by Auth0.
                    </span>
                  </div>
                  <a
                    href="https://auth0.com"
                    target="_blank"
                    rel="noreferrer"
                    className="st-external-btn"
                  >
                    Auth0 Dashboard <FaChevronRight />
                  </a>
                </div>

                <div className="st-info-row">
                  <div className="st-info-icon"><FaEnvelope /></div>
                  <div className="st-info-content">
                    <span className="st-info-label">Email Address</span>
                    <span className="st-info-value">{user?.email}</span>
                  </div>
                  <span className={`st-badge ${user?.email_verified ? 'st-badge--green' : 'st-badge--red'}`}>
                    {user?.email_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                <div className="st-info-row">
                  <div className="st-info-icon"><FaShieldAlt /></div>
                  <div className="st-info-content">
                    <span className="st-info-label">Sign Out Everywhere</span>
                    <span className="st-info-value">Log out of Auto Sentry on all devices</span>
                  </div>
                  <button className="st-secondary-btn" onClick={() => logout()}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>

              </div>
            </section>

            {/* ── DANGER ZONE ── */}
            <section className="st-card st-card--danger" id="danger-zone">
              <div className="st-card-header st-card-header--danger">
                <FaTrash className="st-card-icon" />
                <h2>Danger Zone</h2>
              </div>
              <div className="st-card-body">
                <div className="st-info-row">
                  <div className="st-info-icon st-info-icon--red"><FaTrash /></div>
                  <div className="st-info-content">
                    <span className="st-info-label">Delete Account</span>
                    <span className="st-info-value">
                      Permanently remove your account and all associated vehicles, tasks, and service history. This cannot be undone.
                    </span>
                  </div>
                  <button
                    className="st-danger-btn"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

            {/* Save button */}
            <div className="st-save-row">
              <button className="st-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteModal && (
        <div className="st-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="st-modal" onClick={e => e.stopPropagation()}>
            <div className="st-modal-icon"><FaTrash /></div>
            <h3>Delete your account?</h3>
            <p>
              This will permanently delete your account, all vehicles, maintenance tasks, and service history.
              This action <strong>cannot be undone</strong>.
            </p>
            <div className="st-modal-actions">
              <button className="st-modal-btn st-modal-btn--cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="st-modal-btn st-modal-btn--confirm"
                onClick={() => { toast.error('Account deletion coming soon'); setShowDeleteModal(false); }}
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
