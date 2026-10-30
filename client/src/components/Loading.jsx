import { NationalEmblemIcon } from "./Icons";

const Loading = ({ message = "Querying Municipal Cadastre & Inter-Bank Clearing Node..." }) => (
  <div className="page flex-center" style={{ minHeight: "380px", flexDirection: "column" }}>
    <div style={{ marginBottom: "0.5rem" }}>
      <NationalEmblemIcon size={38} color="#d4af37" />
    </div>
    <div className="spinner-ring" style={{ marginBottom: "1rem" }}></div>
    <p style={{ color: "var(--gov-navy-900)", fontWeight: 700, fontSize: "0.95rem" }}>
      {message}
    </p>
    <span style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "0.25rem" }}>
      Official Government of India Digital Portal Infrastructure
    </span>
  </div>
);

export default Loading;
