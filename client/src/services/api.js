import axios from "axios";
import {
  mockFindTaxpayer,
  mockGetPayments,
  mockBuildOverallTotals,
  mockBuildMonthlySummary,
  mockBuildAnnualSummary,
  mockBuildBankSummary,
  mockDetectQualityAlerts,
  mockGenerateCompliance,
  mockGetAdminOverview,
} from "./mockDataProvider";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://smart-property-taxportal-main-backend.onrender.com/api",
  timeout: 8000,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resilient fallback runner
const withFallback = async (apiCall, fallbackFn) => {
  try {
    return await apiCall();
  } catch (err) {
    // If backend is not running, network fails, or returns 404/5xx, engage deterministic fallback
    if (
      !err.response ||
      err.code === "ECONNABORTED" ||
      err.message === "Network Error" ||
      err.response?.status === 404 ||
      err.response?.status >= 500
    ) {
      const data = await fallbackFn();
      return { data, status: 200, statusText: "OK (Standalone Mode)" };
    }
    throw err;
  }
};

// Search API
export const searchTaxpayer = (identifier) =>
  withFallback(
    () => api.post("/taxpayers/search", { identifier }),
    () => {
      const tp = mockFindTaxpayer(identifier);
      if (!tp) {
        const error = new Error("Taxpayer record not found in demonstration registry. Please verify the 12-digit Aadhaar UID.");
        error.response = { data: { message: "Taxpayer record not found in demonstration registry. Please verify the 12-digit Aadhaar UID." } };
        throw error;
      }
      return {
        success: true,
        recordId: tp.aadhaarDemoId,
        name: tp.name,
        propertyId: tp.propertyId,
        propertyType: tp.propertyType,
      };
    }
  );

// Multi-Page Workflow APIs
export const getTaxOverview = (recordId) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/tax-overview`),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) {
        const err = new Error("Taxpayer record not found.");
        err.response = { data: { message: "Taxpayer record not found." } };
        throw err;
      }
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      const alerts = mockDetectQualityAlerts(tp, payments, totals);

      return {
        taxpayer: {
          _id: tp._id,
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          numericAadhaar: tp.numericAadhaar,
          aadhaarMasked: `XXXX-XXXX-${tp.aadhaarDemoId.slice(-4)}`,
          propertyId: tp.propertyId,
          propertyAddress: tp.propertyAddress,
          propertyType: tp.propertyType,
          propertyUsage: tp.propertyUsage,
          propertyAreaSqFt: tp.propertyAreaSqFt,
          propertyValue: tp.propertyValue,
          annualAssessedTax: totals.totalTaxAmount,
          assessmentYear: tp.assessmentYear,
          hasDocumentationDiscrepancy: tp.hasDocumentationDiscrepancy,
          hasAssessmentDiscrepancy: tp.hasAssessmentDiscrepancy,
        },
        totals,
        alerts,
      };
    }
  );

export const getMonthlyAnalysis = (recordId, params = {}) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/monthly-analysis`, { params }),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      let payments = mockGetPayments(recordId);
      if (params.status && params.status !== "All") {
        payments = payments.filter((p) => p.status === params.status);
      }
      const months = mockBuildMonthlySummary(payments);
      const totals = mockBuildOverallTotals(tp, payments);
      return {
        taxpayer: {
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          propertyId: tp.propertyId,
          assessmentYear: tp.assessmentYear,
        },
        months,
        totals,
        financialYears: ["2024-25", "2023-24", "2022-23"],
      };
    }
  );

export const getAnnualAnalysis = (recordId) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/annual-analysis`),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      const payments = mockGetPayments(recordId);
      const years = mockBuildAnnualSummary(payments);
      const totals = mockBuildOverallTotals(tp, payments);
      return {
        taxpayer: {
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          propertyId: tp.propertyId,
        },
        years,
        totals,
      };
    }
  );

export const getBankRecords = (recordId, params = {}) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/bank-records`, { params }),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      let payments = mockGetPayments(recordId);
      if (params.bank && params.bank !== "All") {
        payments = payments.filter((p) => p.bankName === params.bank);
      }
      if (params.status && params.status !== "All") {
        payments = payments.filter((p) => (p.transactionStatus || p.status) === params.status);
      }
      const bankSummary = mockBuildBankSummary(payments);
      return {
        taxpayer: {
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          maskedAadhaar: `XXXX-XXXX-${tp.aadhaarDemoId.slice(-4)}`,
        },
        bankSummary,
        transactions: payments,
        supportedBanks: ["State Bank of India", "Indian Bank", "Bank of India"],
      };
    }
  );

