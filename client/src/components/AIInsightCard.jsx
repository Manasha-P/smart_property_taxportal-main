import { AiBrainIcon, LightbulbIcon } from "./Icons";

const AIInsightCard = ({ analysis }) => {
  if (!analysis) return null;

  const level = (analysis.complianceLevel || "MEDIUM").toUpperCase();
  const levelClass = `ai-level-${level.toLowerCase()}`;

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <div className="ai-title-block">
          <h3 className="flex-align">
            <AiBrainIcon size={24} color="#0b3d91" /> AI Tax Compliance Analysis & Result
          </h3>
          <p className="ai-subtitle">Intelligent Compliance Assessment Engine</p>
        </div>
        <span className={`ai-level-badge ${levelClass}`}>
          Compliance Level: {level}
        </span>
      </div>

      <div className="ai-card-body">
        {analysis.currentStatusText && (
          <div className="ai-field highlight-box">
            <span className="label font-bold">Current Compliance Status</span>
            <p>{analysis.currentStatusText}</p>
          </div>
        )}

        <div className="ai-field">
          <span className="label font-bold">Payment Behavior & Pattern</span>
          <p>{analysis.paymentPattern}</p>
        </div>

        {analysis.paymentConsistency && (
          <div className="ai-field">
            <span className="label font-bold">Payment Consistency</span>
            <p>{analysis.paymentConsistency}</p>
          </div>
        )}

        {analysis.outstandingTrend && (
          <div className="ai-field">
            <span className="label font-bold">Outstanding Trend</span>
            <p>{analysis.outstandingTrend}</p>
          </div>
        )}

        {analysis.historicalCompliance && (
          <div className="ai-field">
            <span className="label font-bold">Historical Compliance</span>
            <p>{analysis.historicalCompliance}</p>
          </div>
        )}

        <div className="ai-recommendation-box">
          <span className="rec-title flex-align">
            <LightbulbIcon size={18} color="#047857" /> AI Recommendation
          </span>
          <p>{analysis.recommendation}</p>
        </div>
      </div>

      <div className="ai-card-footer">
        <span className="ai-source">
          Source Engine: {analysis.source === "ai-api" ? "Claude AI Intelligence" : "Rule-Based Compliance Engine"}
        </span>
        {analysis.cached && <span className="ai-cached">Cached Compliance Profile</span>}
      </div>
    </div>
  );
};

export default AIInsightCard;