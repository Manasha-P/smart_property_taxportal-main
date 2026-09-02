import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import ErrorMessage from "../components/ErrorMessage";
import { EmblemIcon, BankIcon, CalendarIcon, AiBrainIcon, CheckIcon } from "../components/Icons";
import { getFullTaxpayerProfile } from "../services/api";

const MainPortal = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (aadhaar) => {
    setError("");
    setLoading(true);
    try {
      await getFullTaxpayerProfile(aadhaar);
      navigate(`/dashboard/${aadhaar}`);
    } catch (err) {
      setError(err.response?.data?.message || "Taxpayer record not found. Please verify the Aadhaar ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page main-portal-page">
      {/* Official Government Banner */}
      <div className="portal-hero-banner">
        <div className="portal-emblem-badge">
          <EmblemIcon size={32} color="#ffffff" />
        </div>
        <div className="portal-hero-titles">
          <span className="gov-seal-title">NATIONAL PROPERTY TAXATION PORTAL</span>
          <h2>Property Tax Details & AI Compliance System</h2>
          <p>
            Enter your Aadhaar Number to automatically query the central database, aggregate bank remittance records, compute monthly/annual tax dues, and evaluate AI compliance.
          </p>
        </div>
      </div>

      {/* Main Search Container */}
      <div className="portal-search-container">
        <SearchForm onSearch={handleSearch} loading={loading} />
        {error && <ErrorMessage message={error} />}
      </div>

      {/* 3 Core Highlights Cards */}
      <div className="portal-highlights-grid">
        <div className="highlight-card">
          <div className="highlight-icon">
            <BankIcon size={28} color="#0b3d91" />
          </div>
          <h4>Bank Remittance Consolidation</h4>
          <p>Automatically fetches tax payment history across State Bank, Indian Bank, and Bank of India.</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <CalendarIcon size={28} color="#0b3d91" />
          </div>
          <h4>Monthly & Annual Tax Engine</h4>
          <p>Calculates monthly tax dues, amounts remitted, outstanding balances, and progress percentages.</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">
            <AiBrainIcon size={28} color="#0b3d91" />
          </div>
          <h4>AI Compliance Intelligence</h4>
          <p>Evaluates payment consistency, historical compliance levels, and generates actionable advice.</p>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="portal-instructions-card">
        <h3 className="flex-align">
          <EmblemIcon size={20} color="#0b3d91" /> Official Portal Operating Guidelines
        </h3>
        <div className="instructions-list">
          <div className="instruction-item">
            <CheckIcon size={18} color="#10b981" />
            <span><strong>Single Search Input:</strong> Enter your 12-digit Aadhaar Number or registered identifier.</span>
          </div>
          <div className="instruction-item">
            <CheckIcon size={18} color="#10b981" />
            <span><strong>Automated Retrieval:</strong> No manual entry of Property ID, bank names, or tax amounts required.</span>
          </div>
          <div className="instruction-item">
            <CheckIcon size={18} color="#10b981" />
            <span><strong>Instant Dashboard:</strong> Generates KPI cards, monthly breakdowns, payment logs, and AI compliance results.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPortal;