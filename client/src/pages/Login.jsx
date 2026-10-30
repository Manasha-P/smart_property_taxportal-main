import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  NationalEmblemIcon,
  MailIcon,
  LockIcon,
  ShieldCheckIcon,
  ScaleIcon,
} from "../components/Icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please verify your officer credentials.");
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
            MUNICIPAL REVENUE DIRECTORY SSO
          </span>
          <h2>Revenue Officer & Treasury Sign In</h2>
          <p className="auth-subtitle">
            Secure Jan Parichay Gateway for Urban Local Body Officials & Treasury Auditors
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="auth-form-styled" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Municipal Officer ID / Official Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <MailIcon size={18} color="#0b3d91" />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="officer.revenue@propertytax.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Treasury Access Password / Passcode</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <LockIcon size={18} color="#0b3d91" />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter authorized password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            <span>{loading ? "Authenticating Officer..." : "Sign In to Officer Portal →"}</span>
          </button>
        </form>

        <div className="auth-footer-links">
          <div className="flex-align" style={{ justifyContent: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.8rem" }}>
            <ScaleIcon size={14} color="#64748b" />
            <span>Protected under Section 66 of Information Technology Act, 2000</span>
          </div>
          <span className="security-notice">
            All administrative logins and municipal ledger queries are timestamped and logged with IPv6/IPv4 audit trails.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
