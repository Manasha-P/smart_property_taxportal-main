import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainPortal from "./pages/MainPortal";
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/portal" element={<MainPortal />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/:aadhaar" element={<Dashboard />} />
            <Route path="/dashboard/:aadhaar/banks" element={<BankDetails />} />
            <Route path="/dashboard/:aadhaar/annual" element={<AnnualSummary />} />
            <Route path="/dashboard/:aadhaar/progress" element={<Progress />} />
            <Route path="/dashboard/:aadhaar/ai-analysis" element={<AIAnalysisPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;