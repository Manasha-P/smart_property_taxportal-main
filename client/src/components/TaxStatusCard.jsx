import { CheckIcon, AlertIcon, CrossIcon } from "./Icons";

const TaxStatusCard = ({ totals }) => {
  if (!totals) return null;

  const status = totals.overallStatus || "NON-TAX PAYER";
  let statusClass = "status-unpaid";
  let statusIcon = <CrossIcon size={24} color="#b91c1c" />;

  if (status === "TAX PAYER") {
    statusClass = "status-paid";
    statusIcon = <CheckIcon size={24} color="#047857" />;
  } else if (status === "PARTIALLY PAID") {
    statusClass = "status-partial";
    statusIcon = <AlertIcon size={24} color="#b45309" />;
  }

  return (
    <div className={`status-card ${statusClass}`}>
      <div className="status-badge-header">
        <span className="status-label-prefix">AUTOMATIC SYSTEM TAX STATUS</span>
        <div className="status-badge-main flex-align">
          {statusIcon} <span className="margin-left-xs">{status}</span>
        </div>
      </div>
      <div className="status-figures-grid">
        <div className="figure-item">
          <span className="label">Total Tax Due</span>
          <span className="value">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
        </div>
        <div className="figure-item">
          <span className="label">Total Tax Paid</span>
          <span className="value">₹{totals.totalPaid?.toLocaleString("en-IN")}</span>
        </div>
        <div className="figure-item">
          <span className="label">Total Outstanding</span>
          <span className="value">₹{totals.totalOutstanding?.toLocaleString("en-IN")}</span>
        </div>
        <div className="figure-item">
          <span className="label">Payment Progress</span>
          <span className="value">{totals.paymentProgress}%</span>
        </div>
      </div>
    </div>
  );
};

export default TaxStatusCard;