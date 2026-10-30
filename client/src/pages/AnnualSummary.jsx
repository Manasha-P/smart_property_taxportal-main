import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnnualTaxTable from "../components/AnnualTaxTable";
import { AnnualTaxChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { ChartIcon } from "../components/Icons";
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
      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/dashboard/${aadhaar}`} className="btn-outline">
          ← Return to Dashboard
        </Link>
      </div>

      <div className="subpage-header-row">
        <div>
          <span className="gov-seal-title flex-align">
            <ChartIcon size={14} color="#0b3d91" />
            HISTORICAL FISCAL LEDGER
          </span>
          <h2>Multi-Year Property Tax Assessment Summary</h2>
          <p className="subpage-sub">
            Year-over-year statutory demand and collection history for Aadhaar <strong>{aadhaar}</strong>.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="section-card" style={{ marginBottom: "2rem" }}>
        <AnnualTaxTable years={years} />
      </div>

      <div className="section-card">
        <h3 className="flex-align" style={{ marginBottom: "1rem", color: "var(--gov-navy-900)" }}>
          <ChartIcon size={20} color="#0b3d91" /> Multi-Year Demand vs Paid Revenue Analytics
        </h3>
        <AnnualTaxChart years={years} />
      </div>
    </div>
  );
};

export default AnnualSummary;
