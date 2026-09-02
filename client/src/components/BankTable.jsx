const BankTable = ({ banks }) => {
  if (!banks || banks.length === 0) {
    return <p className="empty-note">No bank payment records available for this taxpayer.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Bank Name</th>
            <th>Tax Due</th>
            <th>Tax Paid</th>
            <th>Outstanding</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b, i) => (
            <tr key={i}>
              <td className="font-semibold">{b.bankName}</td>
              <td>₹{b.taxAmount.toLocaleString("en-IN")}</td>
              <td>₹{b.paidAmount.toLocaleString("en-IN")}</td>
              <td className={b.outstanding > 0 ? "text-danger" : ""}>
                ₹{b.outstanding.toLocaleString("en-IN")}
              </td>
              <td>
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