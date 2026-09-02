import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BankTable from "../components/BankTable";
import { BankPaymentChart } from "../components/Charts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
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
      <Link to={`/dashboard/${aadhaar}`} className="back-link">&larr; Back to Dashboard</Link>
      <h2>Bank-wise Tax Details</h2>
      <p className="disclaimer-note">
        Note: These are simulated bank records for this academic prototype, not live bank data.
      </p>

      {error && <ErrorMessage message={error} />}

      <div className="info-card">
        <BankTable banks={banks} />
      </div>

      <BankPaymentChart banks={banks} />
    </div>
  );
};

export default BankDetails;