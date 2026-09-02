const AnnualTaxTable = ({ years }) => {
  if (!years || years.length === 0) {
    return <p className="empty-note">No annual tax records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Financial Year</th>
            <th>Tax Due</th>
            <th>Tax Paid</th>
            <th>Outstanding</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y, i) => (
            <tr key={i}>
              <td className="font-semibold">{y.financialYear}</td>
              <td>₹{y.taxDue.toLocaleString("en-IN")}</td>
              <td>₹{y.taxPaid.toLocaleString("en-IN")}</td>
              <td className={y.outstanding > 0 ? "text-danger" : ""}>
                ₹{y.outstanding.toLocaleString("en-IN")}
              </td>
              <td>{y.progressPercentage || (y.taxDue ? Math.round((y.taxPaid / y.taxDue) * 100) : 0)}%</td>
              <td>
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