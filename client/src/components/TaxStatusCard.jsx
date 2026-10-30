import { CheckIcon, AlertIcon, CrossIcon } from "./Icons";

const TaxStatusCard = ({ totals }) => {
  if (!totals) return null;

  const status = totals.overallStatus || "NON-TAX PAYER";
  let statusClass = "status-unpaid";
  let statusIcon = <CrossIcon size={24} color="#b91c1c" />;
  let statutoryTitle = "STATUTORY ARREARS OUTSTANDING — ACTION REQUIRED";

  if (status === "TAX PAYER") {
    statusClass = "status-paid";
    statusIcon = <CheckIcon size={24} color="#047857" />;
    statutoryTitle = "MUNICIPAL REVENUE CLEARANCE CONFIRMED — NO ARREARS";
  } else if (status === "PARTIALLY PAID") {
    statusClass = "status-partial";
    statusIcon = <AlertIcon size={24} color="#b45309" />;
    statutoryTitle = "PARTIAL REVENUE CLEARANCE — REMAINING INSTALMENTS DUE";
  }

  return (
    <div className={`status-card ${statusClass}`}>
      <div className="status-badge-header">
        <span className="status-label-prefix">{statutoryTitle}</span>
        <div className="status-badge-main flex-align">
          {statusIcon} <span className="margin-left-xs">{status}</span>
        </div>
      </div>
      <div className="status-figures-grid">
        <div className="figure-item">
          <span className="label">Total Annual Statutory Demand</span>
          <span className="value font-mono">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="figure-item">
          <span className="label">Total Cleared Remittance</span>
          <span className="value font-mono" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="figure-item">
          <span className="label">Net Outstanding Balance</span>
          <span
            className="value font-mono font-bold"
            style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}
          >
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="figure-item">
          <span className="label">Settlement Recovery Ratio</span>
          <span className="value font-mono">{totals.paymentProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default TaxStatusCard;
