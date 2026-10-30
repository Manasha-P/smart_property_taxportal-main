import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTaxOverview } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";
import SearchHistory from "../components/SearchHistory";
import PrintableTaxReport from "../components/PrintableTaxReport";
import TaxStatusCard from "../components/TaxStatusCard";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import {
  NationalEmblemIcon,
  CalendarIcon,
  BankIcon,
  ScaleIcon,
  ChartIcon,
  AlertIcon,
  DocumentIcon,
  BuildingGovIcon,
} from "../components/Icons";

const TaxOverviewPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getTaxOverview(recordId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load taxpayer overview.");
      } finally {
        setLoading(false);
      }
    };
    if (recordId) fetchData();
  }, [recordId]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="page">
        <Breadcrumbs items={[{ label: "Tax Assessment Overview" }]} />
        <ErrorMessage message={error} />
        <div style={{ marginTop: "1rem" }}>
          <Link to="/portal" className="btn-search-primary">
            ← Search Another Property Record
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { taxpayer, totals, alerts } = data;

  return (
    <div className="page tax-overview-page">
      {/* Top Header & Breadcrumb */}
      <Breadcrumbs items={[{ label: `Dossier (${taxpayer.aadhaarDemoId})` }]} />

      {/* Official Government Dossier Masthead */}
      <div className="dossier-masthead-card">
        <div className="dossier-masthead-top">
          <div className="dossier-title-block flex-align">
            <div className="dossier-emblem-badge">
              <NationalEmblemIcon size={32} color="#d4af37" />
            </div>
            <div>
              <div className="dossier-meta-badge-row flex-align">
                <span className="gov-seal-title">OFFICIAL CADASTRE ASSESSMENT DOSSIER</span>
                <span className="dossier-ref-tag font-mono">CADASTRE REF: {taxpayer.propertyId}</span>
              </div>
              <h2 className="dossier-main-heading">Property Tax Assessment & DCB Treasury Ledger</h2>
              <p className="dossier-sub-text">
                Registered Taxpayer: <strong>{taxpayer.name}</strong> • Masked Aadhaar UID:{" "}
                <span className="font-mono font-bold" style={{ color: "#0b3d91" }}>
                  {taxpayer.aadhaarMasked} ({taxpayer.aadhaarDemoId})
                </span>
              </p>
            </div>
          </div>

          <div className="dossier-actions-group">
            <button
              type="button"
              className="btn-print-action flex-align"
              onClick={() => setShowReportModal(true)}
              title="Generate and print official municipal tax clearance receipt"
            >
              <DocumentIcon size={18} color="#0b3d91" />
              <span>Download Form-V Statement</span>
            </button>
            <Link to="/portal" className="btn-outline flex-align" title="Search another citizen record">
              🔍 Search Another ID
            </Link>
          </div>
        </div>

        {/* Official Statutory Metadata Bar */}
        <div className="dossier-meta-footer-strip">
          <span className="strip-item">
            <strong>Assessment Year:</strong> {taxpayer.assessmentYear}
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>Treasury Head:</strong> 0035-Taxes on Immovable Property
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>Municipal Zone:</strong> Urban North Ward 4
          </span>
          <span className="strip-dot">•</span>
          <span className="strip-item">
            <strong>Inter-Bank Clearing:</strong> Verified CBS Reconciled
          </span>
        </div>
      </div>

      {/* Recent Search History Chips */}
      <SearchHistory currentRecordId={taxpayer.aadhaarDemoId} />

      {/* Data Quality & Reconciliation Alerts */}
      {alerts && alerts.length > 0 && (
        <section className="section-block">
          <div className="reconciliation-alerts-box">
            <div className="alert-header flex-align">
              <AlertIcon size={20} color="#b45309" />
              <h4>Municipal Data Quality & Audit Notices ({alerts.length})</h4>
            </div>
            <div className="alerts-list">
              {alerts.map((alert, idx) => (
                <div key={idx} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
                  <span className="alert-badge">{alert.type.replace(/_/g, " ")}</span>
                  <div className="alert-body">
                    <strong>{alert.title}:</strong> {alert.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Financial KPI Cards Grid - Bank Ledger Grade */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL ANNUAL TAX ASSESSED</span>
          <span className="kpi-value font-mono">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Statutory Demand for FY {taxpayer.assessmentYear}</span>
        </div>
        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL CLEARED REMITTANCE</span>
          <span className="kpi-value font-mono" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Confirmed Inter-Bank CBS Credit</span>
        </div>
        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">OUTSTANDING BALANCE DUE</span>
          <span className="kpi-value font-mono" style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}>
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">
            {totals.totalOutstanding > 0 ? "Payable to Municipal Treasury" : "Zero Balance / Settled in Full"}
          </span>
        </div>
        <div className="kpi-card kpi-progress">
          <span className="kpi-title">SETTLEMENT PROGRESS</span>
          <span className="kpi-value font-mono">{totals.paymentProgress}%</span>
          <span className="kpi-sub">
            {totals.completedPaymentsCount || 0} Paid Periods • {totals.missedInstalmentsCount || 0} Overdue Periods
          </span>
        </div>
      </section>

      {/* Deterministic Statutory Tax Status Card */}
      <section className="section-block">
        <TaxStatusCard totals={totals} />
      </section>

      {/* Taxpayer & Property Information Dossier */}
      <section className="section-block">
        <div className="info-card gov-formal-card">
          <div className="card-header-styled">
            <h3 className="flex-align">
              <BuildingGovIcon size={22} color="#0b3d91" />
              Taxpayer Profile & Registered Property Assessment
            </h3>
            <span className="section-badge font-mono">REGISTER OF IMMOVABLE PROPERTY</span>
          </div>

          <div className="info-grid">
            <div className="info-cell">
              <span className="label">Registered Citizen Name</span>
              <span className="value font-semibold">{taxpayer.name}</span>
            </div>
            <div className="info-cell">
              <span className="label">Masked Aadhaar Identifier</span>
              <span className="value font-mono">{taxpayer.aadhaarMasked}</span>
            </div>
            <div className="info-cell">
              <span className="label">12-Digit Numeric UID</span>
              <span className="value font-mono">{taxpayer.numericAadhaar}</span>
            </div>
            <div className="info-cell">
              <span className="label">Property Reference ID</span>
              <span className="value font-mono font-bold" style={{ color: "#0b3d91" }}>
                {taxpayer.propertyId}
              </span>
            </div>
            <div className="info-cell">
              <span className="label">Property Classification</span>
              <span className="value">{taxpayer.propertyType} Property</span>
            </div>
            <div className="info-cell">
              <span className="label">Registered Occupancy Usage</span>
              <span className="value">{taxpayer.propertyUsage}</span>
            </div>
            <div className="info-cell full-width">
              <span className="label">Registered Physical Address</span>
              <span className="value">{taxpayer.propertyAddress}</span>
            </div>
            <div className="info-cell">
              <span className="label">Assessed Built-Up Carpet Area</span>
              <span className="value font-mono">{taxpayer.propertyAreaSqFt} sq. ft</span>
            </div>
            <div className="info-cell">
              <span className="label">Cadastre Assessed Valuation</span>
              <span className="value font-mono font-semibold">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</span>
            </div>
            <div className="info-cell">
              <span className="label">Applicable Assessment Period</span>
              <span className="value">{taxpayer.assessmentYear}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Dedicated Navigation Portals */}
      <section className="section-block">
        <div className="section-card-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h3>Specialized Tax Analytics & Settlement Portals</h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "0.2rem" }}>
              Access individual sub-portals for detailed monthly collection books, multi-year archives, inter-bank clearing ledgers, and statutory scrutiny.
            </p>
          </div>
        </div>

        <div className="nav-cards-grid">
          {/* Card 1: Monthly Tax & Revenue Analysis */}
          <div
            className="nav-action-card"
            onClick={() => navigate(`/monthly-analysis/${taxpayer.aadhaarDemoId}`)}
          >
            <div className="nav-card-icon" style={{ background: "#e0f2fe", color: "#0284c7" }}>
              <CalendarIcon size={28} color="#0284c7" />
            </div>
            <div className="nav-card-content">
              <h4>Monthly DCB & Collection Ledger</h4>
              <p>
                12-month instalment schedule, payment clearance timestamps, interactive Recharts trend graphs, and CSV ledger export.
              </p>
              <span className="nav-card-link">Inspect Monthly Ledger →</span>
            </div>
          </div>

          {/* Card 2: Annual Tax Analysis */}
          <div
            className="nav-action-card"
            onClick={() => navigate(`/annual-analysis/${taxpayer.aadhaarDemoId}`)}
          >
            <div className="nav-card-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
              <ChartIcon size={28} color="#d97706" />
            </div>
            <div className="nav-card-content">
              <h4>Multi-Year Assessment History</h4>
              <p>
                Comparative multi-year tax assessments, year-over-year payment growth rates, historical audit notes, and fiscal trends.
              </p>
              <span className="nav-card-link">Inspect Annual History →</span>
            </div>
          </div>

          {/* Card 3: Connected Bank Records */}
          <div
            className="nav-action-card"
            onClick={() => navigate(`/bank-records/${taxpayer.aadhaarDemoId}`)}
          >
            <div className="nav-card-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
              <BankIcon size={28} color="#059669" />
            </div>
            <div className="nav-card-content">
              <h4>Inter-Bank Remittance Clearing</h4>
              <p>
                Electronic payment logs across State Bank of India, Indian Bank, and Bank of India with UTR verification and CBS reconciliation audit.
              </p>
              <span className="nav-card-link">Inspect Bank Records →</span>
            </div>
          </div>

          {/* Card 4: AI Compliance & Survey Recommendations */}
          <div
            className="nav-action-card"
            onClick={() => navigate(`/compliance/${taxpayer.aadhaarDemoId}`)}
          >
            <div className="nav-card-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              <ScaleIcon size={28} color="#7c3aed" />
            </div>
            <div className="nav-card-content">
              <h4>Statutory Compliance & Survey Scrutiny</h4>
              <p>
                Compliance risk tiering, payment consistency analysis, and automated municipal field survey directives for revenue officers.
              </p>
              <span className="nav-card-link">Inspect Compliance Scrutiny →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Printable Tax Report Modal */}
      {showReportModal && (
        <PrintableTaxReport
          recordId={taxpayer.aadhaarDemoId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default TaxOverviewPage;
