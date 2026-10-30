import { useEffect, useState } from "react";
import { NationalEmblemIcon } from "./Icons";

const STEPS = [
  "Validating citizen identity via masked Aadhaar vault...",
  "Querying central municipal GIS land cadastre...",
  "Consolidating inter-bank CBS electronic payment logs...",
  "Computing statutory Demand-Collection-Balance (DCB) ledger...",
  "Performing statutory compliance scrutiny under Municipal Code Sec 120...",
  "Official property tax assessment dossier authenticated.",
];

const StepLoading = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="step-loading-container">
      <div className="step-loading-card gov-dossier-card" style={{ maxWidth: "580px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <NationalEmblemIcon size={42} color="#d4af37" />
        </div>
        <div className="spinner-ring"></div>
        <h3 style={{ color: "var(--gov-navy-900)", fontWeight: 800 }}>
          Statutory Verification & Treasury Clearing
        </h3>
        <p className="step-subtitle">
          Executing official cadastre registry query and inter-bank reconciliation pipeline
        </p>

        <div className="step-list">
          {STEPS.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`step-item ${isDone ? "step-done" : ""} ${isCurrent ? "step-active" : ""}`}
              >
                <div className="step-icon">{isDone ? "✓" : isCurrent ? "⏳" : "○"}</div>
                <div className="step-text font-medium">{stepText}</div>
              </div>
            );
          })}
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.round(((currentStep + 1) / STEPS.length) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepLoading;
