import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EmblemIcon, UserIcon, MailIcon, LockIcon } from "../components/Icons";

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
      <div className="auth-card-box">
        <div className="auth-card-header">
          <div className="auth-seal-icon">
            <EmblemIcon size={32} color="#0b3d91" />
          </div>
          <h2>Citizen Account Registration</h2>
          <p className="auth-subtitle">Smart Property Tax Information Portal</p>
        </div>

        {error && (
          <div className="auth-error-box">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form className="auth-form-styled" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name (As per Aadhaar)</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <UserIcon size={18} color="#64748b" />
              </span>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Arun Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <MailIcon size={18} color="#64748b" />
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="e.g. citizen@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Create Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <LockIcon size={18} color="#64748b" />
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

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Complete Registration →"}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>
            Already registered? <Link to="/login">Sign In Here</Link>
          </p>
          <span className="security-notice">🔒 Official Digital Service Portal</span>
        </div>
      </div>
    </div>
  );
};

export default Register;