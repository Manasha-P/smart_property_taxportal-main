import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EmblemIcon, PhoneIcon, UserIcon } from "./Icons";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top Official Utility Bar */}
      <div className="gov-top-bar">
        <div className="top-bar-content">
          <span className="top-bar-item">Government Digital Taxation Portal</span>
          <div className="top-bar-right">
            <span className="top-bar-item flex-align">
              <PhoneIcon size={14} color="#cbd5e1" /> Helpline: 1800-111-TAXES (8 AM - 8 PM)
            </span>
            <span className="top-bar-item font-bold">English</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand-logo">
            <div className="emblem-circle">
              <EmblemIcon size={24} color="#ffffff" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Smart Property Tax Portal</span>
              <span className="brand-subtitle">Municipal Revenue & Land Records System</span>
            </div>
          </Link>
        </div>

        <nav className="navbar-links">
          <Link to="/" className={location.pathname === "/" ? "nav-active" : ""}>
            Home
          </Link>
          <Link to="/portal" className={location.pathname === "/portal" ? "nav-active" : ""}>
            Tax Portal
          </Link>
          <Link to="/admin" className={location.pathname === "/admin" ? "nav-active" : ""}>
            Officer Portal
          </Link>

          {user && (
            <div className="user-menu margin-left-xs">
              <span className="user-name flex-align">
                <UserIcon size={16} color="#cbd5e1" /> {user.name || user.email}
              </span>
              <button onClick={logout} className="btn-logout">
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;