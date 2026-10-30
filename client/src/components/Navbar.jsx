import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NationalEmblemIcon,
  PhoneIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeIcon,
} from "./Icons";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState("");
  // Accessibility state
  const [fontSizeLevel, setFontSizeLevel] = useState("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      };
      setCurrentTime(now.toLocaleString("en-IN", options) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle font size scaling
  const handleFontSize = (level) => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === "small") {
      root.style.fontSize = "14px";
    } else if (level === "large") {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }
  };

  // Handle high contrast mode
  const toggleContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }
      return next;
    });
  };

  return (
    <>
      {/* Sovereign National Tricolor Ribbon */}
      <div className="gov-tricolor-bar" aria-hidden="true">
        <span className="tricolor-saffron"></span>
        <span className="tricolor-white"></span>
        <span className="tricolor-green"></span>
      </div>

      {/* Top Official Government & Banking Utility Bar */}
      <div className="gov-top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <span className="top-gov-seal-text flex-align">
              <NationalEmblemIcon size={18} color="#d4af37" />
              <strong>भारत सरकार | GOVERNMENT OF INDIA</strong>
              <span className="gov-bar-separator">|</span>
              <span className="gov-dept-name">Ministry of Housing & Urban Affairs • Core Banking Treasury Gateway</span>
            </span>
          </div>

          <div className="top-bar-right">
            {/* Live IST Clock */}
            <span className="top-bar-item live-clock flex-align">
              <ClockIcon size={14} color="#94a3b8" />
              <span className="font-mono">{currentTime || "Loading IST..."}</span>
            </span>

            {/* Accessibility Controls */}
            <div className="accessibility-toolbar flex-align">
              <span className="access-label">Screen Text:</span>
              <button
                type="button"
                className={`btn-access-text ${fontSizeLevel === "small" ? "active" : ""}`}
                onClick={() => handleFontSize("small")}
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                type="button"
                className={`btn-access-text ${fontSizeLevel === "normal" ? "active" : ""}`}
                onClick={() => handleFontSize("normal")}
                title="Standard Text Size"
              >
                A
              </button>
              <button
                type="button"
                className={`btn-access-text ${fontSizeLevel === "large" ? "active" : ""}`}
                onClick={() => handleFontSize("large")}
                title="Increase Text Size"
              >
                A+
              </button>
              <button
                type="button"
                className={`btn-access-contrast ${highContrast ? "active" : ""}`}
                onClick={toggleContrast}
                title="High Contrast View"
              >
                🌓 Contrast
              </button>
            </div>

            {/* Bilingual Switcher */}
            <div className="lang-switcher flex-align">
              <GlobeIcon size={14} color="#94a3b8" />
              <button
                type="button"
                className={`lang-btn ${language === "EN" ? "active" : ""}`}
                onClick={() => setLanguage("EN")}
              >
                English
              </button>
              <span className="dot">•</span>
              <button
                type="button"
                className={`lang-btn ${language === "HI" ? "active" : ""}`}
                onClick={() => setLanguage("HI")}
              >
                हिन्दी
              </button>
            </div>

            {/* Helpdesk Toll-Free */}
            <span className="top-bar-item flex-align helpdesk-badge">
              <PhoneIcon size={13} color="#10b981" />
              <span>Toll-Free: <strong>1800-111-8293</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Stately Government & Banking Header */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" className="brand-logo">
              <div className="emblem-shield">
                <NationalEmblemIcon size={34} color="#d4af37" />
              </div>
              <div className="brand-text">
                <div className="brand-title-row flex-align">
                  <span className="brand-title">AI-BASED PROPERTY TAX PORTAL</span>
                  <span className="gov-portal-badge">OFFICIAL MUNICIPAL & BANKING PORTAL</span>
                </div>
                <span className="brand-subtitle">
                  AI-Based Property Tax Self-Assessment Tracking Portal
                </span>
                <span className="brand-sub-dept">
                  Central Urban Revenue Directorate & Reserve Bank Payment Interoperability Framework
                </span>
              </div>
            </Link>
          </div>

          <nav className="navbar-links" aria-label="Portal Primary Navigation">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "nav-active" : ""}`}
            >
              🏛️ Portal Home
            </Link>
            <Link
              to="/portal"
              className={`nav-link ${
                location.pathname.startsWith("/portal") ||
                location.pathname.startsWith("/dashboard") ||
                location.pathname.startsWith("/analysis") ||
                location.pathname.startsWith("/tax-overview") ||
                location.pathname.startsWith("/monthly-analysis") ||
                location.pathname.startsWith("/annual-analysis") ||
                location.pathname.startsWith("/bank-records") ||
                location.pathname.startsWith("/compliance")
                  ? "nav-active"
                  : ""
              }`}
            >
              📑 Citizen Tax Portal
            </Link>
            <Link
              to="/admin"
              className={`nav-link ${location.pathname.startsWith("/admin") ? "nav-active" : ""}`}
            >
              🛡️ Municipal Officer Portal
            </Link>

            {/* Bank Security Badge */}
            <div className="bank-security-indicator flex-align" title="Protected with 256-Bit Financial Encryption and RBI NetBanking Guidelines">
              <ShieldCheckIcon size={16} color="#10b981" />
              <span>256-Bit SSL Secured</span>
            </div>

            {user ? (
              <div className="user-menu margin-left-xs">
                <span className="user-name flex-align">
                  <UserIcon size={16} color="#cbd5e1" /> {user.name || user.email}
                </span>
                <button onClick={logout} className="btn-logout">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-officer-sso flex-align">
                <UserIcon size={14} color="#ffffff" />
                <span>Officer Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Official Government & Banking Flash Bulletin Marquee */}
      <div className="gov-marquee-ticker" role="region" aria-label="Official Notifications Ticker">
        <div className="marquee-badge flex-align">
          <span className="pulse-dot"></span>
          <strong>OFFICIAL GAZETTE</strong>
        </div>
        <div className="marquee-scroll-container">
          <div className="marquee-text">
            <span>
              🔔 <strong>REBATE NOTICE:</strong> Avail 5% early payment rebate on Annual Property Tax for FY 2025–26 if cleared before 30 November.
            </span>
            <span className="marquee-separator">•</span>
            <span>
              🏦 <strong>BANKING CLEARANCE:</strong> Instant electronic reconciliation active across State Bank of India, Indian Bank, and Bank of India NetBanking / UPI.
            </span>
            <span className="marquee-separator">•</span>
            <span>
              ⚖️ <strong>STATUTORY COMPLIANCE:</strong> All property assessments are generated under Section 114 of the Municipal Corporation Act & Rule 4 of Urban Revenue Code.
            </span>
            <span className="marquee-separator">•</span>
            <span>
              📜 <strong>FORM-V CERTIFICATES:</strong> Digitally signed Property Tax Clearance Certificates with QR verification now available for instant download.
            </span>
            <span className="marquee-separator">•</span>
            <span>
              🔒 <strong>SECURITY ADVISORY:</strong> Taxpayers are reminded that municipal officers will never request UPI PIN or NetBanking OTP for tax payment confirmation.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
