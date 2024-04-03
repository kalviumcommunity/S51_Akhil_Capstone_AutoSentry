import React from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { IoCarSharp } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { ToastContainer } from 'react-toastify';

const Navbar = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

  console.log("Current User", user);

  return (
    <nav className="nav">
      <ToastContainer />
      <NavLink to="/" className="nav-link">
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
        {!isAuthenticated && (
          <NavLink to="/sign-up" className="nav-link" activeClassName="active">
            Sign Up
          </NavLink>
        )}
      </div>
      <div className="auth0">
        {isAuthenticated && (
          <div className="my-garage">
            <IoCarSharp />
            <NavLink to="/garage" className="nav-link" activeClassName="active">
              MY GARAGE
            </NavLink>
          </div>
        )}
        {isAuthenticated && (
          <div className="my-account">
            <RiAccountCircleFill />
            <NavLink to="/about" className="nav-link" activeClassName="active">
              MY ACCOUNT
            </NavLink>
          </div>
        )}
      </div>
      {/* <div className="nav-btn">
        {isAuthenticated ? (
          <button className="nav-btn-link" onClick={() => logout()}>Logout</button>
        ) : (
          <button className="nav-btn-link" onClick={() => loginWithRedirect()}>Login</button>
        )}
      </div> */}
      {!isAuthenticated && (
          <button className="nav-btn-link" onClick={() => loginWithRedirect()}>Login</button>
        )}

    </nav>
  );
}

export default Navbar;
