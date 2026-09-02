const express = require("express");
const router = express.Router();
const {
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

// Admin Overview Route
router.get("/admin/overview", getAdminOverview);

// Public endpoints for direct Aadhaar search & AI tax generation
router.get("/:aadhaar/full-profile", getFullProfile);
router.get("/:aadhaar/monthly-summary", getMonthlySummary);
router.get("/:aadhaar/ai-analysis", getAIAnalysis);
router.get("/:aadhaar", getTaxpayer);
router.get("/:aadhaar/banks", getBankDetails);
router.get("/:aadhaar/annual-summary", getAnnualSummary);
router.get("/:aadhaar/progress", getProgress);
router.get("/:aadhaar/payments", getPaymentHistory);

module.exports = router;