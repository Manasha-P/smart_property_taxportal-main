import { useState } from "react";
import { IdCardIcon, SearchIcon, ShieldCheckIcon, BankIcon, ScaleIcon } from "./Icons";

const SearchForm = ({ onSearch, loading }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    const clean = aadhaar.trim();
    if (!clean) {
      setValidationError("Please enter a valid 12-digit Citizen Aadhaar Number.");
      return;
    }

    // If pure digits, check 12-digit constraint
    if (/^\d+$/.test(clean) && clean.length !== 12) {
      setValidationError("Aadhaar identifier must be exactly 12 digits (e.g. 100100001001).");
      return;
    }

    onSearch(clean);
  };

  return (
    <div className="gov-bank-search-card">
      <div className="gov-search-card-header">
        <div className="search-header-titles">
          <span className="gov-seal-title flex-align">
            <ScaleIcon size={14} color="#0b3d91" />
            DIRECT PROPERTY TAX ASSESSMENT INQUIRY
          </span>
          <h3 className="search-card-main-title">Taxpayer Aadhaar & Cadastre Property Verification</h3>
          <p className="search-card-subtitle">
            Search Demand, Collection and Balance (DCB) register and inter-bank clearance records linked to citizen Aadhaar.
          </p>
        </div>
        <div className="bank-clearing-badge flex-align">
          <BankIcon size={16} color="#065f46" />
          <span>Core Banking CBS Connected</span>
        </div>
      </div>

      <form className="search-form-body" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <label htmlFor="aadhaar-input" className="search-field-label">
            Citizen Aadhaar UID Number <span className="req-star">*</span>
          </label>
          <div className="search-input-box">
            <span className="input-prefix-icon">
              <IdCardIcon size={20} color="#0b3d91" />
            </span>
            <input
              id="aadhaar-input"
              type="text"
              placeholder="Enter 12-Digit Citizen Aadhaar Number"
              value={aadhaar}
              onChange={(e) => {
                setAadhaar(e.target.value);
                if (validationError) setValidationError("");
              }}
              required
              autoComplete="off"
              className="gov-bank-text-input"
            />
            <button
              type="submit"
              className="btn-gov-search-submit flex-center"
              disabled={loading}
            >
              <SearchIcon size={18} color="#ffffff" />
              <span>{loading ? "Querying Registry..." : "Fetch Assessment Record →"}</span>
            </button>
          </div>
          {validationError && (
            <div className="gov-field-error">
              ⚠️ <strong>Validation Error:</strong> {validationError}
            </div>
          )}
        </div>

        {/* Security & Statutory Assurances */}
        <div className="search-form-security-footer">
          <div className="security-item flex-align">
            <ShieldCheckIcon size={14} color="#10b981" />
            <span>UIDAI Aadhaar Data Vault Compliant</span>
          </div>
          <div className="security-item flex-align">
            <BankIcon size={14} color="#0b3d91" />
            <span>Direct Multi-Bank Payment Reconciliation</span>
          </div>
          <div className="security-item">
            <span>Statutory Reference: Section 114 Municipal Revenue Code</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
