import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page" style={{ textAlign: "center" }}>
    <h2>404 — Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Return Home</Link>
  </div>
);

export default NotFound;