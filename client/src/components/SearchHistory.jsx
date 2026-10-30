import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const saveToSearchHistory = (recordId, name) => {
  try {
    const raw = sessionStorage.getItem("recentTaxpayerSearches");
    let history = raw ? JSON.parse(raw) : [];
    // Deduplicate
    history = history.filter((h) => h.recordId !== recordId);
    history.unshift({ recordId, name, timestamp: Date.now() });
    // Keep top 6
    history = history.slice(0, 6);
    sessionStorage.setItem("recentTaxpayerSearches", JSON.stringify(history));
  } catch {
    // sessionStorage not available or disabled
  }
};

const SearchHistory = ({ currentRecordId }) => {
  const navigate = useNavigate();

  let history;
  try {
    const raw = sessionStorage.getItem("recentTaxpayerSearches");
    history = raw ? JSON.parse(raw) : [];
  } catch {
    history = [];
  }

  if (!history || history.length === 0) return null;

  return (
    <div className="search-history-container">
      <span className="search-history-label">Recent Inquiries:</span>
      <div className="search-history-chips">
        {history.map((h) => {
          const isCurrent = h.recordId === currentRecordId;
          return (
            <button
              key={h.recordId}
              type="button"
              className={`search-history-chip ${isCurrent ? "chip-active" : ""}`}
              onClick={() => {
                if (!isCurrent) {
                  navigate(`/tax-overview/${h.recordId}`);
                }
              }}
              title={`Switch to ${h.name || h.recordId}`}
            >
              <span className="chip-id font-mono">{h.recordId}</span>
              {h.name && <span className="chip-name">{h.name.split(" ")[0]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchHistory;
