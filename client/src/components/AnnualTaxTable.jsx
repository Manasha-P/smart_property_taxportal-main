const AnnualTaxTable = ({ years }) => {
  if (!years || years.length === 0) {
    return <p className="empty-note">No annual tax records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="gov-ledger-table">
        <thead>
          <tr>
            <th>Financial Year</th>
            <th style={{ textAlign: "right" }}>Statutory Due</th>
            <th style={{ textAlign: "right" }}>Amount Remitted</th>
            <th style={{ textAlign: "right" }}>Outstanding Balance</th>
            <th style={{ textAlign: "center" }}>Recovery %</th>
            <th style={{ textAlign: "center" }}>Assessment Status</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y, i) => (
            <tr key={i}>
              <td className="font-semibold">{y.financialYear}</td>
              <td style={{ textAlign: "right" }} className="font-mono">
                ₹{y.taxDue.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "right" }} className="font-mono font-semibold" style={{ color: "#065f46" }}>
                ₹{y.taxPaid.toLocaleString("en-IN")}
              </td>
              <td
                style={{ textAlign: "right" }}
                className={`font-mono font-bold ${y.outstanding > 0 ? "text-danger" : "text-success"}`}
              >
                ₹{y.outstanding.toLocaleString("en-IN")}
              </td>
              <td style={{ textAlign: "center" }} className="font-mono">
                {y.progressPercentage || (y.taxDue ? Math.round((y.taxPaid / y.taxDue) * 100) : 0)}%
              </td>
              <td style={{ textAlign: "center" }}>
                <span className={`status-pill status-${y.status.replace(/\s+/g, "-").toLowerCase()}`}>
                  {y.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnualTaxTable;
