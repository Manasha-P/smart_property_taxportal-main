import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPortal from "./pages/MainPortal";
import AnalysisPage from "./pages/AnalysisPage";
import TaxOverviewPage from "./pages/TaxOverviewPage";
import MonthlyAnalysisPage from "./pages/MonthlyAnalysisPage";
import AnnualAnalysisPage from "./pages/AnnualAnalysisPage";
import BankRecordsPage from "./pages/BankRecordsPage";
import CompliancePage from "./pages/CompliancePage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BankDetails from "./pages/BankDetails";
import AnnualSummary from "./pages/AnnualSummary";
import Progress from "./pages/Progress";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Primary Guided Municipal Workflow Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/portal" element={<MainPortal />} />
            <Route path="/analysis/:recordId" element={<AnalysisPage />} />
            <Route path="/tax-overview/:recordId" element={<TaxOverviewPage />} />
            <Route path="/monthly-analysis/:recordId" element={<MonthlyAnalysisPage />} />
            <Route path="/annual-analysis/:recordId" element={<AnnualAnalysisPage />} />
            <Route path="/bank-records/:recordId" element={<BankRecordsPage />} />
            <Route path="/compliance/:recordId" element={<CompliancePage />} />

            {/* Officer & Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* Backward Compatibility Single-Dashboard Routes */}
            <Route path="/dashboard/:aadhaar" element={<Dashboard />} />
            <Route path="/dashboard/:aadhaar/banks" element={<BankDetails />} />
            <Route path="/dashboard/:aadhaar/annual" element={<AnnualSummary />} />
            <Route path="/dashboard/:aadhaar/progress" element={<Progress />} />
            <Route path="/dashboard/:aadhaar/ai-analysis" element={<AIAnalysisPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
