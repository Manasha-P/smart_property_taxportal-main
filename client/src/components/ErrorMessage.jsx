import { AlertIcon } from "./Icons";

const ErrorMessage = ({ message }) => (
  <div
    className="gov-field-error flex-align"
    style={{
      margin: "1rem 0",
      padding: "0.85rem 1.25rem",
      background: "#fef2f2",
      border: "1.5px solid #fecaca",
      borderLeft: "5px solid #b91c1c",
      color: "#991b1b",
      borderRadius: "var(--radius-xs)",
      fontSize: "0.88rem",
    }}
  >
    <AlertIcon size={20} color="#b91c1c" />
    <div>
      <strong style={{ display: "block", marginBottom: "0.15rem" }}>Official System Notice:</strong>
      <span>{message}</span>
    </div>
  </div>
);

export default ErrorMessage;
