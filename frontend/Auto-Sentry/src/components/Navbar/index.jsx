import React from 'react';
import './Navbar.css'; // Import the CSS file
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import logoImg from '../../assets/AutoSentry_transparent.png'

const Navbar = () => {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-link">
        {/* <img src={logoImg} alt='logo' id='logo' /> */}
        <h1>AutoSentry</h1>
      </NavLink>
      <FaBars className="bars-icon" />
      <div className="nav-menu">
        <NavLink to="/about" className="nav-link" activeClassName="active">
          About
        </NavLink>
        <NavLink to="/services" className="nav-link" activeClassName="active">
          Services
        </NavLink>
        <NavLink to="/contact-us" className="nav-link" activeClassName="active">
          Contact Us
        </NavLink>
        <NavLink to="/sign-up" className="nav-link" activeClassName="active">
          Sign Up
        </NavLink>
      </div>
      <div className="nav-btn">
        <NavLink to="/signin" className="nav-btn-link">
          Sign In
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
