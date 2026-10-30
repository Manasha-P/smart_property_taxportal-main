import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminOverview } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import {
  NationalEmblemIcon,
  BankIcon,
  ChartIcon,
  LightbulbIcon,
  AlertIcon,
  BuildingGovIcon,
  ScaleIcon,
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
        <p style={{ color: "var(--gov-navy-900)", fontWeight: 700, marginLeft: "1rem" }}>
          Accessing Municipal Revenue Directorate & Treasury Ledger...
        </p>
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

  const {
    summary,
    complianceDistribution,
    bankCollections,
    highRiskTaxpayers,
    officerAiRecommendations,
    surveyStats,
  } = data;

  return (
    <div className="page portal-dashboard-page">
      {/* Officer Header Masthead */}
      <div className="dossier-masthead-card">
        <div className="dossier-masthead-top">
          <div className="dossier-title-block flex-align">
            <div className="dossier-emblem-badge">
              <NationalEmblemIcon size={34} color="#d4af37" />
            </div>
            <div>
              <div className="dossier-meta-badge-row flex-align">
                <span className="gov-seal-title">DIRECTORATE OF MUNICIPAL REVENUE & TREASURY</span>
                <span className="section-badge font-mono">OFFICER EXECUTIVE TERMINAL</span>
              </div>
              <h2 className="dossier-main-heading">Municipal Revenue Administration & Inter-Bank Clearing Overview</h2>
              <p className="dossier-sub-text">
                Real-time executive dashboard monitoring city-wide tax demand, multi-bank settlement velocity, compliance stratification, and inspection deployment queue.
              </p>
            </div>
          </div>

          <div className="dossier-actions-group">
            <Link to="/portal" className="btn-outline flex-align">
              <span>🔍 Public Tax Search</span>
            </Link>
          </div>
        </div>

        <div className="dossier-meta-footer-strip">
          <span className="strip-item">
            <strong>Municipal Jurisdiction:</strong> Urban Local Bodies (Zone 1 - 8)
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>Clearing Consortium:</strong> State Bank of India, Indian Bank, Bank of India
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>Statutory Enforcement:</strong> Municipal Corporation Act Sec 114 / 120
          </span>
        </div>
      </div>

      {/* Top Municipal Summary KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL CITY-WIDE DEMAND</span>
          <span className="kpi-value font-mono">₹{summary.totalCityTaxDue.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Across {summary.totalTaxpayers} Assessed Cadastre Properties</span>
        </div>

        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL REVENUE COLLECTED</span>
          <span className="kpi-value font-mono" style={{ color: "#065f46" }}>
            ₹{summary.totalCityTaxPaid.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Remitted Multi-Bank Clearances</span>
        </div>

        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">CUMULATIVE MUNICIPAL ARREARS</span>
          <span className="kpi-value font-mono" style={{ color: summary.totalCityOutstanding > 0 ? "#b91c1c" : "#059669" }}>
            ₹{summary.totalCityOutstanding.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Pending Recovery Dues</span>
        </div>

        <div className="kpi-card kpi-progress">
          <span className="kpi-title">CITY-WIDE RECOVERY RATIO</span>
          <span className="kpi-value font-mono">{summary.cityProgressPercentage}%</span>
          <span className="kpi-sub">Urban Local Body Collection Target</span>
        </div>
      </div>

      {/* Compliance Distribution Section */}
      <div className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <ChartIcon size={20} color="#0b3d91" /> Municipal Taxpayer Compliance Stratification
            </h3>
            <span className="section-badge font-mono">CADASTRE SCRUTINY TIERS</span>
          </div>

          <div className="info-grid">
            <div
              className="info-cell"
              style={{
                background: "#f0fdf4",
                padding: "1.2rem",
                borderRadius: "var(--radius-xs)",
                border: "1px solid #bbf7d0",
                borderLeft: "5px solid #059669",
              }}
            >
              <span className="label" style={{ color: "#166534", fontWeight: 700 }}>
                HIGH COMPLIANCE (SETTLED IN FULL)
              </span>
              <span className="value font-mono" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#15803d", margin: "0.2rem 0" }}>
                {complianceDistribution.highComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.8rem", color: "#166534" }}>
                Fully satisfied statutory obligations
              </span>
            </div>

            <div
              className="info-cell"
              style={{
                background: "#fffbeb",
                padding: "1.2rem",
                borderRadius: "var(--radius-xs)",
                border: "1px solid #fde68a",
                borderLeft: "5px solid #d97706",
              }}
            >
              <span className="label" style={{ color: "#92400e", fontWeight: 700 }}>
                MEDIUM COMPLIANCE (PARTIAL ARREARS)
              </span>
              <span className="value font-mono" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#b45309", margin: "0.2rem 0" }}>
                {complianceDistribution.mediumComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.8rem", color: "#92400e" }}>
                Partial electronic clearances on record
              </span>
            </div>

            <div
              className="info-cell"
              style={{
                background: "#fef2f2",
                padding: "1.2rem",
                borderRadius: "var(--radius-xs)",
                border: "1px solid #fecaca",
                borderLeft: "5px solid #b91c1c",
              }}
            >
              <span className="label" style={{ color: "#991b1b", fontWeight: 700 }}>
                LOW COMPLIANCE (ENFORCEMENT PENDING)
              </span>
              <span className="value font-mono" style={{ fontSize: "1.75rem", fontWeight: 800, color: "#b91c1c", margin: "0.2rem 0" }}>
                {complianceDistribution.lowComplianceCount} Accounts
              </span>
              <span className="sub" style={{ fontSize: "0.8rem", color: "#991b1b" }}>
                Zero remittances recorded / Notice required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Taxpayers Follow-up Table */}
      <div className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <AlertIcon size={20} color="#b91c1c" />
              Statutory Enforcement Queue — Priority Follow-Up Accounts
            </h3>
            <span className="section-badge font-mono" style={{ background: "#fee2e2", color: "#991b1b" }}>
              HIGH PRIORITY ENFORCEMENT
            </span>
          </div>

          <div className="table-responsive">
            <table className="gov-ledger-table">
              <thead>
                <tr>
                  <th>Cadastre ID</th>
                  <th>Taxpayer Name</th>
                  <th>Classification</th>
                  <th style={{ textAlign: "right" }}>Statutory Due</th>
                  <th style={{ textAlign: "right" }}>Amount Cleared</th>
                  <th style={{ textAlign: "right" }}>Outstanding Arrears</th>
                  <th style={{ textAlign: "center" }}>Risk Scrutiny</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {highRiskTaxpayers.map((tp) => (
                  <tr key={tp._id}>
                    <td>
                      <span className="font-mono font-bold" style={{ color: "#0b3d91" }}>
                        {tp.aadhaarDemoId}
                      </span>
                    </td>
                    <td>
                      <strong>{tp.name}</strong>
                    </td>
                    <td>{tp.propertyType}</td>
                    <td style={{ textAlign: "right" }} className="font-mono">
                      ₹{tp.totalDue.toLocaleString("en-IN")}
                    </td>
                    <td className="font-mono font-semibold" style={{ textAlign: "right", color: "#065f46" }}>
                      ₹{tp.totalPaid.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono font-bold" style={{ color: "#b91c1c" }}>
                      ₹{tp.outstanding.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill ${tp.riskLevel === "HIGH" ? "status-unpaid" : "status-partially-paid"}`}>
                        {tp.riskLevel} RISK
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Link to={`/tax-overview/${tp.aadhaarDemoId}`} className="btn-ledger-action">
                        Audit Dossier →
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
              <BankIcon size={20} color="#0b3d91" /> Core Banking System (CBS) Inter-Bank Clearance Summary
            </h3>
            <span className="section-badge font-mono">MULTI-BANK CLEARING AGGREGATION</span>
          </div>

          <div className="table-responsive">
            <table className="gov-ledger-table">
              <thead>
                <tr>
                  <th>Financial Institution</th>
                  <th style={{ textAlign: "right" }}>Assessed Tax Volume</th>
                  <th style={{ textAlign: "right" }}>Total Revenue Cleared</th>
                  <th style={{ textAlign: "right" }}>Pending Clearance</th>
                  <th style={{ textAlign: "center" }}>Settlement Rate</th>
                </tr>
              </thead>
              <tbody>
                {bankCollections.map((b) => (
                  <tr key={b.bankName}>
                    <td className="font-bold flex-align">
                      <BankIcon size={16} color="#0b3d91" /> {b.bankName}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono">
                      ₹{b.totalDue.toLocaleString("en-IN")}
                    </td>
                    <td className="font-mono font-semibold" style={{ textAlign: "right", color: "#065f46" }}>
                      ₹{b.totalPaid.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono font-bold" style={{ color: "#b91c1c" }}>
                      ₹{b.outstanding.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="font-bold font-mono" style={{ color: b.progress === 100 ? "#15803d" : "#b45309" }}>
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

      {/* Municipal Survey Recommendation Distribution */}
      {surveyStats && (
        <div className="section-block">
          <div className="section-card">
            <div className="section-card-header">
              <h3 className="flex-align">
                <BuildingGovIcon size={20} color="#0b3d91" /> Field Survey & Inspection Orders Distribution
              </h3>
              <span className="section-badge font-mono">FIELD CADASTRE DEPLOYMENT</span>
            </div>
            <div className="info-grid">
              {Object.entries(surveyStats).map(([key, count]) => (
                <div key={key} className="info-cell" style={{ background: "#f8fafc", padding: "1rem", borderRadius: "var(--radius-xs)", border: "1px solid var(--bank-slate-200)" }}>
                  <span className="label font-bold" style={{ color: "var(--gov-navy-900)", fontSize: "0.78rem" }}>
                    {key.toUpperCase()}
                  </span>
                  <span className="value font-bold font-mono" style={{ fontSize: "1.4rem", color: "#1e293b", margin: "0.2rem 0" }}>
                    {count} Accounts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Officer Action Recommendations Card */}
      <div className="ai-card">
        <div className="card-header-styled">
          <div className="ai-title-block flex-align">
            <ScaleIcon size={24} color="#0b3d91" />
            <div>
              <h3>Directorate Statutory Action Directives</h3>
              <span className="ai-subtitle">Automated Administrative Advisory for Revenue Commissioners</span>
            </div>
          </div>
          <span className="section-badge font-mono">STATUTORY DIRECTIVES</span>
        </div>

        <div className="gov-statutory-directive">
          <span className="rec-title flex-align">
            <LightbulbIcon size={18} color="#065f46" />
            Recommended Municipal Enforcement Steps:
          </span>
          <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: "0.5rem", color: "#065f46", fontSize: "0.92rem", lineHeight: 1.6 }}>
            {officerAiRecommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: "0.4rem" }}>
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
