const MonthlyTaxTable = ({ months }) => {
  if (!months || months.length === 0) {
    return <p className="empty-note">No monthly tax records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Tax Due</th>
            <th>Tax Paid</th>
            <th>Outstanding</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m, idx) => (
            <tr key={idx}>
              <td className="font-semibold">{m.month}</td>
              <td>₹{m.taxDue.toLocaleString("en-IN")}</td>
              <td>₹{m.taxPaid.toLocaleString("en-IN")}</td>
              <td className={m.outstanding > 0 ? "text-danger" : ""}>
                ₹{m.outstanding.toLocaleString("en-IN")}
              </td>
              <td>{m.paymentPercentage}%</td>
              <td>
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
