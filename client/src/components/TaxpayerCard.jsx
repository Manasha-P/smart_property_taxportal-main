import { EmblemIcon } from "./Icons";

const TaxpayerCard = ({ taxpayer }) => {
  if (!taxpayer) return null;

  return (
    <div className="info-card">
      <div className="card-header-styled">
        <h3 className="flex-align">
          <EmblemIcon size={22} color="#0b3d91" /> Taxpayer & Property Information
        </h3>
      </div>
      <div className="info-grid">
        <div className="info-cell">
          <span className="label">Taxpayer Name</span>
          <span className="value font-semibold">{taxpayer.name}</span>
        </div>
        <div className="info-cell">
          <span className="label">Aadhaar Identifier</span>
          <span className="value font-mono">{taxpayer.aadhaarDemoId || taxpayer.aadhaarMasked}</span>
        </div>
        <div className="info-cell">
          <span className="label">Property ID</span>
          <span className="value font-mono">{taxpayer.propertyId}</span>
        </div>
        <div className="info-cell">
          <span className="label">Property Category</span>
          <span className="value">{taxpayer.propertyType} Property</span>
        </div>
        <div className="info-cell full-width">
          <span className="label">Property Address</span>
          <span className="value">{taxpayer.propertyAddress}</span>
        </div>
        <div className="info-cell">
          <span className="label">Assessed Property Value</span>
          <span className="value font-semibold">₹{taxpayer.propertyValue?.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default TaxpayerCard;