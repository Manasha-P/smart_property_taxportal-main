import {
  mockFindTaxpayer,
  mockGetPayments,
  mockBuildOverallTotals,
  mockBuildMonthlySummary,
  mockBuildAnnualSummary,
  mockBuildBankSummary,
  mockDetectQualityAlerts,
  mockGenerateCompliance,
} from "../../data.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  const { recordId, action, bank, status } = req.query;
  const tp = mockFindTaxpayer(recordId);

  if (!tp) {
    return res.status(404).json({ message: "Taxpayer record not found." });
  }

  const payments = mockGetPayments(recordId);
  const totals = mockBuildOverallTotals(tp, payments);

  if (action === "tax-overview") {
    const alerts = mockDetectQualityAlerts(tp, payments, totals);
    return res.status(200).json({
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
    });
  }

  if (action === "monthly-analysis") {
    let filtered = payments;
    if (status && status !== "All") {
      filtered = payments.filter((p) => p.status === status);
    }
    const months = mockBuildMonthlySummary(filtered);
    return res.status(200).json({
      taxpayer: {
        name: tp.name,
        aadhaarDemoId: tp.aadhaarDemoId,
        propertyId: tp.propertyId,
        assessmentYear: tp.assessmentYear,
      },
      months,
      totals,
      financialYears: ["2024-25", "2023-24", "2022-23"],
    });
  }

  if (action === "annual-analysis") {
    const years = mockBuildAnnualSummary(payments);
    return res.status(200).json({
      taxpayer: {
        name: tp.name,
        aadhaarDemoId: tp.aadhaarDemoId,
        propertyId: tp.propertyId,
      },
      years,
      totals,
    });
  }

  if (action === "bank-records") {
    let filtered = payments;
    if (bank && bank !== "All") {
      filtered = filtered.filter((p) => p.bankName === bank);
    }
    if (status && status !== "All") {
      filtered = filtered.filter((p) => (p.transactionStatus || p.status) === status);
    }
    const bankSummary = mockBuildBankSummary(filtered);
    return res.status(200).json({
      taxpayer: {
        name: tp.name,
        aadhaarDemoId: tp.aadhaarDemoId,
        maskedAadhaar: `XXXX-XXXX-${tp.aadhaarDemoId.slice(-4)}`,
      },
      bankSummary,
      transactions: payments,
      supportedBanks: ["State Bank of India", "Indian Bank", "Bank of India"],
    });
  }

  if (action === "compliance") {
    return res.status(200).json(mockGenerateCompliance(tp, totals));
  }

  if (action === "report") {
    const months = mockBuildMonthlySummary(payments);
    const compliance = mockGenerateCompliance(tp, totals);
    return res.status(200).json({
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
    });
  }

  return res.status(404).json({ message: "Action not found" });
}
