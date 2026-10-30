import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BankTable from "../components/BankTable";
import { BankPaymentChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { BankIcon } from "../components/Icons";
import { getBankDetails } from "../services/api";

const BankDetails = () => {
  const { aadhaar } = useParams();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getBankDetails(aadhaar);
        setBanks(data.banks || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bank details.");
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
            <BankIcon size={14} color="#065f46" />
            CORE BANKING CLEARANCE
          </span>
          <h2>Inter-Bank Remittance & Settlement Summary</h2>
          <p className="subpage-sub">
            Electronic payment logs and settlement status across integrated partner banks for Aadhaar <strong>{aadhaar}</strong>.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="section-card" style={{ marginBottom: "2rem" }}>
        <BankTable banks={banks} />
      </div>

      <div className="section-card">
        <h3 className="flex-align" style={{ marginBottom: "1rem", color: "var(--gov-navy-900)" }}>
          <BankIcon size={20} color="#0b3d91" /> Bank Remittance Volume Visual Analytics
        </h3>
        <BankPaymentChart banks={banks} />
      </div>
    </div>
  );
};

export default BankDetails;
