import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AIInsightCard from "../components/AIInsightCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
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
        setError(err.response?.data?.message || "AI analysis is temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aadhaar]);

  return (
    <div className="page">
      <Link to={`/dashboard/${aadhaar}`} className="back-link">&larr; Back to Dashboard</Link>
      <h2>AI Tax Analysis</h2>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {analysis && <AIInsightCard analysis={analysis} />}
    </div>
  );
};

export default AIAnalysisPage;