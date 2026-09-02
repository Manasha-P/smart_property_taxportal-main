import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { BankIcon, CalendarIcon, DocumentIcon, ChartIcon } from "../components/Icons";
import { getFullTaxpayerProfile } from "../services/api";

const Dashboard = () => {
  const { aadhaar } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loadingStep, setLoadingStep] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async (targetAadhaar) => {
    setLoadingStep(true);
    setError("");
    try {
      const res = await getFullTaxpayerProfile(targetAadhaar);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load taxpayer tax profile.");
      setLoadingStep(false);
    }
  };

  useEffect(() => {
    if (aadhaar) {
      loadProfile(aadhaar);
    }
  }, [aadhaar]);

  const handleNewSearch = (newAadhaar) => {
    if (newAadhaar !== aadhaar) {
      navigate(`/dashboard/${newAadhaar}`);
    } else {
      loadProfile(newAadhaar);
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
        <div className="search-section-header">
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
      {/* Top Header & Search Bar */}
      <section className="search-section-header">
        <div className="portal-title-badge">GOVERNMENT DIGITAL SERVICE PORTAL</div>
        <h2>Property Tax Compliance Dashboard</h2>
        <p>Complete property tax profile, bank-wise breakdown, and AI compliance analysis retrieved for Aadhaar: <strong>{taxpayer.aadhaarDemoId || taxpayer.aadhaarMasked}</strong></p>

        <div className="portal-search-wrapper">
          <SearchForm onSearch={handleNewSearch} loading={loadingStep} />
        </div>
      </section>

      {/* Top Summary KPI Cards */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-due">
          <span className="kpi-title">TOTAL TAX DUE</span>
          <span className="kpi-value">₹{totals.totalTaxAmount?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Total Assessed Tax</span>
        </div>
        <div className="kpi-card kpi-paid">
          <span className="kpi-title">TOTAL PAID</span>
          <span className="kpi-value">₹{totals.totalPaid?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Remitted Dues</span>
        </div>
        <div className="kpi-card kpi-outstanding">
          <span className="kpi-title">OUTSTANDING</span>
          <span className="kpi-value">₹{totals.totalOutstanding?.toLocaleString("en-IN")}</span>
          <span className="kpi-sub">Balance Dues</span>
        </div>
        <div className="kpi-card kpi-progress">
          <span className="kpi-title">PROGRESS</span>
          <span className="kpi-value">{totals.paymentProgress}%</span>
          <span className="kpi-sub">Overall Completion</span>
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
              <BankIcon size={22} color="#0b3d91" /> Bank-wise Tax Details
            </h3>
            <span className="section-badge font-mono">AUTOMATIC BANK RETRIEVAL</span>
          </div>
          <BankTable banks={bankSummary} />
        </div>
      </section>

      {/* Monthly Tax Details */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <CalendarIcon size={22} color="#0b3d91" /> Monthly Tax Details
            </h3>
            <span className="section-badge font-mono">AUTOMATIC MONTHLY BREAKDOWN</span>
          </div>
          <MonthlyTaxTable months={monthlySummary} />
        </div>
      </section>

      {/* Annual Tax Details */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <CalendarIcon size={22} color="#0b3d91" /> Annual Tax Summary
            </h3>
            <span className="section-badge font-mono">HISTORICAL FINANCIAL YEARS</span>
          </div>
          <AnnualTaxTable years={annualSummary} />
        </div>
      </section>

      {/* Detailed Payment Log */}
      <section className="section-block">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="flex-align">
              <DocumentIcon size={22} color="#0b3d91" /> Detailed Payment Log
            </h3>
            <span className="section-badge font-mono">{payments?.length || 0} RECORDS FETCHED</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th>Month</th>
                  <th>Bank Name</th>
                  <th>Tax Due</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.financialYear}</td>
                    <td>{p.month || "—"}</td>
                    <td>{p.bankName}</td>
                    <td>₹{p.taxDue?.toLocaleString("en-IN")}</td>
                    <td>₹{p.amountPaid?.toLocaleString("en-IN")}</td>
                    <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "—"}</td>
                    <td>
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
              <ChartIcon size={22} color="#0b3d91" /> Tax Progress & Visual Analytics
            </h3>
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
        <AIInsightCard analysis={aiAnalysis} />
      </section>
    </div>
  );
};

export default Dashboard;