import { useState } from "react";
import { IdCardIcon, SearchIcon } from "./Icons";

const SearchForm = ({ onSearch, loading }) => {
  const [aadhaar, setAadhaar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (aadhaar.trim()) {
      onSearch(aadhaar.trim());
    }
  };

  return (
    <form className="search-form-card" onSubmit={handleSubmit}>
      <div className="search-form-header">
        <label htmlFor="aadhaar-input" className="search-label flex-align">
          <IdCardIcon size={20} color="#0b3d91" /> Enter Aadhaar Number / Taxpayer Identifier
        </label>
        <span className="search-sublabel">Single Search Input Workflow</span>
      </div>

      <div className="search-row-styled">
        <div className="input-search-wrapper">
          <span className="input-search-icon">
            <IdCardIcon size={18} color="#64748b" />
          </span>
          <input
            id="aadhaar-input"
            type="text"
            placeholder="Enter 12-digit Aadhaar Number or Demo ID (e.g. DEMO-1001)"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn-search-primary flex-center" disabled={loading}>
          <SearchIcon size={18} color="#ffffff" />
          <span>{loading ? "Processing Pipeline..." : "Get My Tax Details →"}</span>
        </button>
      </div>
      
      <div className="search-form-footer">
        <span className="security-tag">🔒 256-Bit SSL Encrypted Government Portal Retrieval</span>
      </div>
    </form>
  );
};

export default SearchForm;