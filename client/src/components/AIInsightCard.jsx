import { ScaleIcon, LightbulbIcon, ShieldCheckIcon } from "./Icons";

const AIInsightCard = ({ analysis }) => {
  if (!analysis) return null;

  const level = (analysis.complianceLevel || "MEDIUM").toUpperCase();
  const levelClass = `ai-level-${level.toLowerCase()}`;

  return (
    <div className="ai-card gov-formal-card">
      <div className="ai-card-header">
        <div className="ai-title-block">
          <h3 className="flex-align">
            <ScaleIcon size={22} color="#0b3d91" /> Statutory Tax Compliance Scrutiny & Assessment
          </h3>
          <p className="ai-subtitle">Department of Municipal Revenue — Automated Compliance Audit Matrix</p>
        </div>
        <span className={`ai-level-badge ${levelClass}`}>
          Compliance Rating: {level} RISK
        </span>
      </div>

      <div className="ai-card-body">
        {analysis.currentStatusText && (
          <div className="ai-field highlight-box" style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "var(--radius-xs)", borderLeft: "4px solid var(--gov-navy-900)" }}>
            <span className="label font-bold" style={{ fontSize: "0.8rem", color: "#64748b" }}>Current Statutory Standing</span>
            <p style={{ marginTop: "0.2rem", fontSize: "0.92rem", color: "#1e293b" }}>{analysis.currentStatusText}</p>
          </div>
        )}

        <div className="info-grid" style={{ margin: "1rem 0" }}>
          <div className="info-cell">
            <span className="label">Observed Payment Behavior</span>
            <span className="value font-semibold">{analysis.paymentPattern || "Normal Schedule"}</span>
          </div>

          {analysis.paymentConsistency && (
            <div className="info-cell">
              <span className="label">Remittance Consistency</span>
              <span className="value">{analysis.paymentConsistency}</span>
            </div>
          )}

          {analysis.outstandingTrend && (
            <div className="info-cell">
              <span className="label">Outstanding Arrears Trend</span>
              <span className="value font-mono">{analysis.outstandingTrend}</span>
            </div>
          )}

          {analysis.historicalCompliance && (
            <div className="info-cell">
              <span className="label">Historical Compliance Profile</span>
              <span className="value">{analysis.historicalCompliance}</span>
            </div>
          )}
        </div>

        <div className="gov-statutory-directive">
          <span className="rec-title flex-align">
            <LightbulbIcon size={18} color="#065f46" /> Official Municipal Directive
          </span>
          <p>{analysis.recommendation}</p>
        </div>
      </div>

      <div className="ai-card-footer flex-align" style={{ justifyContent: "space-between" }}>
        <span className="ai-source flex-align">
          <ShieldCheckIcon size={14} color="#059669" />
          Audit System: {analysis.source === "ai-api" ? "Automated Intelligence Risk Model" : "Rule-Based Statutory Taxation Matrix"}
        </span>
        <span className="font-mono" style={{ fontSize: "0.78rem" }}>
          MUNICIPAL CODE SEC 120 VERIFIED
        </span>
      </div>
    </div>
  );
};

export default AIInsightCard;
