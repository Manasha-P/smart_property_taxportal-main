import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTaxOverview, getCompliance } from "../services/api";
import { saveToSearchHistory } from "../components/SearchHistory";
import {
  NationalEmblemIcon,
  CheckIcon,
  ShieldCheckIcon,
  StampIcon,
} from "../components/Icons";
import ErrorMessage from "../components/ErrorMessage";

const STATUTORY_STAGES = [
  "Querying Central Land Cadastre & Urban Registry (NIC)...",
  "Validating Citizen UID via Masked Identity Vault (UIDAI)...",
  "Auditing Municipal Demand, Collection & Balance (DCB) Register...",
  "Consolidating Inter-Bank CBS Electronic Remittances (SBI, IB, BoI)...",
  "Computing Statutory Property Tax, Municipal Cess & Incentive Rebates...",
  "Evaluating Statutory Compliance Scrutiny under Municipal Code Sec 120...",
  "Compiling Official Assessment Dossier & Verification Clearance...",
];

const AnalysisPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [, setLoading] = useState(true);
  const [taxData, setTaxData] = useState(null);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let stepTimer = null;

    const runAnalysisPipeline = async () => {
      setError("");
      setLoading(true);
      setCurrentStep(0);
      setIsReady(false);

      // Animate progress through official statutory pipeline
      stepTimer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STATUTORY_STAGES.length - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 420);

      try {
        // Step 1-5: Fetch Overview & Calculations
        const overviewRes = await getTaxOverview(recordId);
        if (!isMounted) return;
        setTaxData(overviewRes.data);

        // Save to session search history
        saveToSearchHistory(recordId, overviewRes.data?.taxpayer?.name);

        // Step 6: Fetch/Generate AI Compliance Insights
        await getCompliance(recordId);
        if (!isMounted) return;

        clearInterval(stepTimer);
        setCurrentStep(STATUTORY_STAGES.length - 1);
        setIsReady(true);
        setLoading(false);
      } catch (err) {
        clearInterval(stepTimer);
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to verify taxpayer record. Please check the identifier.");
        setLoading(false);
      }
    };

    if (recordId) {
      runAnalysisPipeline();
    }

    return () => {
      isMounted = false;
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [recordId]);

  const handleProceed = () => {
    navigate(`/tax-overview/${recordId}`);
  };

  return (
    <div className="page analysis-pipeline-page">
      <div className="analysis-card-container gov-dossier-card">
        {/* Official Header */}
        <div className="analysis-header text-center">
          <div className="gov-seal-emblem-badge" style={{ margin: "0 auto 1rem" }}>
            <NationalEmblemIcon size={36} color="#d4af37" />
          </div>
          <span className="gov-seal-title" style={{ color: "#0b3d91" }}>
            STATUTORY VERIFICATION & INTER-BANK CLEARING
          </span>
          <h2>Municipal Property Assessment Pipeline</h2>
          <p className="analysis-sub">
            Querying land cadastre archives, reconciling partner bank remittances, and compiling official tax dossier for:
          </p>
          <div className="record-badge-row flex-center">
            <span className="analysis-record-badge font-mono">{recordId}</span>
          </div>
        </div>

        {error && (
          <div style={{ margin: "1.5rem 0" }}>
            <ErrorMessage message={error} />
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to="/portal" className="btn-search-primary">
                ← Return to Assessment Search
              </Link>
            </div>
          </div>
        )}

        {!error && (
          <>
            {/* Progress Meter */}
            <div className="pipeline-progress-track">
              <div
                className="pipeline-progress-fill"
                style={{
                  width: `${((currentStep + 1) / STATUTORY_STAGES.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Stages List */}
            <div className="stages-list">
              {STATUTORY_STAGES.map((stage, idx) => {
                const isComplete = idx < currentStep || isReady;
                const isActive = idx === currentStep && !isReady;
                return (
                  <div
                    key={idx}
                    className={`stage-row ${
                      isComplete ? "stage-complete" : isActive ? "stage-active" : "stage-pending"
                    }`}
                  >
                    <div className="stage-marker">
                      {isComplete ? (
                        <CheckIcon size={14} color="#ffffff" />
                      ) : isActive ? (
                        <div className="spinner-micro"></div>
                      ) : (
                        <div className="stage-dot"></div>
                      )}
                    </div>
                    <span className="stage-text font-medium">{stage}</span>
                    {isComplete && <span className="stage-badge-ok">VERIFIED</span>}
                  </div>
                );
              })}
            </div>

            {/* Once Ready: Verified Assessment Clearance Stamp */}
            {isReady && taxData && (
              <div className="analysis-ready-banner gov-verification-box">
                <div className="gov-stamp-badge flex-center">
                  <StampIcon size={28} color="#065f46" />
                </div>
                <div className="ready-text">
                  <span className="clearance-tag">STATUTORY CLEARANCE CONFIRMED</span>
                  <h4>Official Assessment Dossier Compiled</h4>
                  <p>
                    Land cadastre deed, multi-bank payment remittances, and DCB schedules for <strong>{taxData.taxpayer?.name}</strong> have been successfully authenticated.
                  </p>
                  <div className="quick-preview-pill-grid">
                    <div className="preview-item">
                      <span className="lbl">Property ID</span>
                      <strong className="font-mono">{taxData.taxpayer?.propertyId}</strong>
                    </div>
                    <div className="preview-item">
                      <span className="lbl">Assessed Tax</span>
                      <strong className="font-mono">₹{taxData.totals?.totalTaxAmount?.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="preview-item">
                      <span className="lbl">Net Outstanding</span>
                      <strong className="font-mono">₹{taxData.totals?.totalOutstanding?.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="preview-item">
                      <span className="lbl">Settlement Status</span>
                      <strong style={{ color: taxData.totals?.totalOutstanding === 0 ? "#059669" : "#b45309" }}>
                        {taxData.totals?.overallStatus}
                      </strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProceed}
                  className="btn-search-primary flex-center"
                  style={{ width: "100%", padding: "1rem", fontSize: "1.05rem", marginTop: "1.25rem" }}
                >
                  <ShieldCheckIcon size={20} color="#ffffff" />
                  <span>Open Official Property Tax Dossier →</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
