import { Link } from "react-router-dom";
import { NationalEmblemIcon } from "../components/Icons";

const NotFound = () => (
  <div className="page" style={{ textAlign: "center", padding: "4rem 1rem" }}>
    <div className="section-card" style={{ maxWidth: "540px", margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <NationalEmblemIcon size={48} color="#0b3d91" />
      </div>
      <span className="gov-seal-title">CIVIL CITIZEN ADVISORY</span>
      <h2 style={{ fontSize: "1.8rem", color: "var(--gov-navy-900)", margin: "0.5rem 0" }}>
        404 — Official Record / Resource Not Found
      </h2>
      <p style={{ color: "#64748b", fontSize: "0.92rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
        The requested municipal portal path does not correspond to an authorized taxation or banking service directory.
      </p>
      <Link to="/" className="btn-search-primary" style={{ textDecoration: "none", display: "inline-block" }}>
        ← Return to National Portal Home
      </Link>
    </div>
  </div>
);

export default NotFound;
