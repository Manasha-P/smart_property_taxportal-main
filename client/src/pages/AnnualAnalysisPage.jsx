import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnnualAnalysis } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { DownloadIcon, BuildingGovIcon, StampIcon } from "../components/Icons";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AnnualAnalysisPage = () => {
  const { recordId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAnnualAnalysis(recordId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load annual summary records.");
      } finally {
        setLoading(false);
      }
    };
    if (recordId) fetchData();
  }, [recordId]);

  const handleExportCSV = () => {
    if (!data?.years || data.years.length === 0) return;
    const headers = [
      "Assessment Year",
      "Statutory Tax Assessed (INR)",
      "Total Remitted (INR)",
      "Outstanding Balance (INR)",
      "Settlement Completion (%)",
      "YoY Demand Growth (%)",
      "Statutory Status",
    ];
    const rows = data.years.map((y) => [
      y.financialYear,
      y.taxDue,
      y.taxPaid,
      y.outstanding,
      y.progressPercentage,
      y.yoyGrowth !== null ? `${y.yoyGrowth}%` : "Baseline",
      y.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Annual_Assessment_Ledger_${recordId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="page">
        <Breadcrumbs items={[{ label: "Overview", to: `/tax-overview/${recordId}` }, { label: "Annual Analysis" }]} />
        <ErrorMessage message={error} />
        <Link to={`/tax-overview/${recordId}`} className="btn-search-primary" style={{ marginTop: "1rem" }}>
          ← Back to Tax Overview
        </Link>
      </div>
    );
  }

  const { taxpayer, years, totals } = data;

  return (
    <div className="page analysis-subpage">
      <Breadcrumbs
        items={[
          { label: `Dossier (${recordId})`, to: `/tax-overview/${recordId}` },
          { label: "Annual Assessment & Fiscal History" },
        ]}
      />

      <div className="subpage-header-row">
        <div>
          <div className="flex-align" style={{ gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span className="gov-seal-title flex-align">
              <BuildingGovIcon size={14} color="#0b3d91" />
              MULTI-YEAR FISCAL AUDIT REGISTER
            </span>
            <span className="section-badge font-mono">CADASTRE HISTORICAL LEDGER</span>
          </div>
          <h2>Annual Tax Assessment & Historical Trends</h2>
          <p className="subpage-sub">
            Multi-year assessment ledger, historical collection rate, and year-over-year revenue trajectory for <strong>{taxpayer.name}</strong> ({recordId}).
          </p>
        </div>

        <div className="subpage-actions-row">
          <button type="button" className="btn-outline flex-align" onClick={handleExportCSV}>
            <DownloadIcon size={16} color="#0b3d91" />
            <span>Export Annual CSV</span>
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

      {/* Annual Summary KPI Grid */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">CUMULATIVE MULTI-YEAR DEMAND</span>
          <span className="kpi-value font-mono">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Across {years?.length || 0} Fiscal Periods</span>
        </div>
        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL REVENUE RECOVERED</span>
          <span className="kpi-value font-mono" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Verified Electronic Clearances</span>
        </div>
        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">CUMULATIVE ARREARS</span>
          <span className="kpi-value font-mono" style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}>
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Pending Municipal Balance</span>
        </div>
        <div className="kpi-card kpi-progress">
          <span className="kpi-title">HISTORICAL SETTLEMENT RATE</span>
          <span className="kpi-value font-mono">{totals.paymentProgress}%</span>
          <span className="kpi-sub">Fiscal Recovery Ratio</span>
        </div>
      </section>

      {/* Analytics Recharts Grid */}
      <section className="section-block">
        <div className="charts-grid-two">
          <div className="chart-box gov-chart-card">
            <h4>Annual Assessment Demand vs Remitted Tax (₹)</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={years}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="financialYear" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend />
                <Bar dataKey="taxDue" name="Statutory Demand" fill="#0b3d91" radius={[4, 4, 0, 0]} />
                <Bar dataKey="taxPaid" name="Confirmed Remittance" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box gov-chart-card">
            <h4>Settlement Completion Trajectory (%)</h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={years}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="financialYear" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progressPercentage"
                  name="Settlement Recovery %"
                  stroke="#0b3d91"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Detailed Annual Ledger Table */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <StampIcon size={20} color="#0b3d91" />
              Annual Assessment & Demand-Collection-Balance (DCB) Register
            </h3>
            <span className="section-badge font-mono">{years.length} FISCAL YEARS DOCUMENTED</span>
          </div>

          <div className="table-responsive">
            <table className="gov-ledger-table">
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th style={{ textAlign: "right" }}>Statutory Demand</th>
                  <th style={{ textAlign: "right" }}>Amount Remitted</th>
                  <th style={{ textAlign: "right" }}>Arrears / Balance</th>
                  <th style={{ textAlign: "center" }}>Settlement %</th>
                  <th style={{ textAlign: "center" }}>YoY Demand Growth</th>
                  <th style={{ textAlign: "center" }}>Assessment Status</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{y.financialYear}</td>
                    <td style={{ textAlign: "right" }} className="font-mono">
                      ₹{y.taxDue?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono font-semibold" style={{ color: "#065f46" }}>
                      ₹{y.taxPaid?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono font-bold" style={{ color: y.outstanding > 0 ? "#b91c1c" : "#065f46" }}>
                      ₹{y.outstanding?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "center" }} className="font-mono font-semibold">
                      {y.progressPercentage}%
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {y.yoyGrowth !== null ? (
                        <span className={`font-mono ${y.yoyGrowth > 0 ? "text-danger" : "text-success"}`}>
                          {y.yoyGrowth > 0 ? `+${y.yoyGrowth}%` : `${y.yoyGrowth}%`}
                        </span>
                      ) : (
                        <span className="text-muted">Baseline</span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill status-${y.status?.replace(/\s+/g, "-").toLowerCase()}`}>
                        {y.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnualAnalysisPage;
