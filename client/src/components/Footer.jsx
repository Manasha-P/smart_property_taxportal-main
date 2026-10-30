import { Link } from "react-router-dom";
import {
  NationalEmblemIcon,
  PhoneIcon,
  MailIcon,
  ShieldCheckIcon,
  BuildingGovIcon,
  BankIcon,
} from "./Icons";

const Footer = () => {
  return (
    <footer className="footer-container gov-master-footer">
      {/* Top Footer Sovereign Band */}
      <div className="footer-sovereign-strip">
        <div className="sovereign-inner flex-align">
          <div className="flex-align">
            <NationalEmblemIcon size={24} color="#d4af37" />
            <span className="footer-gov-seal-label">
              भारत सरकार | GOVERNMENT OF INDIA • MUNICIPAL REVENUE ADMINISTRATION
            </span>
          </div>
          <div className="footer-security-chips flex-align">
            <span className="chip-tag flex-align">
              <ShieldCheckIcon size={14} color="#10b981" /> 256-Bit SSL Encrypted
            </span>
            <span className="chip-tag flex-align">
              <BankIcon size={14} color="#38bdf8" /> RBI NetBanking Compliant
            </span>
            <span className="chip-tag">GIGW 3.0 Certified</span>
          </div>
        </div>
      </div>

      <div className="footer-main">
        {/* Col 1: Institutional Authority */}
        <div className="footer-col footer-col-main">
          <div className="footer-brand">
            <div className="footer-crest-emblem">
              <NationalEmblemIcon size={32} color="#d4af37" />
            </div>
            <div>
              <h4 className="footer-brand-title">AI-BASED PROPERTY TAX PORTAL</h4>
              <span className="footer-brand-sub">
                AI-Based Property Tax Self-Assessment Tracking Portal
              </span>
            </div>
          </div>
          <p className="footer-desc">
            An official digital public infrastructure of the Department of Municipal Revenue & Urban Local Bodies, integrating municipal land cadastres with public sector banking networks for automated Demand-Collection-Balance (DCB) ledger administration.
          </p>
          <div className="footer-authority-note">
            <span>Administered by Central Directorate of Urban Local Bodies & Indian Banking Clearance Consortium.</span>
          </div>
        </div>

        {/* Col 2: Citizen Portals */}
        <div className="footer-col">
          <h4 className="footer-heading">Citizen Services</h4>
          <ul className="footer-links">
            <li><Link to="/">Portal Home Overview</Link></li>
            <li><Link to="/portal">Search Property Tax Assessment</Link></li>
            <li><Link to="/portal">Download Form-V Clearance Statement</Link></li>
            <li><Link to="/portal">Inter-Bank Remittance Verification</Link></li>
            <li><Link to="/admin">Municipal Officer SSO Login</Link></li>
          </ul>
        </div>

        {/* Col 3: Statutory & Legal */}
        <div className="footer-col">
          <h4 className="footer-heading">Statutory & Governance</h4>
          <ul className="footer-links">
            <li><a href="#act">Municipal Corporation Act, 1976 (Sec 114)</a></li>
            <li><a href="#rules">Property Tax Assessment Rules</a></li>
            <li><a href="#rti">Right to Information (RTI) Portal</a></li>
            <li><a href="#citizens-charter">Citizen’s Service Delivery Charter</a></li>
            <li><a href="#ots">One-Time Settlement (OTS) Guidelines</a></li>
          </ul>
        </div>

        {/* Col 4: Grievance Redressal & Support */}
        <div className="footer-col">
          <h4 className="footer-heading">Helpdesk & Grievance Cell</h4>
          <ul className="footer-contact-list">
            <li className="flex-align">
              <PhoneIcon size={16} color="#d4af37" />
              <div>
                <strong>National Toll-Free:</strong> 1800-111-8293
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Operational 08:00 to 20:00 IST (Mon–Sat)</div>
              </div>
            </li>
            <li className="flex-align">
              <MailIcon size={16} color="#d4af37" />
              <div>
                <strong>Direct Support:</strong> revenue.helpdesk@propertytax.gov.in
              </div>
            </li>
            <li className="flex-align">
              <BuildingGovIcon size={16} color="#d4af37" />
              <div>
                <strong>Central Treasury:</strong> Municipal Revenue Headquarters, Civil Center, National Portal Complex
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>
            © 2026 AI-Based Property Tax Self-Assessment Tracking Portal. Directorate of Municipal Revenue & Urban Administration, Government of India. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#terms">Terms & Conditions</a>
            <span className="dot">•</span>
            <a href="#privacy">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#copyright">Copyright Policy</a>
            <span className="dot">•</span>
            <a href="#hyperlink">Hyperlinking Policy</a>
            <span className="dot">•</span>
            <a href="#accessibility">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
