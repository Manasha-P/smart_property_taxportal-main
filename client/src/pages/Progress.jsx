import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { ProgressPieChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { ChartIcon } from "../components/Icons";
import { getProgress } from "../services/api";

const Progress = () => {
  const { aadhaar } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getProgress(aadhaar);
        setProgress(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payment progress.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aadhaar]);

  if (loading) return <Loading />;
  if (!progress) {
    return (
      <div className="page">
        <ErrorMessage message={error || "Could not load progress"} />
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/dashboard/${aadhaar}`} className="btn-outline">
          ← Return to Dashboard
        </Link>
      </div>

      <div className="subpage-header-row">
        <div>
          <span className="gov-seal-title flex-align">
            <ChartIcon size={14} color="#0b3d91" />
            COLLECTION RECOVERY METER
          </span>
          <h2>Annual Tax Settlement & Recovery Rate</h2>
          <p className="subpage-sub">
            Verified electronic recovery ratio for citizen Aadhaar <strong>{aadhaar}</strong>.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="section-card" style={{ marginBottom: "2rem" }}>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--gov-navy-900)" }}>
          ₹{progress.totalPaid.toLocaleString("en-IN")} / ₹{progress.totalDue.toLocaleString("en-IN")} Cleared
        </p>
        <ProgressBar percentage={progress.percentage} />

        <div className="kpi-grid" style={{ marginTop: "1.5rem" }}>
          <div className="kpi-card kpi-due">
            <span className="kpi-title">TOTAL STATUTORY DUE</span>
            <span className="kpi-value font-mono">₹{progress.totalDue.toLocaleString("en-IN")}</span>
          </div>
          <div className="kpi-card kpi-paid">
            <span className="kpi-title">TOTAL CLEARED</span>
            <span className="kpi-value font-mono text-success">₹{progress.totalPaid.toLocaleString("en-IN")}</span>
          </div>
          <div className="kpi-card kpi-outstanding">
            <span className="kpi-title">NET OUTSTANDING</span>
            <span className="kpi-value font-mono text-danger">₹{progress.outstanding.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="flex-align" style={{ marginBottom: "1rem", color: "var(--gov-navy-900)" }}>
          <ChartIcon size={20} color="#0b3d91" /> Settlement Proportion Visual Breakdown
        </h3>
        <ProgressPieChart progress={progress} />
      </div>
    </div>
  );
};

export default Progress;
