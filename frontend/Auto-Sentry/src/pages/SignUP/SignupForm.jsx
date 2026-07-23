import './SignupForm.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaUserPlus } from 'react-icons/fa';

const SignupForm = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="auth-logo-text">Auto<span className="auth-logo-dot">Sentry</span></span>
        </div>

        <h1>Create your account</h1>
        <p className="auth-subtitle">Join thousands of drivers keeping their vehicles in top shape.</p>

        <button
          type="button"
          className="auth-btn"
          onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
        >
          <FaUserPlus size={14} /> Sign Up with Auth0
        </button>

        <div className="auth-divider"><span>Already have an account?</span></div>

        <div className="auth-link-row">
          <p>Already registered? <Link to="/signin">Sign in</Link></p>
        </div>

        <div className="auth-features">
          <div className="auth-feature"><span className="auth-feature-dot" />Free forever — no credit card required</div>
          <div className="auth-feature"><span className="auth-feature-dot" />Add unlimited vehicles to your garage</div>
          <div className="auth-feature"><span className="auth-feature-dot" />Secure sign-in via Google or email</div>
        </div>

      </div>
    </div>
  );
};

export default SignupForm;
