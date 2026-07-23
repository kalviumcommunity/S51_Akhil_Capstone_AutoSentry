import './LoginForm.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="auth-logo-text">Auto<span className="auth-logo-dot">Sentry</span></span>
        </div>

        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to access your garage and maintenance history.</p>

        <button type="button" className="auth-btn" onClick={() => loginWithRedirect()}>
          <FaLock size={14} /> Sign In with Auth0
        </button>

        <div className="auth-divider"><span>New to Auto Sentry?</span></div>

        <div className="auth-link-row">
          <p>Don't have an account? <Link to="/sign-up">Create one free</Link></p>
        </div>

        <div className="auth-features">
          <div className="auth-feature"><span className="auth-feature-dot" />Track maintenance across all your vehicles</div>
          <div className="auth-feature"><span className="auth-feature-dot" />Log service history with photo receipts</div>
          <div className="auth-feature"><span className="auth-feature-dot" />Sync due dates with Google Calendar</div>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
