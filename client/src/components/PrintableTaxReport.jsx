import { useState, useEffect } from "react";
import { getTaxReport } from "../services/api";
import { NationalEmblemIcon, QrCodeIcon, StampIcon, ShieldCheckIcon } from "./Icons";
import ErrorMessage from "./ErrorMessage";

const PrintableTaxReport = ({ recordId, onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await getTaxReport(recordId);
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to generate printable tax statement.");
      } finally {
        setLoading(false);
      }
    };
    if (recordId) fetchReport();
  }, [recordId]);

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content text-center" style={{ maxWidth: "500px", padding: "2.5rem" }}>
          <div className="spinner-ring" style={{ margin: "0 auto 1rem" }}></div>
          <p style={{ fontWeight: 600, color: "#0b3d91" }}>
            Compiling Official Form-V Municipal Tax Clearance Statement...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: "500px", padding: "2rem" }}>
          <ErrorMessage message={error || "Could not load report."} />
          <button className="btn-search-primary" style={{ marginTop: "1rem" }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const { documentMeta, taxpayer, financialTotals, annualSummary, complianceSummary } = report;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content printable-report-card gov-official-form-v" onClick={(e) => e.stopPropagation()}>
        {/* Modal Controls Bar */}
        <div className="modal-actions-bar no-print flex-align" style={{ justifyContent: "space-between" }}>
          <div className="flex-align" style={{ gap: "0.5rem" }}>
            <span className="gov-badge-inline">FORM-V STATUTORY CLEARANCE</span>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Official Municipal Certificate</span>
          </div>
          <div className="flex-align" style={{ gap: "0.75rem" }}>
            <button type="button" className="btn-print flex-align" onClick={() => window.print()}>
              <span>🖨️ Print Form-V / Save as PDF</span>
            </button>
            <button type="button" className="btn-close-modal" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Official Sovereign Header */}
        <div className="report-header">
          <div className="report-emblem">
            <NationalEmblemIcon size={52} color="#08214d" />
          </div>
          <div className="report-header-text">
            <h3>GOVERNMENT OF INDIA • DIRECTORATE OF MUNICIPAL REVENUE & TREASURY</h3>
            <h4>FORM-V: OFFICIAL PROPERTY TAX ASSESSMENT & PAYMENT CLEARANCE STATEMENT</h4>
            <p className="report-statutory-sub">
              Issued under Rule 14 of the Municipal Property Tax Assessment & Collection Rules
            </p>
          </div>
          {/* Simulated QR Code for verification */}
          <div className="report-qr-verification-box text-center no-print-flex">
            <div className="qr-box-inner">
              <QrCodeIcon size={46} color="#0b3d91" />
            </div>
            <span className="qr-sub">Scan to Verify Authenticity</span>
          </div>
        </div>

        <div className="report-meta-grid">
          <div>
            <strong>Document Reference No:</strong> <span className="font-mono font-bold">{documentMeta.docReference}</span>
          </div>
          <div>
            <strong>Date & Time of Issuance:</strong> {new Date(documentMeta.generatedAt).toLocaleString("en-IN")}
          </div>
          <div>
            <strong>Assessment Period:</strong> FY {taxpayer.assessmentYear}
          </div>
          <div>
            <strong>Issuing Municipal Circle:</strong> Urban Revenue Division 04
          </div>
        </div>

        <hr className="report-divider" />

        {/* Taxpayer & Property Section */}
        <div className="report-section">
          <h4 className="report-section-title">1. REGISTERED PROPERTY & CADASTRE PARTICULARS</h4>
          <table className="report-table-compact">
            <tbody>
              <tr>
                <td style={{ width: "25%" }}><strong>Taxpayer Name:</strong></td>
                <td style={{ width: "25%" }}><strong>{taxpayer.name}</strong></td>
                <td style={{ width: "25%" }}><strong>Masked Aadhaar UID:</strong></td>
                <td style={{ width: "25%" }} className="font-mono">{taxpayer.aadhaarMasked} ({taxpayer.aadhaarDemoId})</td>
              </tr>
              <tr>
                <td><strong>Cadastre Property ID:</strong></td>
                <td className="font-mono font-bold" style={{ color: "#0b3d91" }}>{taxpayer.propertyId}</td>
                <td><strong>Property Category:</strong></td>
                <td>{taxpayer.propertyType} ({taxpayer.propertyUsage})</td>
              </tr>
              <tr>
                <td><strong>Registered Physical Address:</strong></td>
                <td colSpan={3}>{taxpayer.propertyAddress}</td>
              </tr>
              <tr>
                <td><strong>Built-Up Carpet Area:</strong></td>
                <td>{taxpayer.propertyAreaSqFt} sq. ft</td>
                <td><strong>Assessed Capital Value:</strong></td>
                <td className="font-mono">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Assessment & Clearance Section */}
        <div className="report-section">
          <h4 className="report-section-title">2. MUNICIPAL DEMAND, COLLECTION & BALANCE (DCB) CLEARANCE</h4>
          <div className="report-kpi-row">
            <div className="report-kpi-cell">
              <span className="label">TOTAL ASSESSED DEMAND</span>
              <span className="val font-mono">₹{financialTotals.totalTaxAmount?.toLocaleString("en-IN")}</span>
            </div>
            <div className="report-kpi-cell">
              <span className="label">INTER-BANK REMITTANCE</span>
              <span className="val font-mono" style={{ color: "#065f46" }}>
                ₹{financialTotals.totalPaid?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="report-kpi-cell">
              <span className="label">NET OUTSTANDING DUE</span>
              <span className="val font-mono" style={{ color: financialTotals.totalOutstanding > 0 ? "#b91c1c" : "#059669" }}>
                ₹{financialTotals.totalOutstanding?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="report-kpi-cell">
              <span className="label">SETTLEMENT RECOVERY</span>
              <span className="val font-mono">{financialTotals.paymentProgress}%</span>
            </div>
          </div>

          <div className="clearance-standing-row flex-align" style={{ marginTop: "1rem", justifyContent: "space-between" }}>
            <div>
              <strong>Official Tax Assessment Standing: </strong>
              <span className={`status-pill status-${financialTotals.overallStatus?.replace(/\s+/g, "-").toLowerCase()}`} style={{ display: "inline-block", marginLeft: "0.5rem" }}>
                {financialTotals.overallStatus}
              </span>
            </div>
            <span className="flex-align" style={{ fontSize: "0.82rem", color: "#065f46" }}>
              <ShieldCheckIcon size={16} color="#065f46" /> Reconciled with Core Banking Clearing Node
            </span>
          </div>
        </div>

        {/* Annual Breakdown */}
        {annualSummary && annualSummary.length > 0 && (
          <div className="report-section">
            <h4 className="report-section-title">3. ANNUAL ASSESSMENT HISTORY LEDGER</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th style={{ textAlign: "right" }}>Tax Assessed</th>
                  <th style={{ textAlign: "right" }}>Amount Remitted</th>
                  <th style={{ textAlign: "right" }}>Balance Outstanding</th>
                  <th style={{ textAlign: "center" }}>Settlement Status</th>
                </tr>
              </thead>
              <tbody>
                {annualSummary.map((y) => (
                  <tr key={y.financialYear}>
                    <td className="font-semibold">{y.financialYear}</td>
                    <td style={{ textAlign: "right" }} className="font-mono">₹{y.taxDue?.toLocaleString("en-IN")}</td>
                    <td style={{ textAlign: "right" }} className="font-mono" style={{ color: "#065f46" }}>₹{y.taxPaid?.toLocaleString("en-IN")}</td>
                    <td style={{ textAlign: "right" }} className="font-mono" style={{ color: y.outstanding > 0 ? "#b91c1c" : "#065f46" }}>
                      ₹{y.outstanding?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill status-${y.status?.replace(/\s+/g, "-").toLowerCase()}`}>
                        {y.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Statutory Compliance & Survey Recommendations */}
        <div className="report-section">
          <h4 className="report-section-title">4. STATUTORY SCRUTINY & REVENUE ADVISORY</h4>
          <p style={{ fontSize: "0.88rem", marginBottom: "0.4rem" }}>
            <strong>Assigned Compliance Rating:</strong> <span className="font-bold">{complianceSummary.complianceLevel} Risk</span>
          </p>
          <p style={{ fontSize: "0.84rem", color: "#334155", marginBottom: "0.6rem" }}>
            {complianceSummary.statusText}
          </p>
          <p style={{ fontSize: "0.84rem", color: "#065f46", background: "#f0fdf4", padding: "0.6rem", borderRadius: "4px", border: "1px solid #bbf7d0" }}>
            <strong>Municipal Directive:</strong> {complianceSummary.recommendation}
          </p>
        </div>

        {/* Footer Authorization Block with Stamp & Signature */}
        <div className="report-footer-sign">
          <div className="footer-sign-left">
            <div className="report-official-seal flex-align">
              <StampIcon size={24} color="#0b3d91" />
              <span>OFFICIAL SEAL OF MUNICIPAL REVENUE TREASURY</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem" }}>
              Digitally generated and authenticated via Central Urban Local Body Node. Valid without physical ink signature under Information Technology Act, 2000.
            </p>
          </div>
          <div className="footer-sign-right" style={{ textAlign: "right" }}>
            <div className="sign-signature-box">
              <span className="sign-seal-text">DIGITALLY SIGNED</span>
            </div>
            <p style={{ borderTop: "1.5px solid #0b3d91", paddingTop: "0.3rem", fontSize: "0.82rem", fontWeight: 700 }}>
              Authorized Revenue Officer / Commissioner
            </p>
            <p style={{ fontSize: "0.74rem", color: "#64748b" }}>
              Municipal Property Taxation Directorate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableTaxReport;
