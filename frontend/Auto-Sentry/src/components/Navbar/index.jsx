import React, { useState } from "react";
import "./Navbar.css";
import logoimg from '../../assets/AutoSentry_transparent.png'
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiAccountCircleFill } from "react-icons/ri";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [showDropdown, setShowDropdown] = useState(false);

  console.log("Current User", user);

  return (
    <div className="nav-container">
    <nav className="nav">
      <div className="circlenav"></div>
      <ToastContainer />
      <NavLink to="/" className="logocon">
        <img src={logoimg} alt="logo" className="logo-img" />
      </NavLink>
      <FaBars className="bars-icon" />
      <div className="nav-menu">
        <NavLink
          to="/about"
          className="nav-link"
          activeClassName="active"
        >
          About
        </NavLink>
        <NavLink
          to="/services"
          className="nav-link"
          activeClassName="active"
        >
          Services
        </NavLink>
        <NavLink
          to="/contact-us"
          className="nav-link"
          activeClassName="active"
        >
          Contact Us
        </NavLink>
      </div>
      <div className="auth0">
        {isAuthenticated && (
          <div
            className="my-account"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <NavLink to="/about" className="nav-link" activeClassName="active">
              <RiAccountCircleFill /> &nbsp; MY ACCOUNT <TiArrowSortedDown />
            </NavLink>
          </div>
        )}
      </div>
      {!isAuthenticated && (
        <button
          className="nav-btn-link"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      )}
      </nav>
      {isAuthenticated && showDropdown && (
        <div
          className="dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="userinfo">
            <img src={user.picture} alt="Profile" />
            <h3>
              {user.name}
              <br />
            </h3>
          </div>
          <NavLink to="/garage" activeClassName="active">
            My Garage
          </NavLink>
          <NavLink to="/profile" activeClassName="active">
            My Profile
          </NavLink>
          <NavLink to="/settings" activeClassName="active">
            Settings
          </NavLink>
          <NavLink to="/help" activeClassName="active">
            Help
          </NavLink>
          <NavLink to="/about" activeClassName="active">
            Account Settings
          </NavLink>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
