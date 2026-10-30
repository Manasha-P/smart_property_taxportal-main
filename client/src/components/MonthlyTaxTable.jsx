const MonthlyTaxTable = ({ months }) => {
  if (!months || months.length === 0) {
    return <p className="empty-note">No monthly tax records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="gov-ledger-table">
        <thead>
          <tr>
            <th>Instalment Period</th>
            <th style={{ textAlign: "right" }}>Statutory Due</th>
            <th style={{ textAlign: "right" }}>Amount Cleared</th>
            <th style={{ textAlign: "right" }}>Outstanding Balance</th>
            <th style={{ textAlign: "center" }}>Recovery %</th>
            <th style={{ textAlign: "center" }}>Clearance Status</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m, idx) => (
            <tr key={idx}>
              <td className="font-semibold">{m.month}</td>
              <td style={{ textAlign: "right" }} className="font-mono">
                ₹{m.taxDue.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "right" }} className="font-mono font-semibold" style={{ color: "#065f46" }}>
                ₹{m.taxPaid.toLocaleString("en-IN")}
              </td>
              <td
                style={{ textAlign: "right" }}
                className={`font-mono font-bold ${m.outstanding > 0 ? "text-danger" : "text-success"}`}
              >
                ₹{m.outstanding.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "center" }} className="font-mono">
                {m.paymentPercentage}%
              </td>
              <td style={{ textAlign: "center" }}>
                <span className={`status-pill status-${m.status.replace(/\s+/g, "-").toLowerCase()}`}>
                  {m.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyTaxTable;
