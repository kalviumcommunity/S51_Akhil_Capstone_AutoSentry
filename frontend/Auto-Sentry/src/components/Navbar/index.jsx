import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logoimg from '../../assets/AutoSentry_transparent.png';
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaCar, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiAccountCircleFill } from "react-icons/ri";

const Navbar = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const dropdownRef                     = useRef(null);

  // Frosted glass on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setMenuOpen(false); setDropdownOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeAll = () => { setMenuOpen(false); setDropdownOpen(false); };

  const menuItems = [
    { to: "/garage",   icon: <FaCar />,           label: "My Garage"  },
    { to: "/profile",  icon: <FaUser />,           label: "My Profile" },
    { to: "/settings", icon: <FaCog />,            label: "Settings"   },
    { to: "/help",     icon: <FaQuestionCircle />, label: "Help"       },
  ];

  return (
    <div className="nav-container">
      <nav className={`nav${scrolled ? " nav--scrolled" : ""}`}>

        {/* Logo */}
        <NavLink to="/" className="logocon" onClick={closeAll}>
          <img src={logoimg} alt="Auto Sentry" className="logo-img" />
        </NavLink>

        {/* Hamburger */}
        <button
          className="bars-icon"
          onClick={() => setMenuOpen(p => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Nav links */}
        <div className={`nav-menu${menuOpen ? " nav-menu--open" : ""}`}>
          <NavLink to="/about"      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={closeAll}>About</NavLink>
          <NavLink to="/services"   className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={closeAll}>Services</NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={closeAll}>Contact Us</NavLink>
        </div>

        {/* Auth */}
        <div className="auth0">
          {isAuthenticated ? (
            /* Entire trigger + dropdown in ONE ref'd container — no gap */
            <div className="account-menu" ref={dropdownRef}>
              <button
                className="account-trigger"
                onClick={() => setDropdownOpen(p => !p)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {user?.picture
                  ? <img src={user.picture} alt="avatar" className="account-avatar" />
                  : <RiAccountCircleFill size={20} />
                }
                <span className="account-trigger-name">My Account</span>
                <TiArrowSortedDown className={`account-chevron${dropdownOpen ? " account-chevron--open" : ""}`} />
              </button>

              {/* Dropdown — inside same container, no gap */}
              {dropdownOpen && (
                <div className="account-dropdown" role="menu">
                  {/* User info */}
                  <div className="account-dropdown-header">
                    {user?.picture
                      ? <img src={user.picture} alt="Profile" className="account-dropdown-avatar" />
                      : <div className="account-dropdown-initials">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    }
                    <div>
                      <p className="account-dropdown-name">{user?.name}</p>
                      <p className="account-dropdown-email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="account-dropdown-divider" />

                  {/* Menu links */}
                  <div className="account-dropdown-links">
                    {menuItems.map(item => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className="account-dropdown-item"
                        onClick={closeAll}
                        role="menuitem"
                      >
                        <span className="account-dropdown-item-icon">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>

                  <div className="account-dropdown-divider" />

                  {/* Logout */}
                  <button
                    className="account-dropdown-logout"
                    onClick={() => { closeAll(); logout(); }}
                    role="menuitem"
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-btn-link" onClick={() => loginWithRedirect()}>
              Log In
            </button>
          )}
        </div>

      </nav>
    </div>
  );
};

export default Navbar;
