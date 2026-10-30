import { BuildingGovIcon } from "./Icons";

const AITaxSummaryCard = ({ taxpayer, totals, aiAnalysis }) => {
  if (!taxpayer || !totals) return null;

  return (
    <div className="section-card gov-formal-card">
      <div className="card-header-styled">
        <div className="flex-align">
          <BuildingGovIcon size={20} color="#0b3d91" />
          <h3 style={{ fontSize: "1.1rem" }}>Statutory Property Assessment & Revenue Summary</h3>
        </div>
        <span className="section-badge font-mono">
          SOURCE: MUNICIPAL CADASTRE & CBS LEDGER
        </span>
      </div>

      <div className="info-grid">
        <div className="info-cell">
          <span className="label">Registered Taxpayer</span>
          <span className="value font-semibold">{taxpayer.name}</span>
        </div>
        <div className="info-cell">
          <span className="label">Property Category</span>
          <span className="value">{taxpayer.propertyType} Property</span>
        </div>
        <div className="info-cell">
          <span className="label">Cadastre Capital Value</span>
          <span className="value font-mono">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</span>
        </div>
        <div className="info-cell">
          <span className="label">Current Annual Statutory Tax</span>
          <span className="value font-mono font-bold">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="info-cell">
          <span className="label">Total Cleared Remittance</span>
          <span className="value font-mono font-semibold" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="info-cell">
          <span className="label">Outstanding Arrears</span>
          <span
            className="value font-mono font-bold"
            style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#065f46" }}
          >
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="info-cell">
          <span className="label">Overall Recovery Ratio</span>
          <span className="value font-mono">{totals.paymentProgress}%</span>
        </div>
        <div className="info-cell">
          <span className="label">Official Standing</span>
          <span className={`status-pill status-${totals.overallStatus?.replace(/\s+/g, "-").toLowerCase()}`}>
            {totals.overallStatus}
          </span>
        </div>
      </div>

      {aiAnalysis?.summaryText && (
        <div className="gov-statutory-directive" style={{ marginTop: "1rem" }}>
          <p>{aiAnalysis.summaryText}</p>
        </div>
      )}
    </div>
  );
};

export default AITaxSummaryCard;
