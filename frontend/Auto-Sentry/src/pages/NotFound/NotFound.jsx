import { NavLink } from 'react-router-dom';
import './NotFound.css';
import { FaCar } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';

const NotFound = () => (
  <div className="nf-page">
    <div className="nf-bg" aria-hidden="true" />
    <div className="nf-content">
      <div className="nf-icon"><FaCar /></div>
      <h1 className="nf-code">404</h1>
      <h2 className="nf-title">Page not found</h2>
      <p className="nf-desc">
        Looks like this road doesn't go anywhere. The page you're looking for
        doesn't exist or may have been moved.
      </p>
      <div className="nf-actions">
        <NavLink to="/" className="nf-btn nf-btn--primary">
          Go Home <HiArrowRight />
        </NavLink>
        <NavLink to="/garage" className="nf-btn nf-btn--ghost">
          My Garage
        </NavLink>
      </div>
    </div>
  </div>
);

export default NotFound;
