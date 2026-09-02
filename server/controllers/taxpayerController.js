const Taxpayer = require("../models/Taxpayer");
const TaxPayment = require("../models/TaxPayment");
const TaxpayerDataProvider = require("../utils/taxpayerDataProvider");
const AIAnalysis = require("../models/AIAnalysis");
const generateAIAnalysis = require("../utils/aiService");
const generateRuleBasedAnalysis = require("../utils/ruleBasedAnalysis");
const {
  buildAnnualSummary,
  buildBankSummary,
  buildMonthlySummary,
  buildOverallTotals,
  buildProgress,
} = require("../utils/taxCalculations");

// Helper: find taxpayer by demo Aadhaar ID or return null
const findTaxpayer = async (aadhaar, res) => {
  const taxpayer = await TaxpayerDataProvider.getTaxpayerByAadhaar(aadhaar);
  if (!taxpayer) {
    res.status(404).json({ message: "Taxpayer record not found. Please verify the Aadhaar Demo ID." });
    return null;
  }
  return taxpayer;
};

// @route GET /api/taxpayer/admin/overview
const getAdminOverview = async (req, res) => {
  try {
    const allTaxpayers = await Taxpayer.find({});
    const allPayments = await TaxPayment.find({});

    let totalCityTaxDue = 0;
    let totalCityTaxPaid = 0;

    allPayments.forEach((p) => {
      totalCityTaxDue += p.taxDue;
      totalCityTaxPaid += p.amountPaid;
    });

    const totalCityOutstanding = Math.max(0, totalCityTaxDue - totalCityTaxPaid);
    const cityProgressPercentage = totalCityTaxDue === 0 ? 0 : Math.round((totalCityTaxPaid / totalCityTaxDue) * 10000) / 100;

    // Per-taxpayer status & compliance classification
    let highComplianceCount = 0;
    let mediumComplianceCount = 0;
    let lowComplianceCount = 0;

    const highRiskTaxpayers = [];

    for (const tp of allTaxpayers) {
      const tpPayments = allPayments.filter((p) => p.taxpayerId.toString() === tp._id.toString());
      const totals = buildOverallTotals(tpPayments);

      if (totals.overallStatus === "TAX PAYER") {
        highComplianceCount++;
      } else if (totals.overallStatus === "PARTIALLY PAID") {
        mediumComplianceCount++;
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
    }

    // Bank-wide aggregated collections across municipality
    const bankMap = {};
    allPayments.forEach((p) => {
      const bank = p.bankName;
      if (!bankMap[bank]) {
        bankMap[bank] = { bankName: bank, totalDue: 0, totalPaid: 0 };
      }
      bankMap[bank].totalDue += p.taxDue;
      bankMap[bank].totalPaid += p.amountPaid;
    });

    const bankCollections = Object.values(bankMap).map((b) => ({
      bankName: b.bankName,
      totalDue: b.totalDue,
      totalPaid: b.totalPaid,
      outstanding: Math.max(0, b.totalDue - b.totalPaid),
      progress: b.totalDue === 0 ? 0 : Math.round((b.totalPaid / b.totalDue) * 10000) / 100,
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
      officerAiRecommendations: [
        `Prioritize official tax notices for ${lowComplianceCount} non-taxpayer account(s) carrying zero remittance history.`,
        `Send digital reminder notifications for ${mediumComplianceCount} partially paid account(s) to clear ₹${totalCityOutstanding.toLocaleString("en-IN")} in cumulative municipal outstanding dues.`,
        `Bank Remittance Alert: Monitor collections across State Bank, Indian Bank, and Bank of India to maintain digital revenue recovery.`,
      ],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching admin overview", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/full-profile
const getFullProfile = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const overallTotals = buildOverallTotals(payments);
    const annualSummary = buildAnnualSummary(payments);
    const bankSummary = buildBankSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);

    // AI Analysis Cache or Generation
    let cached = await AIAnalysis.findOne({ taxpayerId: taxpayer._id });
    let aiAnalysis = null;

    if (cached) {
      aiAnalysis = {
        complianceLevel: cached.complianceLevel,
        summaryText: cached.summaryText || generateRuleBasedAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals).summaryText,
        paymentPattern: cached.paymentPattern,
        paymentConsistency: cached.paymentConsistency || "Consistent payment history recorded.",
        outstandingTrend: cached.outstandingTrend || "Monitored historical trend.",
        historicalCompliance: cached.historicalCompliance || "Recorded compliance level.",
        currentStatusText: cached.currentStatusText || `Status: ${overallTotals.overallStatus}`,
        recommendation: cached.recommendation,
        source: cached.source,
        cached: true,
      };
    } else {
      aiAnalysis = await generateAIAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);
      try {
        await AIAnalysis.create({
          taxpayerId: taxpayer._id,
          complianceLevel: aiAnalysis.complianceLevel,
          summaryText: aiAnalysis.summaryText,
          paymentPattern: aiAnalysis.paymentPattern,
          paymentConsistency: aiAnalysis.paymentConsistency,
          outstandingTrend: aiAnalysis.outstandingTrend,
          historicalCompliance: aiAnalysis.historicalCompliance,
          currentStatusText: aiAnalysis.currentStatusText,
          recommendation: aiAnalysis.recommendation,
          source: aiAnalysis.source,
        });
      } catch (cacheErr) {
        console.warn("Notice: AI cache save skipped", cacheErr.message);
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
        propertyValue: taxpayer.propertyValue,
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

// @route GET /api/taxpayer/:aadhaar
const getTaxpayer = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const totals = buildOverallTotals(payments);

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

// @route GET /api/taxpayer/:aadhaar/banks
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

// @route GET /api/taxpayer/:aadhaar/monthly-summary
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

// @route GET /api/taxpayer/:aadhaar/annual-summary
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

// @route GET /api/taxpayer/:aadhaar/progress
const getProgress = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    res.json(buildProgress(payments));
  } catch (err) {
    res.status(500).json({ message: "Server error fetching progress", error: err.message });
  }
};

// @route GET /api/taxpayer/:aadhaar/payments
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

// @route GET /api/taxpayer/:aadhaar/ai-analysis
const getAIAnalysis = async (req, res) => {
  try {
    const taxpayer = await findTaxpayer(req.params.aadhaar, res);
    if (!taxpayer) return;

    const payments = await TaxpayerDataProvider.getPaymentsByTaxpayerId(taxpayer._id);
    const annualSummary = buildAnnualSummary(payments);
    const bankSummary = buildBankSummary(payments);
    const monthlySummary = buildMonthlySummary(payments);
    const overallTotals = buildOverallTotals(payments);

    let cached = await AIAnalysis.findOne({ taxpayerId: taxpayer._id });
    if (cached) {
      return res.json({
        complianceLevel: cached.complianceLevel,
        summaryText: cached.summaryText,
        paymentPattern: cached.paymentPattern,
        recommendation: cached.recommendation,
        source: cached.source,
        generatedAt: cached.generatedAt,
        cached: true,
      });
    }

    const analysis = await generateAIAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: "Server error generating AI analysis", error: err.message });
  }
};

module.exports = {
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