export const getCompliance = (recordId) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/compliance`),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      return mockGenerateCompliance(tp, totals);
    }
  );

export const refreshCompliance = (recordId) =>
  withFallback(
    () => api.post(`/taxpayers/${recordId}/compliance/analyze`),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      return { ...mockGenerateCompliance(tp, totals), refreshed: true };
    }
  );

export const getTaxReport = (recordId) =>
  withFallback(
    () => api.get(`/taxpayers/${recordId}/report`),
    () => {
      const tp = mockFindTaxpayer(recordId);
      if (!tp) throw new Error("Taxpayer not found");
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      const months = mockBuildMonthlySummary(payments);
      const compliance = mockGenerateCompliance(tp, totals);
      return {
        taxpayer: {
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          numericAadhaar: tp.numericAadhaar,
          propertyId: tp.propertyId,
          propertyAddress: tp.propertyAddress,
          propertyType: tp.propertyType,
          propertyUsage: tp.propertyUsage,
          propertyAreaSqFt: tp.propertyAreaSqFt,
          propertyValue: tp.propertyValue,
          assessmentYear: tp.assessmentYear,
        },
        totals,
        monthlyBreakdown: months,
        paymentHistory: payments,
        compliance,
        generatedAt: new Date().toISOString(),
        receiptNumber: `MREC-${tp.aadhaarDemoId.slice(-4)}-2026`,
      };
    }
  );

// Municipal Admin API
export const getAdminOverview = () =>
  withFallback(
    () => api.get(`/taxpayer/admin/overview`),
    () => mockGetAdminOverview()
  );

// Backward Compatibility APIs
export const getFullTaxpayerProfile = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/full-profile`),
    () => {
      const tp = mockFindTaxpayer(aadhaar);
      if (!tp) {
        const err = new Error("Taxpayer record not found");
        err.response = { data: { message: "Taxpayer record not found. Please verify the 12-digit Aadhaar UID." } };
        throw err;
      }
      const payments = mockGetPayments(aadhaar);
      const totals = mockBuildOverallTotals(tp, payments);
      const annualSummary = mockBuildAnnualSummary(payments);
      const monthlySummary = mockBuildMonthlySummary(payments);
      const bankSummary = mockBuildBankSummary(payments);
      const aiAnalysis = mockGenerateCompliance(tp, totals);
      return {
        taxpayer: tp,
        totals,
        bankSummary,
        monthlySummary,
        annualSummary,
        payments,
        aiAnalysis,
      };
    }
  );

export const getTaxpayer = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}`),
    () => {
      const tp = mockFindTaxpayer(aadhaar);
      if (!tp) throw new Error("Not found");
      return tp;
    }
  );

export const getBankDetails = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/banks`),
    () => {
      const payments = mockGetPayments(aadhaar);
      return { banks: mockBuildBankSummary(payments) };
    }
  );

export const getMonthlySummary = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/monthly-summary`),
    () => {
      const payments = mockGetPayments(aadhaar);
      return { months: mockBuildMonthlySummary(payments) };
    }
  );

export const getAnnualSummary = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/annual-summary`),
    () => {
      const payments = mockGetPayments(aadhaar);
      return { years: mockBuildAnnualSummary(payments) };
    }
  );

export const getProgress = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/progress`),
    () => {
      const tp = mockFindTaxpayer(aadhaar);
      const payments = mockGetPayments(aadhaar);
      const totals = mockBuildOverallTotals(tp, payments);
      return {
        totalDue: totals.totalTaxAmount,
        totalPaid: totals.totalPaid,
        outstanding: totals.totalOutstanding,
        percentage: totals.paymentProgress,
      };
    }
  );

export const getPaymentHistory = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/payments`),
    () => {
      const payments = mockGetPayments(aadhaar);
      return { payments };
    }
  );

export const getAIAnalysis = (aadhaar) =>
  withFallback(
    () => api.get(`/taxpayer/${aadhaar}/ai-analysis`),
    () => {
      const tp = mockFindTaxpayer(aadhaar);
      const payments = mockGetPayments(aadhaar);
      const totals = mockBuildOverallTotals(tp, payments);
      return mockGenerateCompliance(tp, totals);
    }
  );

// Officer Authentication APIs
export const authLogin = (email, password) =>
  withFallback(
    () => api.post("/auth/login", { email, password }),
    () => {
      const cleanEmail = email ? email.trim() : "officer@revenue.gov.in";
      const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName =
        namePart
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Municipal Officer";

      return {
        _id: "demo_officer_01",
        name: formattedName,
        email: cleanEmail,
        role: "officer",
        token: "officer_session_token_" + Date.now(),
      };
    }
  );

export const authRegister = (name, email, password) =>
  withFallback(
    () => api.post("/auth/register", { name, email, password }),
    () => {
      const cleanEmail = email ? email.trim() : "officer@revenue.gov.in";
      return {
        _id: "demo_officer_" + Date.now(),
        name: name ? name.trim() : "Municipal Officer",
        email: cleanEmail,
        role: "officer",
        token: "officer_session_token_" + Date.now(),
      };
    }
  );

export default api;
