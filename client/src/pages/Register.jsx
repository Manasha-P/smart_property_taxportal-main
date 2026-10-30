import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NationalEmblemIcon, UserIcon, MailIcon, LockIcon, ShieldCheckIcon } from "../components/Icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/portal");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-web-container">
      <div className="auth-card-box gov-auth-box">
        <div className="auth-card-header">
          <div className="auth-seal-icon">
            <NationalEmblemIcon size={46} color="#d4af37" />
          </div>
          <span className="gov-badge-inline" style={{ marginTop: "0.5rem" }}>
            CITIZEN DIGITAL TAXATION PORTAL
          </span>
          <h2>Citizen Account Registration</h2>
          <p className="auth-subtitle">
            Create an authorized taxpayer account for property tracking and e-challan services
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="auth-form-styled" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Citizen Name (As per Aadhaar)</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <UserIcon size={18} color="#0b3d91" />
              </span>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Official Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <MailIcon size={18} color="#0b3d91" />
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Create Access Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <LockIcon size={18} color="#0b3d91" />
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth-submit flex-center" disabled={loading}>
            <ShieldCheckIcon size={18} color="#ffffff" />
            <span>{loading ? "Registering Citizen..." : "Complete Registration →"}</span>
          </button>
        </form>

        <div className="auth-footer-links">
          <p style={{ fontSize: "0.86rem", color: "#475569" }}>
            Already have an officer account? <Link to="/login" style={{ color: "#0b3d91", fontWeight: 700 }}>Officer Sign In</Link>
          </p>
          <span className="security-notice">
            Protected with 256-Bit SSL Financial Encryption and DigiLocker Integration.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
