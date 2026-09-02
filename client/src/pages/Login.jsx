import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EmblemIcon, MailIcon, LockIcon } from "../components/Icons";

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
      <div className="auth-card-box">
        <div className="auth-card-header">
          <div className="auth-seal-icon">
            <EmblemIcon size={36} color="#0b3d91" />
          </div>
          <h2>Municipal Officer Sign In</h2>
          <p className="auth-subtitle">Restricted Access — Officer Administration Portal</p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="auth-form-styled" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Officer Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <MailIcon size={18} color="#64748b" />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="Enter officer email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Officer Access Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <LockIcon size={18} color="#64748b" />
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Authenticating Officer..." : "Sign In to Officer Portal →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;