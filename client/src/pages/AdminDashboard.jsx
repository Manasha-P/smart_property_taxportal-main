import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminOverview } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import {
  EmblemIcon,
  BankIcon,
  ChartIcon,
  AiBrainIcon,
  LightbulbIcon,
  AlertIcon,
  CrossIcon,
  CheckIcon,
} from "../components/Icons";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await getAdminOverview();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load municipal admin overview.");
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="page flex-center" style={{ minHeight: "400px" }}>
        <div className="spinner-ring"></div>
        <p style={{ color: "#0b3d91", fontWeight: 700 }}>Loading Municipal Revenue Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const { summary, complianceDistribution, bankCollections, highRiskTaxpayers, officerAiRecommendations } = data;

  return (
    <div className="page portal-dashboard-page">
      {/* Officer Header Banner */}
      <div className="portal-hero-banner" style={{ background: "linear-gradient(135deg, #06265e 0%, #0b3d91 100%)" }}>
        <div className="portal-emblem-badge">
          <EmblemIcon size={34} color="#ffffff" />
        </div>
        <div className="portal-hero-titles">
          <span className="gov-seal-title" style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
            OFFICER ADMINISTRATION PORTAL
          </span>
          <h2>Municipal Property Tax Compliance & Revenue Overview</h2>
          <p>
            Real-time municipal dashboard aggregating city-wide revenue collections, bank interoperability metrics, compliance distribution, and AI risk flags for tax officers.
          </p>
        </div>
      </div>

      {/* Top Municipal Summary KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL CITY TAX DUE</span>
          <span className="kpi-value">₹{summary.totalCityTaxDue.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Across {summary.totalTaxpayers} Assessed Taxpayers</span>
        </div>

        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL REVENUE COLLECTED</span>
          <span className="kpi-value">₹{summary.totalCityTaxPaid.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Remitted Multi-Bank Remittances</span>
        </div>

        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">CUMULATIVE OUTSTANDING</span>
          <span className="kpi-value">₹{summary.totalCityOutstanding.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Pending Municipal Dues</span>
        </div>

        <div className="kpi-card kpi-progress">
          <span className="kpi-title">CITY RECOVERY RATE</span>
          <span className="kpi-value">{summary.cityProgressPercentage}%</span>
          <span className="kpi-sub">Overall Municipal Progress</span>
        </div>
      </div>

      {/* Compliance Distribution Section */}
      <div className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <ChartIcon size={22} color="#0b3d91" /> Municipal Compliance Distribution
            </h3>
            <span className="section-badge">Taxpayer Categorization</span>
          </div>

          <div className="info-grid">
            <div className="info-cell" style={{ background: "#f0fdf4", padding: "1.2rem", borderRadius: "8px", borderLeft: "5px solid #10b981" }}>
              <span className="label" style={{ color: "#166534", fontWeight: 700 }}>HIGH COMPLIANCE (TAX PAYERS)</span>
              <span className="value" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#15803d" }}>
                {complianceDistribution.highComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.82rem", color: "#166534" }}>Fully satisfied tax obligations</span>
            </div>

            <div className="info-cell" style={{ background: "#fffbeb", padding: "1.2rem", borderRadius: "8px", borderLeft: "5px solid #f59e0b" }}>
              <span className="label" style={{ color: "#92400e", fontWeight: 700 }}>MEDIUM COMPLIANCE (PARTIAL)</span>
              <span className="value" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#b45309" }}>
                {complianceDistribution.mediumComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.82rem", color: "#92400e" }}>Partial payments recorded</span>
            </div>

            <div className="info-cell" style={{ background: "#fef2f2", padding: "1.2rem", borderRadius: "8px", borderLeft: "5px solid #ef4444" }}>
              <span className="label" style={{ color: "#991b1b", fontWeight: 700 }}>LOW COMPLIANCE (NON-TAX PAYERS)</span>
              <span className="value" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#b91c1c" }}>
                {complianceDistribution.lowComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.82rem", color: "#991b1b" }}>Zero tax payment remitted</span>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Taxpayers Follow-up Table */}
      <div className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <AlertIcon size={22} color="#b91c1c" /> Officer Action List — Accounts Requiring Follow-Up
            </h3>
            <span className="section-badge" style={{ background: "#fee2e2", color: "#991b1b" }}>High Priority Enforcement</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aadhaar ID</th>
                  <th>Taxpayer Name</th>
                  <th>Property Type</th>
                  <th>Total Due</th>
                  <th>Amount Paid</th>
                  <th>Outstanding Dues</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {highRiskTaxpayers.map((tp) => (
                  <tr key={tp._id}>
                    <td className="font-mono font-bold">{tp.aadhaarDemoId}</td>
                    <td className="font-bold">{tp.name}</td>
                    <td>{tp.propertyType}</td>
                    <td>₹{tp.totalDue.toLocaleString("en-IN")}</td>
                    <td className="text-success">₹{tp.totalPaid.toLocaleString("en-IN")}</td>
                    <td className="text-danger font-bold">₹{tp.outstanding.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`status-pill ${tp.riskLevel === "HIGH" ? "status-unpaid" : "status-partially-paid"}`}>
                        {tp.riskLevel} RISK
                      </span>
                    </td>
                    <td>
                      <Link to={`/dashboard/${tp.aadhaarDemoId}`} className="btn-search-primary" style={{ padding: "0.35rem 0.8rem", fontSize: "0.82rem" }}>
                        View Profile →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bank Interoperability Collection Summary */}
      <div className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <BankIcon size={22} color="#0b3d91" /> Bank Interoperability Collection Summary
            </h3>
            <span className="section-badge">Multi-Bank Remittance Aggregation</span>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bank Institution</th>
                  <th>Total Assessed Tax Dues</th>
                  <th>Total Revenue Collected</th>
                  <th>Outstanding Balance</th>
                  <th>Recovery Rate</th>
                </tr>
              </thead>
              <tbody>
                {bankCollections.map((b) => (
                  <tr key={b.bankName}>
                    <td className="font-bold flex-align">
                      <BankIcon size={16} color="#0b3d91" /> {b.bankName}
                    </td>
                    <td>₹{b.totalDue.toLocaleString("en-IN")}</td>
                    <td className="text-success font-semibold">₹{b.totalPaid.toLocaleString("en-IN")}</td>
                    <td className="text-danger font-bold">₹{b.outstanding.toLocaleString("en-IN")}</td>
                    <td>
                      <span className="font-bold" style={{ color: b.progress === 100 ? "#15803d" : "#b45309" }}>
                        {b.progress}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Officer AI Action Recommendations Card */}
      <div className="ai-card">
        <div className="card-header-styled">
          <div className="ai-title-block flex-align">
            <AiBrainIcon size={26} color="#0b3d91" />
            <div>
              <h3>AI Municipal Action Recommendations</h3>
              <span className="ai-subtitle">Automated Officer Advisory Insights</span>
            </div>
          </div>
          <span className="source-tag">Rule & LLM Generated</span>
        </div>

        <div className="ai-recommendation-box">
          <span className="rec-title flex-align">
            <LightbulbIcon size={18} color="#047857" /> Recommended Municipal Enforcement Steps:
          </span>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem", color: "#065f46", fontSize: "0.95rem" }}>
            {officerAiRecommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
