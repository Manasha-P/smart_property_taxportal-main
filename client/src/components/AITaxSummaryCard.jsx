import { AiBrainIcon } from "./Icons";

const AITaxSummaryCard = ({ taxpayer, totals, aiAnalysis }) => {
  if (!taxpayer || !totals) return null;

  return (
    <div className="ai-summary-card">
      <div className="ai-summary-header">
        <div className="ai-badge flex-align">
          <AiBrainIcon size={22} color="#0b3d91" /> AI Generated Tax Summary
        </div>
        <span className="source-tag">Source: {aiAnalysis?.source === "ai-api" ? "Claude AI Engine" : "MongoDB Calculation Engine"}</span>
      </div>

      <div className="ai-summary-grid">
        <div className="summary-item">
          <span className="summary-label">Taxpayer</span>
          <span className="summary-value">{taxpayer.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Property</span>
          <span className="summary-value">{taxpayer.propertyType} Property</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Property Value</span>
          <span className="summary-value">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Current Annual Tax</span>
          <span className="summary-value">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Tax Paid</span>
          <span className="summary-value text-success">₹{totals.totalPaid?.toLocaleString("en-IN")}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Outstanding Tax</span>
          <span className={`summary-value ${totals.totalOutstanding > 0 ? "text-danger" : "text-success"}`}>
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Overall Payment Progress</span>
          <span className="summary-value">{totals.paymentProgress}%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tax Status</span>
          <span className={`status-tag status-${totals.overallStatus?.replace(/\s+/g, "-").toLowerCase()}`}>
            {totals.overallStatus}
          </span>
        </div>
      </div>

      {aiAnalysis?.summaryText && (
        <div className="ai-summary-text">
          <p>{aiAnalysis.summaryText}</p>
        </div>
      )}
    </div>
  );
};

export default AITaxSummaryCard;
