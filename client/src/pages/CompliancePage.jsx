import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompliance, refreshCompliance } from "../services/api";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  ScaleIcon,
  LightbulbIcon,
  CheckIcon,
  BuildingGovIcon,
  StampIcon,
  ShieldCheckIcon,
} from "../components/Icons";

const CompliancePage = () => {
  const { recordId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCompliance = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCompliance(recordId);
        if (isMounted) setAnalysis(res.data);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load compliance audit report.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (recordId) {
      fetchCompliance();
    }

    return () => {
      isMounted = false;
    };
  }, [recordId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshSuccess(false);
    setError("");
    try {
      const res = await refreshCompliance(recordId);
      setAnalysis(res.data);
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to refresh compliance audit.");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !analysis) {
    return (
      <div className="page">
        <Breadcrumbs items={[{ label: "Overview", to: `/tax-overview/${recordId}` }, { label: "Compliance Scrutiny" }]} />
        <ErrorMessage message={error} />
        <Link to={`/tax-overview/${recordId}`} className="btn-search-primary" style={{ marginTop: "1rem" }}>
          ← Back to Tax Overview
        </Link>
      </div>
    );
  }

  const level = (analysis?.complianceLevel || "MEDIUM").toUpperCase();
  const levelClass = `ai-level-${level.toLowerCase()}`;

  return (
    <div className="page analysis-subpage">
      <Breadcrumbs
        items={[
          { label: `Dossier (${recordId})`, to: `/tax-overview/${recordId}` },
          { label: "Statutory Scrutiny & Survey Advisory" },
        ]}
      />

      {/* Official Government Scrutiny Masthead */}
      <div className="subpage-header-row">
        <div>
          <div className="flex-align" style={{ gap: "0.5rem", marginBottom: "0.2rem" }}>
            <span className="gov-seal-title flex-align">
              <ScaleIcon size={14} color="#7c3aed" />
              STATUTORY REVENUE SCRUTINY CELL
            </span>
            <span className="section-badge font-mono">MUNICIPAL CODE SEC 120</span>
          </div>
          <h2>Taxpayer Statutory Compliance & Survey Advisory</h2>
          <p className="subpage-sub">
            Algorithmic compliance audit, payment consistency evaluation, and municipal field survey directives for <strong>{recordId}</strong>.
          </p>
        </div>

        <div className="subpage-actions-row">
          <button type="button" className="btn-outline flex-align" onClick={handleRefresh} disabled={refreshing}>
            <ScaleIcon size={16} color="#0b3d91" />
            <span>{refreshing ? "Re-Auditing..." : "Re-Run Statutory Audit"}</span>
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

      {refreshSuccess && (
        <div className="alert-item alert-success" style={{ marginBottom: "1.2rem", padding: "0.8rem 1.2rem", borderRadius: "6px", background: "#f0fdf4", border: "1px solid #10b981", color: "#166534" }}>
          ✓ Statutory compliance profile and municipal field survey directives successfully re-evaluated!
        </div>
      )}

      {analysis && (
        <>
          {/* Main Scrutiny Dossier Card */}
          <div className="section-block">
            <div className="ai-card gov-formal-card">
              <div className="ai-card-header">
                <div className="ai-title-block">
                  <h3 className="flex-align">
                    <BuildingGovIcon size={24} color="#0b3d91" />
                    Statutory Compliance Risk Evaluation
                  </h3>
                  <p className="ai-subtitle">
                    Department of Municipal Revenue — Automated Risk Categorization Protocol
                  </p>
                </div>
                <span className={`ai-level-badge ${levelClass}`}>
                  Compliance Rating: {level} RISK
                </span>
              </div>

              <div className="ai-card-body">
                {analysis.currentStatusText && (
                  <div className="ai-field highlight-box">
                    <span className="label font-bold">Current Statutory Assessment Standing</span>
                    <p style={{ marginTop: "0.2rem" }}>{analysis.currentStatusText}</p>
                  </div>
                )}

                <div className="info-grid" style={{ margin: "1rem 0" }}>
                  <div className="info-cell">
                    <span className="label">Observed Payment Pattern</span>
                    <span className="value font-semibold">{analysis.paymentPattern || "Consistent Instalments"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Remittance Consistency</span>
                    <span className="value">{analysis.paymentConsistency || "Normal Frequency"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Outstanding Arrears Trend</span>
                    <span className="value font-mono">{analysis.outstandingTrend || "Stable Balance"}</span>
                  </div>
                  <div className="info-cell">
                    <span className="label">Multi-Year Historical Compliance</span>
                    <span className="value">{analysis.historicalCompliance || "Satisfactory"}</span>
                  </div>
                </div>

                <div className="ai-recommendation-box gov-statutory-directive">
                  <span className="rec-title flex-align">
                    <LightbulbIcon size={18} color="#065f46" />
                    Official Municipal Directive
                  </span>
                  <p>{analysis.recommendation}</p>
                </div>
              </div>

              <div className="ai-card-footer flex-align" style={{ justifyContent: "space-between" }}>
                <span className="ai-source flex-align">
                  <ShieldCheckIcon size={14} color="#059669" />
                  Audit Engine: {analysis.source === "ai-api" ? "Automated Intelligence Risk Model" : "Rule-Based Statutory Taxation Matrix"}
                </span>
                <span className="font-mono" style={{ fontSize: "0.78rem" }}>
                  CADASTRE SCRUTINY ID: SCR-{recordId}-2026
                </span>
              </div>
            </div>
          </div>

          {/* Municipal Survey & Field Action Directives */}
          {analysis.surveyRecommendations && analysis.surveyRecommendations.length > 0 && (
            <div className="section-block">
              <div className="section-card-header" style={{ marginBottom: "1rem" }}>
                <div>
                  <h3 className="flex-align">
                    <StampIcon size={20} color="#0b3d91" />
                    Municipal Revenue Field Survey & Inspection Orders ({analysis.surveyRecommendations.length})
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.86rem", marginTop: "0.2rem" }}>
                    Formal on-ground verification directives issued to Zonal Revenue Inspectors based on cadastre data consistency.
                  </p>
                </div>
              </div>

              <div className="survey-cards-list">
                {analysis.surveyRecommendations.map((survey, sIdx) => {
                  const prioClass = `priority-${survey.priority?.toLowerCase() || "medium"}`;
                  return (
                    <div key={sIdx} className={`survey-action-card gov-survey-order ${prioClass}`}>
                      <div className="survey-card-header-bar">
                        <div className="survey-badge-block">
                          <span className="survey-type-badge">{survey.surveyType || "FIELD AUDIT"}</span>
                          <span className={`survey-priority-badge badge-${survey.priority?.toLowerCase() || "medium"}`}>
                            {survey.priority || "MEDIUM"} PRIORITY
                          </span>
                        </div>
                        <span className="survey-due-tag font-mono">
                          Target Completion: {survey.suggestedTimeline || "Within 30 Days"}
                        </span>
                      </div>

                      <h4 className="survey-title">{survey.title}</h4>
                      <p style={{ color: "#334155", fontSize: "0.9rem", marginBottom: "0.75rem", lineHeight: 1.55 }}>
                        {survey.description}
                      </p>

                      <div className="survey-grid">
                        <div className="survey-cell">
                          <span className="survey-label">Inspection Target</span>
                          <p>{survey.targetDepartment || "Zonal Municipal Inspection Team"}</p>
                        </div>
                        <div className="survey-cell">
                          <span className="survey-label">Statutory Provision</span>
                          <p className="font-mono">{survey.statutoryCode || "Section 120(1) Urban Local Bodies Act"}</p>
                        </div>
                        <div className="survey-cell">
                          <span className="survey-label">Expected Resolution</span>
                          <p>{survey.expectedOutcome || "Reassessment and Cadastre Ledger Update"}</p>
                        </div>
                      </div>

                      <div className="survey-action-step flex-align">
                        <CheckIcon size={16} color="#065f46" />
                        <div>
                          <strong>Field Officer Directive:</strong> {survey.actionableStep}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompliancePage;
