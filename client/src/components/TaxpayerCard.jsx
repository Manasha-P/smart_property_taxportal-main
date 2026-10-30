import { BuildingGovIcon } from "./Icons";

const TaxpayerCard = ({ taxpayer }) => {
  if (!taxpayer) return null;

  return (
    <div className="info-card gov-formal-card">
      <div className="card-header-styled">
        <h3 className="flex-align">
          <BuildingGovIcon size={22} color="#0b3d91" /> Taxpayer Profile & Registered Property Cadastre
        </h3>
        <span className="section-badge font-mono">CADASTRE REF: {taxpayer.propertyId}</span>
      </div>
      <div className="info-grid">
        <div className="info-cell">
          <span className="label">Registered Citizen Name</span>
          <span className="value font-semibold">{taxpayer.name}</span>
        </div>
        <div className="info-cell">
          <span className="label">Aadhaar Identifier</span>
          <span className="value font-mono">{taxpayer.aadhaarDemoId || taxpayer.aadhaarMasked}</span>
        </div>
        <div className="info-cell">
          <span className="label">Cadastre Property ID</span>
          <span className="value font-mono font-bold" style={{ color: "#0b3d91" }}>
            {taxpayer.propertyId}
          </span>
        </div>
        <div className="info-cell">
          <span className="label">Property Category</span>
          <span className="value">{taxpayer.propertyType} Property</span>
        </div>
        <div className="info-cell full-width">
          <span className="label">Registered Physical Address</span>
          <span className="value">{taxpayer.propertyAddress}</span>
        </div>
        <div className="info-cell">
          <span className="label">Assessed Capital Valuation</span>
          <span className="value font-mono font-semibold">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default TaxpayerCard;
