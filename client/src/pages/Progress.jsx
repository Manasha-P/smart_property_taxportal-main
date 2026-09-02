import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { ProgressPieChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
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
  if (!progress) return <div className="page"><ErrorMessage message={error} /></div>;

  return (
    <div className="page">
      <Link to={`/dashboard/${aadhaar}`} className="back-link">&larr; Back to Dashboard</Link>
      <h2>Annual Tax Payment Progress</h2>

      {error && <ErrorMessage message={error} />}

      <div className="info-card">
        <p>
          ₹{progress.totalPaid.toLocaleString("en-IN")} / ₹{progress.totalDue.toLocaleString("en-IN")} Paid
        </p>
        <ProgressBar percentage={progress.percentage} />

        <div className="status-figures" style={{ marginTop: "1.5rem" }}>
          <div><span className="label">Total Due</span><span className="value">₹{progress.totalDue.toLocaleString("en-IN")}</span></div>
          <div><span className="label">Total Paid</span><span className="value">₹{progress.totalPaid.toLocaleString("en-IN")}</span></div>
          <div><span className="label">Outstanding</span><span className="value">₹{progress.outstanding.toLocaleString("en-IN")}</span></div>
        </div>
      </div>

      <ProgressPieChart progress={progress} />
    </div>
  );
};

export default Progress;