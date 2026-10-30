import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AIInsightCard from "../components/AIInsightCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { ScaleIcon } from "../components/Icons";
import { getAIAnalysis } from "../services/api";

const AIAnalysisPage = () => {
  const { aadhaar } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAIAnalysis(aadhaar);
        setAnalysis(data);
      } catch (err) {
        setError(err.response?.data?.message || "Compliance scrutiny is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aadhaar]);

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
            <ScaleIcon size={14} color="#7c3aed" />
            STATUTORY SCRUTINY
          </span>
          <h2>Statutory Compliance Risk Evaluation</h2>
          <p className="subpage-sub">
            Compliance risk assessment and municipal survey directives for citizen Aadhaar <strong>{aadhaar}</strong>.
          </p>
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {analysis && <AIInsightCard analysis={analysis} />}
    </div>
  );
};

export default AIAnalysisPage;
