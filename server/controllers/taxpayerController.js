const Taxpayer = require("../models/Taxpayer");
const TaxPayment = require("../models/TaxPayment");
const TaxpayerDataProvider = require("../utils/taxpayerDataProvider");
const AIAnalysis = require("../models/AIAnalysis");
const generateAIAnalysis = require("../utils/aiService");
const generateRuleBasedAnalysis = require("../utils/ruleBasedAnalysis");
const {
  roundCurrency,
  buildAnnualSummary,
  buildBankSummary,
  buildMonthlySummary,
  buildOverallTotals,
  detectQualityAlerts,
} = require("../utils/taxCalculationService");
const { generateSurveyRecommendations } = require("../utils/surveyRecommendationService");

// Helper: find taxpayer by demo identifier, 12-digit numeric Aadhaar, propertyId or ObjectId
const findTaxpayer = async (identifier, res) => {
  const taxpayer = await TaxpayerDataProvider.getTaxpayerByIdentifier(identifier);
  if (!taxpayer) {
    if (res) {
      res.status(404).json({ message: "Taxpayer record not found. Please verify the demo identifier." });
    }
    return null;
  }
  return taxpayer;
};

// @route POST /api/taxpayers/search
const searchTaxpayer = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || !String(identifier).trim()) {
      return res.status(400).json({ message: "Please enter a valid demo identifier or 12-digit Aadhaar number." });
    }

    const clean = String(identifier).trim();

    // Check for 12-digit numeric constraint if all digits
    if (/^\d+$/.test(clean) && clean.length !== 12) {
      return res.status(400).json({ message: "Simulated numeric Aadhaar identifier must be exactly 12 digits." });
    }

    const taxpayer = await findTaxpayer(clean, null);
    if (!taxpayer) {
      return res.status(404).json({
        message: "No matching taxpayer record found in demonstration database. Try DEMO-1001 through DEMO-1050.",
      });
    }

    res.json({
      success: true,
      recordId: taxpayer.aadhaarDemoId,
      name: taxpayer.name,
      propertyId: taxpayer.propertyId,
      propertyType: taxpayer.propertyType,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error searching taxpayer", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/tax-overview
const getTaxOverview = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const totals = buildOverallTotals(taxpayer, payments);
    const alerts = detectQualityAlerts(taxpayer, payments, totals);

    res.json({
      taxpayer: {
        _id: taxpayer._id,
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        numericAadhaar: taxpayer.numericAadhaar || `10010000${taxpayer.aadhaarDemoId.slice(-4)}`,
        aadhaarMasked: `XXXX-XXXX-${taxpayer.aadhaarDemoId.slice(-4)}`,
        propertyId: taxpayer.propertyId,
        propertyAddress: taxpayer.propertyAddress,
        propertyType: taxpayer.propertyType,
        propertyUsage: taxpayer.propertyUsage || "Owner Occupied",
        propertyAreaSqFt: taxpayer.propertyAreaSqFt || 1200,
        propertyValue: taxpayer.propertyValue,
        annualAssessedTax: totals.totalTaxAmount,
        assessmentYear: taxpayer.assessmentYear || "2024-25",
        hasDocumentationDiscrepancy: taxpayer.hasDocumentationDiscrepancy || false,
        hasAssessmentDiscrepancy: taxpayer.hasAssessmentDiscrepancy || false,
      },
      totals,
      alerts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving tax overview", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/monthly-analysis
const getMonthlyAnalysis = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    let payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const { financialYear, status } = req.query;

    if (financialYear) {
      payments = payments.filter((p) => p.financialYear === financialYear);
    }
    if (status && status !== "All") {
      payments = payments.filter((p) => p.status === status);
    }

    const months = buildMonthlySummary(payments);
    const totals = buildOverallTotals(taxpayer, payments);

    res.json({
      taxpayer: {
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        propertyId: taxpayer.propertyId,
        assessmentYear: taxpayer.assessmentYear || "2024-25",
      },
      months,
      totals,
      financialYears: ["2024-25", "2023-24", "2022-23"],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving monthly analysis", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/annual-analysis
const getAnnualAnalysis = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const years = buildAnnualSummary(payments);
    const totals = buildOverallTotals(taxpayer, payments);

    res.json({
      taxpayer: {
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        propertyId: taxpayer.propertyId,
      },
      years,
      totals,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving annual analysis", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/bank-records
const getBankRecords = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    let payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const { bank, status, financialYear } = req.query;

    if (bank && bank !== "All") {
      payments = payments.filter((p) => p.bankName === bank);
    }
    if (status && status !== "All") {
      payments = payments.filter((p) => (p.transactionStatus || p.status) === status);
    }
    if (financialYear && financialYear !== "All") {
      payments = payments.filter((p) => p.financialYear === financialYear);
    }

    const bankSummary = buildBankSummary(payments);

    const formattedTransactions = payments.map((p) => ({
      _id: p._id,
      transactionRef: p.transactionRef || `TXN-${p.bankName?.slice(0, 3).toUpperCase()}-${p._id.toString().slice(-6)}`,
      bankName: p.bankName,
      maskedAccount: p.maskedAccount || "XXXX-XXXX-4819",
      financialYear: p.financialYear,
      month: p.month || "Annual Settlement",
      taxDue: p.taxDue,
      amountPaid: p.amountPaid,
      paymentDate: p.paymentDate,
      paymentDueDate: p.paymentDueDate,
      paymentPurpose: p.paymentPurpose || "Municipal Property Tax Instalment",
      status: p.status,
      transactionStatus: p.transactionStatus || "Success",
      reconciliationStatus: p.reconciliationStatus || "Reconciled",
    }));

    res.json({
      taxpayer: {
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        maskedAadhaar: `XXXX-XXXX-${taxpayer.aadhaarDemoId.slice(-4)}`,
      },
      bankSummary,
      transactions: formattedTransactions,
      supportedBanks: ["State Bank of India", "Indian Bank", "Bank of India"],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error retrieving bank records", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/compliance
const getCompliance = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const overallTotals = buildOverallTotals(taxpayer, payments);
    const annualSummary = buildAnnualSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);
    const bankSummary = buildBankSummary(payments);

    let cached = await AIAnalysis.findOne({ taxpayerId: taxpayer._id });

    if (cached && cached.surveyRecommendations && cached.surveyRecommendations.length > 0) {
      return res.json({
        complianceLevel: cached.complianceLevel,
        summaryText: cached.summaryText,
        paymentPattern: cached.paymentPattern,
        paymentConsistency: cached.paymentConsistency,
        outstandingTrend: cached.outstandingTrend,
        historicalCompliance: cached.historicalCompliance,
        currentStatusText: cached.currentStatusText,
        recommendation: cached.recommendation,
        surveyRecommendations: cached.surveyRecommendations,
        officerReviewRequired: cached.officerReviewRequired || false,
        source: cached.source,
        generatedAt: cached.generatedAt,
        cached: true,
      });
    }

    // Generate fresh analysis with survey recommendations
    const analysis = await generateAIAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);

    try {
      if (cached) {
        await AIAnalysis.findByIdAndUpdate(cached._id, {
          ...analysis,
          generatedAt: new Date(),
        });
      } else {
        await AIAnalysis.create({
          taxpayerId: taxpayer._id,
          ...analysis,
        });
      }
    } catch (cacheErr) {
      console.warn("AI cache save note:", cacheErr.message);
    }

    res.json({
      ...analysis,
      cached: false,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error generating compliance insights", error: err.message });
  }
};

// @route POST /api/taxpayers/:recordId/compliance/analyze
const analyzeCompliance = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const overallTotals = buildOverallTotals(taxpayer, payments);
    const annualSummary = buildAnnualSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);
    const bankSummary = buildBankSummary(payments);

    // Delete existing cache and re-analyze
    await AIAnalysis.deleteMany({ taxpayerId: taxpayer._id });
    const analysis = await generateAIAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);

    await AIAnalysis.create({
      taxpayerId: taxpayer._id,
      ...analysis,
    });

    res.json({
      ...analysis,
      cached: false,
      refreshed: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error refreshing compliance analysis", error: err.message });
  }
};

// @route GET /api/taxpayers/:recordId/report
const getTaxReport = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.recordId, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const totals = buildOverallTotals(taxpayer, payments);
    const annualSummary = buildAnnualSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);
    const bankSummary = buildBankSummary(payments);
    const alerts = detectQualityAlerts(taxpayer, payments, totals);

    let cached = await AIAnalysis.findOne({ taxpayerId: taxpayer._id });
    if (!cached) {
      cached = generateRuleBasedAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, totals);
    }

    const docReference = `MTAX-${taxpayer.propertyId}-${Date.now().toString().slice(-6)}`;

    res.json({
      documentMeta: {
        docReference,
        generatedAt: new Date().toISOString(),
        issuer: "Municipal Corporation Revenue Directorate — Official Digital Taxation Authority",
        disclaimer: "ACADEMIC DEMONSTRATION PROTOTYPE: All citizen information, bank accounts, and records are simulated.",
      },
      taxpayer: {
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        aadhaarMasked: `XXXX-XXXX-${taxpayer.aadhaarDemoId.slice(-4)}`,
        propertyId: taxpayer.propertyId,
        propertyAddress: taxpayer.propertyAddress,
        propertyType: taxpayer.propertyType,
        propertyUsage: taxpayer.propertyUsage || "Owner Occupied",
        propertyAreaSqFt: taxpayer.propertyAreaSqFt || 1200,
        propertyValue: taxpayer.propertyValue,
        assessmentYear: taxpayer.assessmentYear || "2024-25",
      },
      financialTotals: totals,
      annualSummary,
      monthlySummary,
      bankSummary,
      alerts,
      complianceSummary: {
        complianceLevel: cached.complianceLevel,
        statusText: cached.currentStatusText,
        recommendation: cached.recommendation,
        surveyRecommendations: cached.surveyRecommendations || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error generating tax report", error: err.message });
  }
};

// @route GET /api/taxpayer/admin/overview
const getAdminOverview = async (req, res) => {
  try {
    const allTaxpayers = await Taxpayer.find({});
    const allPayments = await TaxPayment.find({});

    let totalCityTaxDue = 0;
    let totalCityTaxPaid = 0;

    allPayments.forEach((p) => {
      if (p.transactionStatus !== "Failed" && p.transactionStatus !== "Cancelled") {
        totalCityTaxDue += roundCurrency(p.taxDue);
        totalCityTaxPaid += roundCurrency(p.amountPaid);
      }
    });

    totalCityTaxDue = roundCurrency(totalCityTaxDue);
    totalCityTaxPaid = roundCurrency(totalCityTaxPaid);
    const totalCityOutstanding = roundCurrency(Math.max(0, totalCityTaxDue - totalCityTaxPaid));
    const cityProgressPercentage = totalCityTaxDue === 0 ? 0 : roundCurrency((totalCityTaxPaid / totalCityTaxDue) * 100);

    let highComplianceCount = 0;
    let mediumComplianceCount = 0;
    let lowComplianceCount = 0;

    const highRiskTaxpayers = [];
    const surveyStats = {
      "Payment reminder": 0,
      "Document verification": 0,
      "Property assessment survey": 0,
      "Payment reconciliation": 0,
      "Routine monitoring": 0,
      "Officer review": 0,
    };

    for (const tp of allTaxpayers) {
      const tpPayments = allPayments.filter((p) => p.taxpayerId.toString() === tp._id.toString());
      const totals = buildOverallTotals(tp, tpPayments);

      if (totals.overallStatus === "TAX PAYER") {
        highComplianceCount++;
        surveyStats["Routine monitoring"] += 1;
      } else if (totals.overallStatus === "PARTIALLY PAID") {
        mediumComplianceCount++;
        surveyStats["Payment reminder"] += 1;
        highRiskTaxpayers.push({
          _id: tp._id,
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          propertyId: tp.propertyId,
          propertyType: tp.propertyType,
          totalDue: totals.totalTaxAmount,
          totalPaid: totals.totalPaid,
          outstanding: totals.totalOutstanding,
          progress: totals.paymentProgress,
          status: totals.overallStatus,
          riskLevel: "MEDIUM",
        });
      } else {
        lowComplianceCount++;
        surveyStats["Officer review"] += 1;
        highRiskTaxpayers.push({
          _id: tp._id,
          name: tp.name,
          aadhaarDemoId: tp.aadhaarDemoId,
          propertyId: tp.propertyId,
          propertyType: tp.propertyType,
          totalDue: totals.totalTaxAmount,
          totalPaid: totals.totalPaid,
          outstanding: totals.totalOutstanding,
          progress: totals.paymentProgress,
          status: totals.overallStatus,
          riskLevel: "HIGH",
        });
      }

      if (tp.hasAssessmentDiscrepancy) {
        surveyStats["Property assessment survey"] += 1;
      }
      if (tp.hasDocumentationDiscrepancy) {
        surveyStats["Document verification"] += 1;
      }
    }

    // Bank-wide aggregated collections across municipality
    const bankMap = {};
    allPayments.forEach((p) => {
      const bank = p.bankName || "State Bank of India";
      if (!bankMap[bank]) {
        bankMap[bank] = { bankName: bank, totalDue: 0, totalPaid: 0 };
      }
      if (p.transactionStatus !== "Failed" && p.transactionStatus !== "Cancelled") {
        bankMap[bank].totalDue += roundCurrency(p.taxDue);
        bankMap[bank].totalPaid += roundCurrency(p.amountPaid);
      }
    });

    const bankCollections = Object.values(bankMap).map((b) => ({
      bankName: b.bankName,
      totalDue: roundCurrency(b.totalDue),
      totalPaid: roundCurrency(b.totalPaid),
      outstanding: roundCurrency(Math.max(0, b.totalDue - b.totalPaid)),
      progress: b.totalDue === 0 ? 0 : roundCurrency((b.totalPaid / b.totalDue) * 100),
    }));

    res.json({
      summary: {
        totalTaxpayers: allTaxpayers.length,
        totalCityTaxDue,
        totalCityTaxPaid,
        totalCityOutstanding,
        cityProgressPercentage,
      },
      complianceDistribution: {
        highComplianceCount,
        mediumComplianceCount,
        lowComplianceCount,
      },
      bankCollections,
      highRiskTaxpayers,
      surveyStats,
      officerAiRecommendations: [
        `Prioritize official tax notices for ${lowComplianceCount} non-taxpayer account(s) carrying zero remittance history.`,
        `Send digital reminder notifications for ${mediumComplianceCount} partially paid account(s) to clear ₹${totalCityOutstanding.toLocaleString("en-IN")} in cumulative municipal outstanding dues.`,
        `Bank Remittance Alert: Monitor collections across State Bank of India, Indian Bank, and Bank of India to maintain digital revenue recovery.`,
        `${surveyStats["Property assessment survey"]} account(s) flagged for physical GIS property re-measurement survey.`,
      ],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching admin overview", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/full-profile (Backward compatibility)
const getFullProfile = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const overallTotals = buildOverallTotals(taxpayer, payments);
    const annualSummary = buildAnnualSummary(payments);
    const bankSummary = buildBankSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);

    let cached = await AIAnalysis.findOne({ taxpayerId: taxpayer._id });
    let aiAnalysis = null;

    if (cached) {
      aiAnalysis = {
        complianceLevel: cached.complianceLevel,
        summaryText: cached.summaryText || generateRuleBasedAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals).summaryText,
        paymentPattern: cached.paymentPattern,
        paymentConsistency: cached.paymentConsistency,
        outstandingTrend: cached.outstandingTrend,
        historicalCompliance: cached.historicalCompliance,
        currentStatusText: cached.currentStatusText,
        recommendation: cached.recommendation,
        surveyRecommendations: cached.surveyRecommendations || [],
        source: cached.source,
        cached: true,
      };
    } else {
      aiAnalysis = await generateAIAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);
      try {
        await AIAnalysis.create({
          taxpayerId: taxpayer._id,
          ...aiAnalysis,
        });
      } catch (cacheErr) {
        console.warn("AI cache note:", cacheErr.message);
      }
    }

    res.json({
      taxpayer: {
        _id: taxpayer._id,
        name: taxpayer.name,
        aadhaarDemoId: taxpayer.aadhaarDemoId,
        aadhaarMasked: `XXXX-XXXX-${taxpayer.aadhaarDemoId.slice(-4)}`,
        propertyId: taxpayer.propertyId,
        propertyAddress: taxpayer.propertyAddress,
        propertyType: taxpayer.propertyType,
        propertyUsage: taxpayer.propertyUsage || "Owner Occupied",
        propertyAreaSqFt: taxpayer.propertyAreaSqFt || 1200,
        propertyValue: taxpayer.propertyValue,
        annualAssessedTax: overallTotals.totalTaxAmount,
        assessmentYear: taxpayer.assessmentYear || "2024-25",
      },
      totals: overallTotals,
      annualSummary,
      bankSummary,
      monthlySummary,
      payments,
      aiAnalysis,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error generating full taxpayer profile", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar (Backward compatibility)
const getTaxpayer = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const totals = buildOverallTotals(taxpayer, payments);

    res.json({
      name: taxpayer.name,
      aadhaarDemoId: taxpayer.aadhaarDemoId,
      aadhaarMasked: `XXXX-XXXX-${taxpayer.aadhaarDemoId.slice(-4)}`,
      propertyId: taxpayer.propertyId,
      propertyAddress: taxpayer.propertyAddress,
      propertyType: taxpayer.propertyType,
      propertyValue: taxpayer.propertyValue,
      ...totals,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching taxpayer", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/banks (Backward compatibility)
const getBankDetails = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    res.json({ banks: buildBankSummary(payments) });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching bank details", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/monthly-summary (Backward compatibility)
const getMonthlySummary = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    res.json({ months: buildMonthlySummary(payments) });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching monthly summary", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/annual-summary (Backward compatibility)
const getAnnualSummary = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    res.json({ years: buildAnnualSummary(payments) });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching annual summary", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/progress (Backward compatibility)
const getProgress = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const totals = buildOverallTotals(taxpayer, payments);
    res.json({
      totalDue: totals.totalTaxAmount,
      totalPaid: totals.totalPaid,
      outstanding: totals.totalOutstanding,
      percentage: totals.paymentProgress,
      status: totals.overallStatus,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching progress", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/payments (Backward compatibility)
const getPaymentHistory = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching payment history", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/ai-analysis (Backward compatibility)
const getAIAnalysis = async (req, res) => {
  return getCompliance(req, res);
};

module.exports = {
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
};