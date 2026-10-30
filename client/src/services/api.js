import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Search API
export const searchTaxpayer = (identifier) => api.post("/taxpayers/search", { identifier });

// Multi-Page Workflow APIs
export const getTaxOverview = (recordId) => api.get(`/taxpayers/${recordId}/tax-overview`);
export const getMonthlyAnalysis = (recordId, params = {}) => api.get(`/taxpayers/${recordId}/monthly-analysis`, { params });
export const getAnnualAnalysis = (recordId) => api.get(`/taxpayers/${recordId}/annual-analysis`);
export const getBankRecords = (recordId, params = {}) => api.get(`/taxpayers/${recordId}/bank-records`, { params });
export const getCompliance = (recordId) => api.get(`/taxpayers/${recordId}/compliance`);
export const refreshCompliance = (recordId) => api.post(`/taxpayers/${recordId}/compliance/analyze`);
export const getTaxReport = (recordId) => api.get(`/taxpayers/${recordId}/report`);

// Municipal Admin API
export const getAdminOverview = () => api.get(`/taxpayer/admin/overview`);

// Backward Compatibility APIs
export const getFullTaxpayerProfile = (aadhaar) => api.get(`/taxpayer/${aadhaar}/full-profile`);
export const getTaxpayer = (aadhaar) => api.get(`/taxpayer/${aadhaar}`);
export const getBankDetails = (aadhaar) => api.get(`/taxpayer/${aadhaar}/banks`);
export const getMonthlySummary = (aadhaar) => api.get(`/taxpayer/${aadhaar}/monthly-summary`);
export const getAnnualSummary = (aadhaar) => api.get(`/taxpayer/${aadhaar}/annual-summary`);
export const getProgress = (aadhaar) => api.get(`/taxpayer/${aadhaar}/progress`);
export const getPaymentHistory = (aadhaar) => api.get(`/taxpayer/${aadhaar}/payments`);
export const getAIAnalysis = (aadhaar) => api.get(`/taxpayer/${aadhaar}/ai-analysis`);

export default api;