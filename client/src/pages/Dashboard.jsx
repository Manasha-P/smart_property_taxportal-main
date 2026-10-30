import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TaxpayerCard from "../components/TaxpayerCard";
import TaxStatusCard from "../components/TaxStatusCard";
import AITaxSummaryCard from "../components/AITaxSummaryCard";
import BankTable from "../components/BankTable";
import MonthlyTaxTable from "../components/MonthlyTaxTable";
import AnnualTaxTable from "../components/AnnualTaxTable";
import { AnnualTaxChart, BankPaymentChart, ProgressPieChart } from "../components/Charts";
import AIInsightCard from "../components/AIInsightCard";
import StepLoading from "../components/StepLoading";
import ErrorMessage from "../components/ErrorMessage";
import SearchForm from "../components/SearchForm";
import {
  BankIcon,
  CalendarIcon,
  ChartIcon,
  NationalEmblemIcon,
  StampIcon,
} from "../components/Icons";
import { getFullTaxpayerProfile } from "../services/api";

const Dashboard = () => {
  const { aadhaar } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loadingStep, setLoadingStep] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoadingStep(true);
      setError("");
      try {
        const res = await getFullTaxpayerProfile(aadhaar);
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load taxpayer tax profile.");
          setLoadingStep(false);
        }
      }
    };
    if (aadhaar) {
      fetchProfile();
    }
    return () => {
      isMounted = false;
    };
  }, [aadhaar]);

  const handleNewSearch = (newAadhaar) => {
    if (newAadhaar !== aadhaar) {
      navigate(`/dashboard/${newAadhaar}`);
    } else {
      setLoadingStep(true);
      setError("");
      getFullTaxpayerProfile(newAadhaar)
        .then((res) => setData(res.data))
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load taxpayer tax profile.");
          setLoadingStep(false);
        });
    }
  };

  const handleStepLoadingComplete = () => {
    setLoadingStep(false);
  };

  if (loadingStep) {
    return (
      <div className="page portal-dashboard-page">
        <StepLoading onComplete={handleStepLoadingComplete} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page portal-dashboard-page">
        <div className="dossier-masthead-card">
          <h2>Property Tax Compliance Portal</h2>
          <p>Enter your Aadhaar Number to retrieve complete tax breakdown</p>
          <SearchForm onSearch={handleNewSearch} loading={false} />
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!data) return null;

  const { taxpayer, totals, bankSummary, monthlySummary, annualSummary, payments, aiAnalysis } = data;

  return (
    <div className="page portal-dashboard-page">
      {/* Top Government Masthead & Search Bar */}
      <section className="dossier-masthead-card">
        <div className="dossier-masthead-top">
          <div className="dossier-title-block flex-align">
            <div className="dossier-emblem-badge">
              <NationalEmblemIcon size={34} color="#d4af37" />
            </div>
            <div>
              <div className="dossier-meta-badge-row flex-align">
                <span className="gov-seal-title">NATIONAL CADASTRE & TREASURY DOSSIER</span>
                <span className="section-badge font-mono">
                  {taxpayer.aadhaarDemoId || taxpayer.aadhaarMasked}
                </span>
              </div>
              <h2 className="dossier-main-heading">Property Tax Assessment & Bank Clearing Dashboard</h2>
              <p className="dossier-sub-text">
                Assessed profile, multi-bank electronic payment clearance, and statutory compliance record for:{" "}
                <strong>{taxpayer.name}</strong>
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <SearchForm onSearch={handleNewSearch} loading={loadingStep} />
        </div>

        {/* Quick Route Drill-Down Bar */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--bank-slate-200)" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gov-navy-900)", alignSelf: "center", marginRight: "0.25rem" }}>
            Direct Views:
          </span>
          <Link to={`/dashboard/${aadhaar}/banks`} className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}>
            🏦 Bank Remittances
          </Link>
          <Link to={`/dashboard/${aadhaar}/annual`} className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}>
            📊 Multi-Year Ledger
          </Link>
          <Link to={`/dashboard/${aadhaar}/progress`} className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}>
            🎯 Settlement Meter
          </Link>
          <Link to={`/dashboard/${aadhaar}/ai-analysis`} className="btn-outline" style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}>
            ⚖️ Statutory Scrutiny
          </Link>
        </div>
      </section>

      {/* Top Summary KPI Cards */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL STATUTORY DUE</span>
          <span className="kpi-value font-mono">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Total Assessed Tax</span>
        </div>
        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL CLEARED REMITTANCE</span>
          <span className="kpi-value font-mono" style={{ color: "#065f46" }}>
            ₹{totals.totalPaid?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Inter-Bank CBS Remitted</span>
        </div>
        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">OUTSTANDING BALANCE</span>
          <span className="kpi-value font-mono" style={{ color: totals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}>
            ₹{totals.totalOutstanding?.toLocaleString("en-IN")}
          </span>
          <span className="kpi-sub">Due to Municipal Treasury</span>
        </div>
        <div className="kpi-card kpi-progress">
          <span className="kpi-title">SETTLEMENT RATIO</span>
          <span className="kpi-value font-mono">{totals.paymentProgress}%</span>
          <span className="kpi-sub">Overall Recovery Progress</span>
        </div>
      </section>

      {/* System Tax Status Banner */}
      <section className="section-block">
        <TaxStatusCard totals={totals} />
      </section>

      {/* AI Generated Tax Summary */}
      <section className="section-block">
        <AITaxSummaryCard taxpayer={taxpayer} totals={totals} aiAnalysis={aiAnalysis} />
      </section>

      {/* Taxpayer & Property Information */}
      <section className="section-block">
        <TaxpayerCard taxpayer={taxpayer} />
      </section>

      {/* Bank-wise Tax Details */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <BankIcon size={20} color="#0b3d91" /> Inter-Bank Electronic Remittance Details
            </h3>
            <div className="flex-align" style={{ gap: "0.5rem" }}>
              <span className="section-badge font-mono">CORE BANKING SYSTEM (CBS) CLEARANCES</span>
              <Link to={`/dashboard/${aadhaar}/banks`} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}>
                Dedicated View →
              </Link>
            </div>
          </div>
          <BankTable banks={bankSummary} />
        </div>
      </section>

      {/* Monthly Tax Details */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <CalendarIcon size={20} color="#0b3d91" /> Monthly Demand, Collection & Balance (DCB)
            </h3>
            <span className="section-badge font-mono">INSTALMENT RECONCILIATION</span>
          </div>
          <MonthlyTaxTable months={monthlySummary} />
        </div>
      </section>

      {/* Annual Tax Details */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <CalendarIcon size={20} color="#0b3d91" /> Multi-Year Fiscal Assessment Summary
            </h3>
            <div className="flex-align" style={{ gap: "0.5rem" }}>
              <span className="section-badge font-mono">HISTORICAL FINANCIAL YEARS</span>
              <Link to={`/dashboard/${aadhaar}/annual`} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}>
                Dedicated View →
              </Link>
            </div>
          </div>
          <AnnualTaxTable years={annualSummary} />
        </div>
      </section>

      {/* Detailed Payment Log */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <StampIcon size={20} color="#0b3d91" /> Inter-Bank Remittance Log
            </h3>
            <span className="section-badge font-mono">{payments?.length || 0} CBS ENTRIES</span>
          </div>
          <div className="table-responsive">
            <table className="gov-ledger-table">
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th>Month</th>
                  <th>Financial Institution</th>
                  <th style={{ textAlign: "right" }}>Statutory Due</th>
                  <th style={{ textAlign: "right" }}>Amount Remitted</th>
                  <th>Settlement Date</th>
                  <th style={{ textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{p.financialYear}</td>
                    <td>{p.month || "—"}</td>
                    <td>
                      <div className="flex-align">
                        <BankIcon size={14} color="#0b3d91" />
                        <span>{p.bankName}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono">
                      ₹{p.taxDue?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }} className="font-mono font-semibold" style={{ color: "#065f46" }}>
                      ₹{p.amountPaid?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill status-${p.status?.replace(/\s+/g, "-").toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Visual Analytics */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <ChartIcon size={20} color="#0b3d91" /> Revenue Analytics & Progress Charts
            </h3>
            <Link to={`/dashboard/${aadhaar}/progress`} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}>
              Settlement Proportion Meter →
            </Link>
          </div>
          <div className="charts-grid">
            <AnnualTaxChart years={annualSummary} />
            <BankPaymentChart banks={bankSummary} />
            <ProgressPieChart progress={{ totalPaid: totals.totalPaid, outstanding: totals.totalOutstanding }} />
          </div>
        </div>
      </section>

      {/* AI Tax Compliance Analysis & Recommendation */}
      <section className="section-block">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
          <Link to={`/dashboard/${aadhaar}/ai-analysis`} className="btn-outline" style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem" }}>
            Open Dedicated AI Scrutiny Docket →
          </Link>
        </div>
        <AIInsightCard analysis={aiAnalysis} />
      </section>
    </div>
  );
};

export default Dashboard;
