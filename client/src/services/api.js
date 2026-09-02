import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAdminOverview = () => api.get(`/taxpayer/admin/overview`);
export const getFullTaxpayerProfile = (aadhaar) => api.get(`/taxpayer/${aadhaar}/full-profile`);
export const getTaxpayer = (aadhaar) => api.get(`/taxpayer/${aadhaar}`);
export const getBankDetails = (aadhaar) => api.get(`/taxpayer/${aadhaar}/banks`);
export const getMonthlySummary = (aadhaar) => api.get(`/taxpayer/${aadhaar}/monthly-summary`);
export const getAnnualSummary = (aadhaar) => api.get(`/taxpayer/${aadhaar}/annual-summary`);
export const getProgress = (aadhaar) => api.get(`/taxpayer/${aadhaar}/progress`);
export const getPaymentHistory = (aadhaar) => api.get(`/taxpayer/${aadhaar}/payments`);
export const getAIAnalysis = (aadhaar) => api.get(`/taxpayer/${aadhaar}/ai-analysis`);

export default api;