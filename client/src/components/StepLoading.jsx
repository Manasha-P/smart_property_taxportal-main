import { useEffect, useState } from "react";

const STEPS = [
  "Verifying taxpayer record...",
  "Retrieving property information...",
  "Collecting payment records...",
  "Calculating tax information...",
  "AI is analyzing payment compliance...",
  "Tax profile generated successfully.",
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
    }, 450); // step interval for realistic loading animation

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="step-loading-container">
      <div className="step-loading-card">
        <div className="spinner-ring"></div>
        <h3>Automated Tax Processing</h3>
        <p className="step-subtitle">Executing intelligent data retrieval & AI analysis pipeline</p>

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
                <div className="step-text">{stepText}</div>
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
