import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnnualTaxTable from "../components/AnnualTaxTable";
import { AnnualTaxChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getAnnualSummary } from "../services/api";

const AnnualSummary = () => {
  const { aadhaar } = useParams();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAnnualSummary(aadhaar);
        setYears(data.years || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load annual summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aadhaar]);

  if (loading) return <Loading />;

  return (
    <div className="page">
      <Link to={`/dashboard/${aadhaar}`} className="back-link">&larr; Back to Dashboard</Link>
      <h2>Annual Tax Summary</h2>

      {error && <ErrorMessage message={error} />}

      <div className="info-card">
        <AnnualTaxTable years={years} />
      </div>

      <AnnualTaxChart years={years} />
    </div>
  );
};

export default AnnualSummary;