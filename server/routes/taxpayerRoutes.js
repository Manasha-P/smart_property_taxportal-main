const express = require("express");
const router = express.Router();
const {
  searchTaxpayer,
  getTaxOverview,
  getMonthlyAnalysis,
  getAnnualAnalysis,
  getBankRecords,
  getCompliance,
  analyzeCompliance,
  getTaxReport,
  getAdminOverview,
  getFullProfile,
  getTaxpayer,
  getBankDetails,
  getMonthlySummary,
  getAnnualSummary,
  getProgress,
  getPaymentHistory,
  getAIAnalysis,
} = require("../controllers/taxpayerController");

// Search & Admin Routes
router.post("/search", searchTaxpayer);
router.get("/admin/overview", getAdminOverview);

// Dedicated Multi-Page Workflow Routes
router.get("/:recordId/tax-overview", getTaxOverview);
router.get("/:recordId/monthly-analysis", getMonthlyAnalysis);
router.get("/:recordId/annual-analysis", getAnnualAnalysis);
router.get("/:recordId/bank-records", getBankRecords);
router.get("/:recordId/compliance", getCompliance);
router.post("/:recordId/compliance/analyze", analyzeCompliance);
router.get("/:recordId/report", getTaxReport);

// Backward Compatibility Routes
router.get("/:aadhaar/full-profile", getFullProfile);
router.get("/:aadhaar/monthly-summary", getMonthlySummary);
router.get("/:aadhaar/ai-analysis", getAIAnalysis);
router.get("/:aadhaar/banks", getBankDetails);
router.get("/:aadhaar/annual-summary", getAnnualSummary);
router.get("/:aadhaar/progress", getProgress);
router.get("/:aadhaar/payments", getPaymentHistory);
router.get("/:aadhaar", getTaxpayer);

module.exports = router;