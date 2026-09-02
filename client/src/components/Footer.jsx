import { Link } from "react-router-dom";
import { EmblemIcon, PhoneIcon, MailIcon } from "./Icons";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-col footer-col-main">
          <div className="footer-brand">
            <span className="footer-logo-icon">
              <EmblemIcon size={30} color="#10b981" />
            </span>
            <div>
              <h4 className="footer-brand-title">Smart Property Tax Portal</h4>
              <span className="footer-brand-sub">Government Digital Taxation Infrastructure</span>
            </div>
          </div>
          <p className="footer-desc">
            A unified municipal property tax platform designed to automate tax information retrieval, bank payment consolidation, monthly tracking, and AI compliance analysis.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/portal">Search Tax Dues</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Key Services</h4>
          <ul className="footer-links">
            <li><a href="#services">Aadhaar Search Workflow</a></li>
            <li><a href="#services">Bank-wise Tax Dues</a></li>
            <li><a href="#services">Monthly Breakdown Engine</a></li>
            <li><a href="#services">AI Compliance Engine</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Helpdesk & Contact</h4>
          <ul className="footer-contact-list">
            <li className="flex-align"><PhoneIcon size={16} color="#10b981" /> <strong>Toll-Free:</strong> 1800-111-TAXES</li>
            <li className="flex-align"><MailIcon size={16} color="#10b981" /> <strong>Support:</strong> helpdesk@propertytax.gov.in</li>
            <li>🏢 <strong>Office:</strong> Municipal Revenue Directorate, Block C, National Portal Complex</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>© 2026 Smart Property Tax Portal. Department of Municipal Administration & Land Revenue. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#terms">Terms of Service</a>
            <span className="dot">•</span>
            <a href="#privacy">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#disclaimer">Hyperlink Policy</a>
            <span className="dot">•</span>
            <a href="#help">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;