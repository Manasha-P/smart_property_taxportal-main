import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMonthlyAnalysis } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { CalendarIcon, DownloadIcon, StampIcon } from "../components/Icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MonthlyAnalysisPage = () => {
  const { recordId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedYear, setSelectedYear] = useState("2024-25");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMonthlyAnalysis(recordId, {
          financialYear: selectedYear,
          status: selectedStatus,
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load monthly tax records.");
      } finally {
        setLoading(false);
      }
    };
    if (recordId) fetchData();
  }, [recordId, selectedYear, selectedStatus]);

  const handleExportCSV = () => {
    if (!data?.months || data.months.length === 0) return;
    const headers = [
      "Month",
      "Statutory Due (INR)",
      "Amount Remitted (INR)",
      "Outstanding Arrears (INR)",
      "Completion (%)",
      "Statutory Due Date",
      "Clearance Status",
      "Overdue Flag",
    ];
    const rows = data.months.map((m) => [
      m.month,
      m.taxDue,
      m.taxPaid,
      m.outstanding,
      m.paymentPercentage,
      m.dueDate ? new Date(m.dueDate).toISOString().split("T")[0] : "N/A",
      m.status,
      m.isOverdue ? "OVERDUE" : "CURRENT",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Monthly_DCB_Ledger_${recordId}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="page">
        <Breadcrumbs items={[{ label: "Overview", to: `/tax-overview/${recordId}` }, { label: "Monthly DCB Ledger" }]} />
        <ErrorMessage message={error} />
        <Link to={`/tax-overview/${recordId}`} className="btn-search-primary" style={{ marginTop: "1rem" }}>
          ← Back to Tax Overview
        </Link>
      </div>
    );
  }

  const { taxpayer, months, totals, financialYears } = data;

  return (
    <div className="page analysis-subpage">
      <Breadcrumbs
        items={[
          { label: `Dossier (${recordId})`, to: `/tax-overview/${recordId}` },
          { label: "Monthly DCB & Collection Ledger" },
        ]}
      />

      <div className="subpage-header-row">
        <div>
          <div className="flex-align" style={{ gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span className="gov-seal-title flex-align">
              <CalendarIcon size={14} color="#0b3d91" />
              MONTHLY DEMAND, COLLECTION & BALANCE (DCB) REGISTER
            </span>
            <span className="section-badge font-mono">FINANCIAL YEAR {selectedYear}</span>
          </div>
          <h2>Monthly Property Tax Instalment Schedule</h2>
          <p className="subpage-sub">
            Month-wise statutory assessment dues, electronic clearances, and overdue tracking for <strong>{taxpayer.name}</strong> ({recordId}).
          </p>
        </div>

        <div className="subpage-actions-row">
          <button type="button" className="btn-outline flex-align" onClick={handleExportCSV}>
            <DownloadIcon size={16} color="#0b3d91" />
            <span>Export Monthly CSV</span>
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

      {/* Filter Toolbar */}
      <div className="filter-toolbar-card">
        <div className="filter-group">
          <label htmlFor="filter-year">Assessment Financial Year:</label>
          <select id="filter-year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {financialYears?.map((y) => (
              <option key={y} value={y}>
                FY {y}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-status">Payment Clearance Filter:</label>
          <select id="filter-status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Instalment Records</option>
            <option value="Paid">Cleared / Paid Only</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid / Arrears Only</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#64748b" }}>
          Showing <strong>{months?.length || 0}</strong> instalment entries
        </div>
      </div>

      {/* Monthly KPI Overview Grid */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL MONTHLY DEMAND</span>
          <span className="kpi-value font-mono">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Assessed for FY {selectedYear}</span>
        </div>
        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL CONFIRMED REMITTANCE</span>
          <span className="kpi-value font-mono" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Inter-Bank CBS Credits</span>
        </div>
        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">MONTHLY OUTSTANDING ARREARS</span>
          <span className="kpi-value font-mono" style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}>
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Pending Instalment Balances</span>
        </div>
        <div className="kpi-card kpi-progress">
          <span className="kpi-title">COLLECTION RECOVERY RATE</span>
          <span className="kpi-value font-mono">{totals.paymentProgress}%</span>
          <span className="kpi-sub">{months.length} Tracked Instalments</span>
        </div>
      </section>

      {/* Recharts Analytics Grid */}
      <section className="section-block">
        <div className="charts-grid-two">
          <div className="chart-box gov-chart-card">
            <h4>Monthly Assessed Demand vs Cleared Payment (₹)</h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend />
                <Line type="monotone" dataKey="taxDue" name="Statutory Demand" stroke="#0b3d91" strokeWidth={2.2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="taxPaid" name="Cleared Remittance" stroke="#059669" strokeWidth={2.2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box gov-chart-card">
            <h4>Outstanding Monthly Arrears (₹)</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend />
                <Bar dataKey="outstanding" name="Pending Arrears" fill="#b91c1c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Detailed Monthly Transaction Table */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <StampIcon size={20} color="#0b3d91" />
              Monthly Demand, Collection & Balance (DCB) Ledger
            </h3>
            <span className="section-badge font-mono">{months.length} INSTALMENTS POPULATED</span>
          </div>

          {months.length === 0 ? (
            <p className="empty-note">No monthly tax records found matching the selected filter criteria.</p>
          ) : (
            <div className="table-responsive">
              <table className="gov-ledger-table">
                <thead>
                  <tr>
                    <th>Instalment Period</th>
                    <th style={{ textAlign: "right" }}>Statutory Due</th>
                    <th style={{ textAlign: "right" }}>Amount Cleared</th>
                    <th style={{ textAlign: "right" }}>Outstanding Balance</th>
                    <th style={{ textAlign: "center" }}>Recovery %</th>
                    <th>Statutory Due Date</th>
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
                      <td style={{ fontSize: "0.86rem" }}>
                        {m.dueDate ? new Date(m.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`status-pill status-${m.status.replace(/\s+/g, "-").toLowerCase()}`}>
                          {m.status}
                        </span>
                        {m.isOverdue && (
                          <span className="badge-overdue margin-left-xs">OVERDUE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MonthlyAnalysisPage;
