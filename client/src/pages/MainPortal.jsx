import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import ErrorMessage from "../components/ErrorMessage";
import {
  NationalEmblemIcon,
  BankIcon,
  CalendarIcon,
  ScaleIcon,
  CheckIcon,
} from "../components/Icons";
import { searchTaxpayer } from "../services/api";

const MainPortal = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (aadhaar) => {
    setError("");
    setLoading(true);
    try {
      const res = await searchTaxpayer(aadhaar);
      navigate(`/analysis/${res.data.recordId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Taxpayer record not found. Please verify the 12-digit Aadhaar UID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page main-portal-page">
      {/* Official Government & Banking Banner */}
      <div className="dossier-masthead-card" style={{ marginBottom: "2rem" }}>
        <div className="dossier-masthead-top">
          <div className="dossier-title-block flex-align">
            <div className="dossier-emblem-badge">
              <NationalEmblemIcon size={34} color="#d4af37" />
            </div>
            <div>
              <div className="dossier-meta-badge-row flex-align">
                <span className="gov-seal-title">AI-BASED PROPERTY TAX SELF-ASSESSMENT PORTAL</span>
                <span className="section-badge font-mono">GOVERNMENT OF INDIA</span>
              </div>
              <h2 className="dossier-main-heading">Property Tax Self-Assessment & Tracking Portal</h2>
              <p className="dossier-sub-text">
                Enter your Aadhaar Number to automatically query the central registry, aggregate bank remittance records, compute monthly/annual tax dues, and evaluate statutory compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Container */}
      <div className="portal-search-container" style={{ marginBottom: "2.5rem" }}>
        <SearchForm onSearch={handleSearch} loading={loading} />
        {error && <ErrorMessage message={error} />}
      </div>

      {/* 3 Core Highlights Cards */}
      <div className="portal-highlights-grid">
        <div className="highlight-card bank-highlight">
          <div className="highlight-icon">
            <BankIcon size={28} color="#065f46" />
          </div>
          <h4>Bank Remittance Consolidation</h4>
          <p>
            Automatically aggregates tax payment records across State Bank of India, Indian Bank, Bank of India, and partner clearing institutions.
          </p>
        </div>

        <div className="highlight-card ledger-highlight">
          <div className="highlight-icon">
            <CalendarIcon size={28} color="#0b3d91" />
          </div>
          <h4>Monthly & Annual Tax Engine</h4>
          <p>
            Calculates monthly tax dues, amounts remitted, outstanding arrears, and financial year payment completion percentages dynamically.
          </p>
        </div>

        <div className="highlight-card audit-highlight">
          <div className="highlight-icon">
            <ScaleIcon size={28} color="#7c3aed" />
          </div>
          <h4>Statutory Compliance Intelligence</h4>
          <p>
            Evaluates payment consistency, historical compliance levels, and generates actionable administrative recommendations.
          </p>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="portal-instructions-card">
        <h3 className="flex-align" style={{ marginBottom: "1rem", color: "var(--gov-navy-900)" }}>
          <NationalEmblemIcon size={22} color="#0b3d91" /> Official Portal Operating Guidelines
        </h3>
        <div className="instructions-list">
          <div className="instruction-item">
            <CheckIcon size={18} color="#059669" />
            <span>
              <strong>Single Search Input:</strong> Enter your registered 12-digit Citizen Aadhaar UID Number.
            </span>
          </div>
          <div className="instruction-item">
            <CheckIcon size={18} color="#059669" />
            <span>
              <strong>Automated Retrieval:</strong> No manual entry of Property ID, bank names, or tax amounts required.
            </span>
          </div>
          <div className="instruction-item">
            <CheckIcon size={18} color="#059669" />
            <span>
              <strong>Instant Full Dashboard:</strong> Generates KPI cards, monthly breakdowns, payment logs, and statutory compliance results instantly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPortal;
