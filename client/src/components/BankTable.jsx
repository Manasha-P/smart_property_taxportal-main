import { BankIcon } from "./Icons";

const BankTable = ({ banks }) => {
  if (!banks || banks.length === 0) {
    return <p className="empty-note">No bank payment records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="gov-ledger-table">
        <thead>
          <tr>
            <th>Financial Institution</th>
            <th style={{ textAlign: "right" }}>Statutory Due</th>
            <th style={{ textAlign: "right" }}>Amount Remitted</th>
            <th style={{ textAlign: "right" }}>Outstanding Arrears</th>
            <th style={{ textAlign: "center" }}>Clearance Status</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b, i) => (
            <tr key={i}>
              <td className="font-semibold">
                <div className="flex-align">
                  <BankIcon size={14} color="#0b3d91" />
                  <span>{b.bankName}</span>
                </div>
              </td>
              <td style={{ textAlign: "right" }} className="font-mono">
                ₹{b.taxAmount.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "right" }} className="font-mono font-semibold" style={{ color: "#065f46" }}>
                ₹{b.paidAmount.toLocaleString("en-IN")}
              </td>
              <td
                style={{ textAlign: "right" }}
                className={`font-mono font-bold ${b.outstanding > 0 ? "text-danger" : "text-success"}`}
              >
                ₹{b.outstanding.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "center" }}>
                <span className={`status-pill status-${b.status.replace(/\s+/g, "-").toLowerCase()}`}>
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankTable;
