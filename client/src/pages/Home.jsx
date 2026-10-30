import { Link } from "react-router-dom";
import {
  NationalEmblemIcon,
  SearchIcon,
  IdCardIcon,
  BankIcon,
  CalendarIcon,
  ShieldCheckIcon,
  BuildingGovIcon,
  ScaleIcon,
  ReceiptIcon,
  CheckIcon,
  PhoneIcon,
  MailIcon,
} from "../components/Icons";

const Home = () => {
  return (
    <div className="gov-home-container">
      {/* Imposing Government & Banking Hero Banner */}
      <section className="gov-hero-masthead">
        <div className="gov-hero-inner">
          <div className="gov-hero-main-col">
            <div className="gov-badge-emblem-row flex-align">
              <NationalEmblemIcon size={26} color="#d4af37" />
              <span className="gov-official-tag">DIRECTORATE OF MUNICIPAL REVENUE & URBAN ADMINISTRATION • GOVT. OF INDIA</span>
            </div>

            <h1 className="gov-hero-heading">
              AI-Based Property Tax Self-Assessment Tracking Portal
            </h1>

            <p className="gov-hero-lead">
              Official digital treasury platform linking municipal property assessments with citizen Aadhaar identifiers and multi-bank electronic clearing. Inspect Demand-Collection-Balance (DCB) records, review verified bank remittances, and download Form-V tax clearance certificates.
            </p>

            {/* Official Citizen Tax Portal Gateway Card */}
            <div className="hero-portal-access-card">
              <div className="hero-portal-access-inner">
                <div className="portal-access-badge flex-align">
                  <ShieldCheckIcon size={16} color="#a7f3d0" />
                  <span>OFFICIAL CITIZEN TAX ASSESSMENT ACCESS</span>
                </div>
                <h3>Citizen Property Tax Information & Assessment Portal</h3>
                <p>
                  Access the dedicated municipal revenue terminal to verify property assessments, calculate demand-collection dues, and review multi-bank electronic remittances with your registered 12-digit Aadhaar UID.
                </p>
                <div className="portal-access-actions">
                  <Link to="/portal" className="btn-authority-cta flex-align" style={{ textDecoration: "none" }}>
                    <SearchIcon size={18} color="#071b3b" />
                    <span>Proceed to Citizen Tax Portal →</span>
                  </Link>
                  <Link to="/login" className="btn-hero-officer flex-align">
                    <BuildingGovIcon size={16} color="#ffffff" />
                    <span>Municipal Officer Sign In</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Inter-Bank Clearing Status Ribbon */}
            <div className="bank-network-status-bar">
              <span className="network-title flex-align">
                <BankIcon size={16} color="#059669" />
                <strong>Inter-Bank Treasury Gateway:</strong>
              </span>
              <div className="network-nodes-list">
                <span className="node-item flex-align">
                  <span className="status-dot green"></span> State Bank of India (CBS Online)
                </span>
                <span className="node-item flex-align">
                  <span className="status-dot green"></span> Indian Bank (e-Challan Active)
                </span>
                <span className="node-item flex-align">
                  <span className="status-dot green"></span> Bank of India (Treasury Active)
                </span>
                <span className="node-item flex-align">
                  <span className="status-dot green"></span> RBI Settlement Switch (ISO 20022)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Citizen Quick Services Ribbon */}
          <aside className="gov-hero-services-col">
            <div className="citizen-services-card">
              <div className="services-card-header flex-align">
                <BuildingGovIcon size={20} color="#0b3d91" />
                <h3>CITIZEN & BANKING SERVICES</h3>
              </div>
              <ul className="citizen-services-menu">
                <li>
                  <Link to="/portal" className="service-menu-item">
                    <div className="menu-icon-box">
                      <SearchIcon size={18} color="#0b3d91" />
                    </div>
                    <div className="menu-text-box">
                      <strong>Check Property Tax Assessment</strong>
                      <span>Aadhaar-linked instant DCB dues calculation</span>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link to="/portal" className="service-menu-item">
                    <div className="menu-icon-box">
                      <BankIcon size={18} color="#059669" />
                    </div>
                    <div className="menu-text-box">
                      <strong>Inter-Bank Remittance Ledger</strong>
                      <span>Consolidated payments across SBI, IB, BoI</span>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link to="/portal" className="service-menu-item">
                    <div className="menu-icon-box">
                      <ReceiptIcon size={18} color="#d97706" />
                    </div>
                    <div className="menu-text-box">
                      <strong>Download Form-V Clearance</strong>
                      <span>Digitally signed official municipal receipt</span>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link to="/portal" className="service-menu-item">
                    <div className="menu-icon-box">
                      <CalendarIcon size={18} color="#0284c7" />
                    </div>
                    <div className="menu-text-box">
                      <strong>Monthly & Annual Tax Schedule</strong>
                      <span>Historical assessment years & collection ledger</span>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="service-menu-item officer-highlight">
                    <div className="menu-icon-box">
                      <ScaleIcon size={18} color="#7c3aed" />
                    </div>
                    <div className="menu-text-box">
                      <strong>Municipal Officer Administration</strong>
                      <span>City-wide collection dashboard & audit queue</span>
                    </div>
                    <span className="arrow">→</span>
                  </Link>
                </li>
              </ul>

              <div className="services-card-footer">
                <span className="secure-footnote flex-align">
                  <ShieldCheckIcon size={14} color="#059669" />
                  <span>Standardized under National Urban e-Governance Mission</span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Official Government Treasury Performance Figures Bar */}
      <section className="treasury-kpi-strip">
        <div className="treasury-strip-inner">
          <div className="treasury-kpi-item">
            <span className="treasury-kpi-val">₹842.6 Cr</span>
            <span className="treasury-kpi-lbl">Total Municipal Revenue Collected</span>
          </div>
          <div className="treasury-kpi-item">
            <span className="treasury-kpi-val">99.8%</span>
            <span className="treasury-kpi-lbl">Core Banking Clearance Accuracy</span>
          </div>
          <div className="treasury-kpi-item">
            <span className="treasury-kpi-val">1.48 Million</span>
            <span className="treasury-kpi-lbl">Digitized GIS Land Parcels</span>
          </div>
          <div className="treasury-kpi-item">
            <span className="treasury-kpi-val">100% Paperless</span>
            <span className="treasury-kpi-lbl">DigiLocker Integrated Form-V Receipts</span>
          </div>
        </div>
      </section>

      {/* Core Institutional Features */}
      <section className="institutional-pillars-section" id="services">
        <div className="pillars-section-header">
          <span className="section-pre-title">STATUTORY ARCHITECTURE</span>
          <h2>Integrated Urban Revenue & Inter-Bank Banking System</h2>
          <p>
            Operating under the statutory authority of the Municipal Corporation Act, the platform merges municipal land cadastre records with banking clearance networks for seamless single-identifier citizen administration.
          </p>
        </div>

        <div className="pillars-cards-grid">
          <div className="pillar-card">
            <div className="pillar-header flex-align">
              <div className="pillar-icon-box">
                <IdCardIcon size={26} color="#0b3d91" />
              </div>
              <span className="pillar-statutory-code">SEC 109 / LAND RECORDS</span>
            </div>
            <h3>Single Aadhaar Cadastre Retrieval</h3>
            <p>
              Queries the central municipal land registry with 12-digit Aadhaar UID, automatically mapping parcel boundaries, property classification, built-up square footage, and registered ownership.
            </p>
            <ul className="pillar-bullets">
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Masked UID protection under UIDAI vault</li>
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Official GIS parcel cadastre identifier mapping</li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-header flex-align">
              <div className="pillar-icon-box">
                <BankIcon size={26} color="#059669" />
              </div>
              <span className="pillar-statutory-code">RBI / CBS CLEARING</span>
            </div>
            <h3>Inter-Bank Revenue Clearing Consortium</h3>
            <p>
              Consolidates remittance archives across State Bank of India, Indian Bank, and Bank of India. Eliminates branch counter queues through automated Core Banking System (CBS) transaction reconciliations.
            </p>
            <ul className="pillar-bullets">
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Unique Transaction Reference (UTR) validation</li>
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> ISO 20022 compliant financial messaging</li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-header flex-align">
              <div className="pillar-icon-box">
                <CalendarIcon size={26} color="#0284c7" />
              </div>
              <span className="pillar-statutory-code">SEC 114 / DCB LEDGER</span>
            </div>
            <h3>Dynamic Demand & Collection (DCB) Book</h3>
            <p>
              Automated financial engine computes monthly instalment schedules, compounding interest on arrears, statutory library cess, education cess, and early-bird incentive rebates.
            </p>
            <ul className="pillar-bullets">
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Exact breakdown of principal vs interest penalty</li>
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Multi-year annual assessment comparative ledger</li>
            </ul>
          </div>

          <div className="pillar-card">
            <div className="pillar-header flex-align">
              <div className="pillar-icon-box">
                <ScaleIcon size={26} color="#7c3aed" />
              </div>
              <span className="pillar-statutory-code">SEC 120 / REVENUE AUDIT</span>
            </div>
            <h3>Statutory Compliance & Survey Scrutiny</h3>
            <p>
              Automated municipal scrutiny analyzes taxpayer consistency, detects structural deviations or unassessed commercial extensions, and prepares field survey directives for revenue inspectors.
            </p>
            <ul className="pillar-bullets">
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Tiered risk levels (High / Standard / Low Risk)</li>
              <li className="flex-align"><CheckIcon size={14} color="#059669" /> Formal municipal survey recommendation docket</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Official 4-Stage Operational Protocol */}
      <section className="gov-process-protocol-section">
        <div className="protocol-container">
          <div className="pillars-section-header">
            <span className="section-pre-title">CITIZEN OPERATING WORKFLOW</span>
            <h2>Standard Operating Procedure for Property Tax Inquiry</h2>
          </div>

          <div className="protocol-steps-grid">
            <div className="protocol-step-card">
              <div className="step-badge">STEP 01</div>
              <h4>Citizen Identification</h4>
              <p>Input registered 12-digit Aadhaar UID or official municipal assessment identifier in the secure portal field.</p>
            </div>

            <div className="protocol-step-card">
              <div className="step-badge">STEP 02</div>
              <h4>Registry & Bank Query</h4>
              <p>System authenticates with municipal land cadastre and queries partner banks for verified electronic payment challans.</p>
            </div>

            <div className="protocol-step-card">
              <div className="step-badge">STEP 03</div>
              <h4>Ledger & Audit Reconciliation</h4>
              <p>DCB engine calculates statutory taxes, outstanding arrears, payment completion progress, and compliance risk.</p>
            </div>

            <div className="protocol-step-card">
              <div className="step-badge">STEP 04</div>
              <h4>Official Dossier Issuance</h4>
              <p>Access comprehensive assessment dashboard, download Form-V tax clearance certificate, or review bank settlement details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Municipal Authority & Helpdesk Section */}
      <section className="gov-authority-strip">
        <div className="authority-inner-content">
          <div className="authority-text-block">
            <div className="authority-seal-row flex-align">
              <NationalEmblemIcon size={28} color="#d4af37" />
              <h3>Department of Municipal Revenue & Urban Administration</h3>
            </div>
            <p>
              Established under the provisions of the Urban Local Bodies Act. For queries regarding property valuation reassessments, change in occupancy classification, or disputed bank debits, contact your Zonal Municipal Office or the National Revenue Helpdesk.
            </p>
            <div className="authority-contact-pills">
              <span className="contact-pill flex-align">
                <PhoneIcon size={14} color="#059669" /> <strong>Toll-Free Helpline:</strong> 1800-111-8293 (08:00 – 20:00 IST)
              </span>
              <span className="contact-pill flex-align">
                <MailIcon size={14} color="#0b3d91" /> <strong>Grievance Email:</strong> municipal.revenue@propertytax.gov.in
              </span>
              <span className="contact-pill flex-align">
                <BuildingGovIcon size={14} color="#7c3aed" /> <strong>Central Treasury:</strong> Block-4, National e-Governance Complex
              </span>
            </div>
          </div>
          <div className="authority-action-block">
            <Link to="/portal" className="btn-authority-cta">
              Access Full Assessment Portal →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
