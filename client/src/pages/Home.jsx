import { Link } from "react-router-dom";
import { SearchIcon, IdCardIcon, BankIcon, CalendarIcon, AiBrainIcon } from "../components/Icons";

const Home = () => {
  return (
    <div className="home-web-app">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span> OFFICIAL MUNICIPAL DIGITAL PORTAL
          </div>
          <h1>AI-Driven Smart Property Tax Information System</h1>
          <p className="hero-description">
            A unified government platform enabling property owners to check property tax status, view bank-wise payment records, review monthly breakdowns, and receive automated AI compliance analysis using a single Aadhaar search input.
          </p>
          <div className="hero-action-buttons">
            <Link to="/portal" className="btn-hero-primary flex-center">
              <SearchIcon size={20} color="#ffffff" /> Search Property Tax Dues →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-box">
            <span className="stat-number">100%</span>
            <span className="stat-label">Automated Data Retrieval</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">3+</span>
            <span className="stat-label">Integrated Bank Partners</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">Real-Time</span>
            <span className="stat-label">AI Compliance Evaluation</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">24 / 7</span>
            <span className="stat-label">Government Portal Availability</span>
          </div>
        </div>
      </section>

      {/* Key Services Grid */}
      <section className="services-section" id="services">
        <div className="section-title-wrapper">
          <span className="sub-title">CORE PLATFORM SERVICES</span>
          <h2>Intelligent Features & Automated Capabilities</h2>
          <p>Designed to streamline municipal property tax verification into a seamless single-input experience.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box">
              <IdCardIcon size={36} color="#0b3d91" />
            </div>
            <h3>Single Aadhaar Retrieval</h3>
            <p>
              Enter only your Aadhaar Number to automatically fetch complete property information, tax assessments, bank payments, and monthly breakdowns.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <BankIcon size={36} color="#0b3d91" />
            </div>
            <h3>Bank-Wise Auto Consolidation</h3>
            <p>
              Automatically aggregates tax payment records across State Bank, Indian Bank, Bank of India, and partner financial institutions without manual selection.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <CalendarIcon size={36} color="#0b3d91" />
            </div>
            <h3>Monthly & Annual Breakdown</h3>
            <p>
              Backend calculation engines compute monthly tax dues, amounts paid, outstanding balances, and financial year histories dynamically.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <AiBrainIcon size={36} color="#0b3d91" />
            </div>
            <h3>AI Compliance Analysis</h3>
            <p>
              Integrated Claude AI engine analyzes payment behavior, consistency, and outstanding trends to automatically assign compliance levels and actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="workflow-section">
        <div className="section-title-wrapper">
          <span className="sub-title">SIMPLE 4-STEP PROCESS</span>
          <h2>How The Automated Tax Portal Works</h2>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-num">01</div>
            <h4>Enter Aadhaar ID</h4>
            <p>Input your Aadhaar Number into the single primary search field on the main portal.</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num">02</div>
            <h4>Automated Data Fetch</h4>
            <p>System automatically queries the database provider for property and payment records.</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num">03</div>
            <h4>AI & Math Processing</h4>
            <p>Tax engines calculate totals while AI evaluates payment consistency and compliance.</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-num">04</div>
            <h4>Display Full Dashboard</h4>
            <p>All KPI cards, tables, charts, status badges, and recommendations render instantly on a single dashboard.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="home-cta-banner">
        <div className="cta-content">
          <h2>Ready to Check Your Property Tax Details?</h2>
          <p>Access the official digital service portal now and retrieve your complete tax breakdown in seconds.</p>
          <Link to="/portal" className="btn-cta">
            Go to Tax Search Portal →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;