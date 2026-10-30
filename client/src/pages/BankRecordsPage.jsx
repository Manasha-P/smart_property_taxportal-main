import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBankRecords } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  BankIcon,
  ShieldCheckIcon,
  CheckIcon,
  DownloadIcon,
  StampIcon,
} from "../components/Icons";

const BankRecordsPage = () => {
  const { recordId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getBankRecords(recordId, {
          bank: selectedBank,
          status: selectedStatus,
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load connected bank records.");
      } finally {
        setLoading(false);
      }
    };
    if (recordId) fetchData();
  }, [recordId, selectedBank, selectedStatus]);

  const handleExportCSV = () => {
    if (!data?.transactions || data.transactions.length === 0) return;
    const headers = [
      "Bank Transaction UTR",
      "Financial Institution",
      "Masked Account No",
      "Assessment Year",
      "Collection Month",
      "Statutory Tax Due (INR)",
      "Amount Cleared (INR)",
      "Settlement Timestamp",
      "CBS Clearance Status",
      "Reconciliation Status",
    ];

    const rows = data.transactions.map((t) => [
      t.transactionRef,
      `"${t.bankName}"`,
      t.maskedAccount,
      t.financialYear,
      t.month,
      t.taxDue,
      t.amountPaid,
      t.paymentDate ? new Date(t.paymentDate).toISOString().replace("T", " ").substring(0, 19) : "N/A",
      t.transactionStatus,
      t.reconciliationStatus,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `InterBank_Tax_Remittances_${recordId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="page">
        <Breadcrumbs items={[{ label: "Overview", to: `/tax-overview/${recordId}` }, { label: "Bank Records" }]} />
        <ErrorMessage message={error} />
        <Link to={`/tax-overview/${recordId}`} className="btn-search-primary" style={{ marginTop: "1rem" }}>
          ← Back to Tax Overview
        </Link>
      </div>
    );
  }

  const { taxpayer, bankSummary, transactions, supportedBanks } = data;

  return (
    <div className="page analysis-subpage">
      <Breadcrumbs
        items={[
          { label: `Dossier (${recordId})`, to: `/tax-overview/${recordId}` },
          { label: "Inter-Bank Remittance Clearing" },
        ]}
      />

      {/* Official Government & Bank Settlement Header */}
      <div className="subpage-header-row">
        <div>
          <div className="flex-align" style={{ gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span className="gov-seal-title flex-align">
              <BankIcon size={14} color="#065f46" />
              INTER-BANK REVENUE CLEARING CONSORTIUM
            </span>
            <span className="section-badge font-mono">ISO 20022 CBS INTEGRATION</span>
          </div>
          <h2>Multi-Bank Electronic Remittance Ledger</h2>
          <p className="subpage-sub">
            Verified electronic tax debits and core banking reconciliations for <strong>{taxpayer.name}</strong> ({recordId}).
          </p>
        </div>

        <div className="subpage-actions-row">
          <button type="button" className="btn-outline flex-align" onClick={handleExportCSV}>
            <DownloadIcon size={16} color="#0b3d91" />
            <span>Export Bank Ledger CSV</span>
          </button>
          <Link
            to={`/tax-overview/${recordId}`}
            className="btn-hero-primary flex-align"
            style={{ padding: "0.55rem 1.1rem", fontSize: "0.88rem" }}
          >
            ← Return to Dossier
          </Link>
        </div>
      </div>

      {/* Institution-Wise Clearance Cards */}
      <div className="bank-cards-grid">
        {bankSummary &&
          Object.entries(bankSummary).map(([bankName, summary]) => (
            <div key={bankName} className="bank-summary-card gov-bank-card">
              <div className="bank-card-top flex-align" style={{ justifyContent: "space-between" }}>
                <div className="flex-align" style={{ gap: "0.5rem" }}>
                  <div className="bank-emblem-circle">
                    <BankIcon size={20} color="#0b3d91" />
                  </div>
                  <h4>{bankName}</h4>
                </div>
                <span className="cbs-live-badge flex-align">
                  <span className="status-dot green"></span> CBS Live
                </span>
              </div>

              <div className="bank-figures-list">
                <div className="figure-row">
                  <span className="label">Remitted Volume:</span>
                  <span className="value font-mono font-bold" style={{ color: "#065f46" }}>
                    ₹{summary.totalPaid?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="figure-row">
                  <span className="label">Total Tax Dues:</span>
                  <span className="value font-mono">₹{summary.totalDue?.toLocaleString("en-IN")}</span>
                </div>
                <div className="figure-row">
                  <span className="label">Confirmed Transactions:</span>
                  <span className="value font-mono font-semibold">{summary.transactionCount} Remittances</span>
                </div>
                <div className="figure-row">
                  <span className="label">Clearing Success Rate:</span>
                  <span className="value font-bold" style={{ color: summary.settlementRate === 100 ? "#059669" : "#b45309" }}>
                    {summary.settlementRate || 100}% Cleared
                  </span>
                </div>
              </div>

              <div className="bank-reconcile-footer flex-align" style={{ justifyContent: "space-between" }}>
                <span className="flex-align" style={{ fontSize: "0.78rem", color: "#64748b" }}>
                  <ShieldCheckIcon size={14} color="#059669" /> RBI Clearing House Reconciled
                </span>
                <span className="font-mono" style={{ fontSize: "0.74rem", color: "#94a3b8" }}>
                  REF: {bankName.substring(0, 3).toUpperCase()}-CBS-2026
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Inter-Bank Filter Toolbar */}
      <div className="filter-toolbar-card">
        <div className="filter-group">
          <label htmlFor="bank-filter" className="flex-align">
            <BankIcon size={16} color="#0b3d91" />
            Financial Institution:
          </label>
          <select
            id="bank-filter"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
          >
            <option value="All">All Integrated Banks (SBI, IB, BoI)</option>
            {supportedBanks &&
              supportedBanks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Clearance Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Settlement Records</option>
            <option value="Paid">CONFIRMED (Settled)</option>
            <option value="Unpaid">PENDING (Unpaid)</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#64748b" }}>
          Showing <strong>{transactions?.length || 0}</strong> verified ledger entries
        </div>
      </div>

      {/* Main Bank Transactions Ledger Table */}
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="flex-align">
            <StampIcon size={20} color="#0b3d91" />
            Core Banking System (CBS) Inter-Bank Clearance Register
          </h3>
          <span className="section-badge font-mono">DIRECT TREASURY CREDITS</span>
        </div>

        <div className="table-responsive">
          <table className="gov-ledger-table bank-ledger-table">
            <thead>
              <tr>
                <th>Bank Ref / UTR</th>
                <th>Financial Institution</th>
                <th>Debit Account</th>
                <th>Period</th>
                <th style={{ textAlign: "right" }}>Statutory Due</th>
                <th style={{ textAlign: "right" }}>Amount Cleared</th>
                <th>Settlement Timestamp</th>
                <th style={{ textAlign: "center" }}>Clearance Status</th>
                <th style={{ textAlign: "center" }}>Audit Verification</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isPaid = tx.transactionStatus === "Paid";
                  return (
                    <tr key={tx.transactionRef || tx._id}>
                      <td>
                        <span className="font-mono font-bold" style={{ color: "#0b3d91" }}>
                          {tx.transactionRef}
                        </span>
                      </td>
                      <td>
                        <div className="flex-align">
                          <BankIcon size={14} color="#0b3d91" />
                          <span>{tx.bankName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-muted">{tx.maskedAccount}</span>
                      </td>
                      <td>
                        <strong>{tx.month}</strong> <span style={{ fontSize: "0.8rem", color: "#64748b" }}>({tx.financialYear})</span>
                      </td>
                      <td style={{ textAlign: "right" }} className="font-mono">
                        ₹{tx.taxDue?.toLocaleString("en-IN")}
                      </td>
                      <td style={{ textAlign: "right" }} className="font-mono font-bold" style={{ color: isPaid ? "#065f46" : "#b91c1c" }}>
                        ₹{tx.amountPaid?.toLocaleString("en-IN")}
                      </td>
                      <td style={{ fontSize: "0.84rem" }}>
                        {tx.paymentDate
                          ? new Date(tx.paymentDate).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Pending Remittance"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`status-pill ${isPaid ? "status-paid" : "status-unpaid"}`}>
                          {isPaid ? "CONFIRMED" : "PENDING"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="reconciled-pill flex-align" style={{ justifyContent: "center" }}>
                          <CheckIcon size={13} color="#059669" />
                          <span>CBS Reconciled</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                    No bank remittance records match the selected institution or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankRecordsPage;
