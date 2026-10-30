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
} from "./data.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname.replace(/\/$/, "");
  const searchParams = url.searchParams;

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  try {
    if (pathname === "/api/health" || pathname === "/api") {
      return res.status(200).json({
        status: "ok",
        message: "AI-Based Property Tax Portal API running on Vercel Cloud Serverless Backend",
        timestamp: new Date().toISOString(),
      });
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const { email, password } = body;
      if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
      }
      const cleanEmail = email.trim();
      const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName =
        namePart
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") || "Municipal Officer";

      return res.status(200).json({
        _id: "demo_officer_01",
        name: formattedName,
        email: cleanEmail,
        role: "officer",
        token: "officer_session_token_" + Date.now(),
      });
    }

    if (pathname === "/api/auth/register" && req.method === "POST") {
      const { name, email } = body;
      return res.status(201).json({
        _id: "demo_officer_" + Date.now(),
        name: name ? name.trim() : "Municipal Officer",
        email: email ? email.trim() : "officer@revenue.gov.in",
        role: "officer",
        token: "officer_session_token_" + Date.now(),
      });
    }

    if (pathname === "/api/taxpayers/search" && req.method === "POST") {
      const identifier = body.identifier || body.aadhaar;
      if (!identifier) {
        return res.status(400).json({ message: "Please enter a valid 12-digit Aadhaar UID number." });
      }
      const tp = mockFindTaxpayer(identifier);
      if (!tp) {
        return res.status(404).json({
          message: "Taxpayer record not found in demonstration registry. Please verify the 12-digit Aadhaar UID.",
        });
      }
      return res.status(200).json({
        success: true,
        recordId: tp.aadhaarDemoId,
        name: tp.name,
        propertyId: tp.propertyId,
        propertyType: tp.propertyType,
      });
    }

    if (pathname === "/api/taxpayer/admin/overview" || pathname === "/api/taxpayers/admin/overview") {
      return res.status(200).json(mockGetAdminOverview());
    }

    const overviewMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/tax-overview$/);
    if (overviewMatch) {
      const recordId = overviewMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer record not found." });
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
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

    const monthlyMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/monthly-analysis$/);
    if (monthlyMatch) {
      const recordId = monthlyMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      let payments = mockGetPayments(recordId);
      const statusParam = searchParams.get("status");
      if (statusParam && statusParam !== "All") {
        payments = payments.filter((p) => p.status === statusParam);
      }
      const months = mockBuildMonthlySummary(payments);
      const totals = mockBuildOverallTotals(tp, payments);
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

    const annualMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/annual-analysis$/);
    if (annualMatch) {
      const recordId = annualMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      const payments = mockGetPayments(recordId);
      const years = mockBuildAnnualSummary(payments);
      const totals = mockBuildOverallTotals(tp, payments);
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

    const bankMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/bank-records$/);
    if (bankMatch) {
      const recordId = bankMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      let payments = mockGetPayments(recordId);
      const bankParam = searchParams.get("bank");
      const statusParam = searchParams.get("status");
      if (bankParam && bankParam !== "All") {
        payments = payments.filter((p) => p.bankName === bankParam);
      }
      if (statusParam && statusParam !== "All") {
        payments = payments.filter((p) => (p.transactionStatus || p.status) === statusParam);
      }
      const bankSummary = mockBuildBankSummary(payments);
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

    const complianceMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/compliance$/);
    if (complianceMatch) {
      const recordId = complianceMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      return res.status(200).json(mockGenerateCompliance(tp, totals));
    }

    const complianceAnalyzeMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/compliance\/analyze$/);
    if (complianceAnalyzeMatch) {
      const recordId = complianceAnalyzeMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
      return res.status(200).json({ ...mockGenerateCompliance(tp, totals), refreshed: true });
    }

    const reportMatch = pathname.match(/^\/api\/taxpayers\/([^/]+)\/report$/);
    if (reportMatch) {
      const recordId = reportMatch[1];
      const tp = mockFindTaxpayer(recordId);
      if (!tp) return res.status(404).json({ message: "Taxpayer not found" });
      const payments = mockGetPayments(recordId);
      const totals = mockBuildOverallTotals(tp, payments);
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

    return res.status(404).json({ message: `API route ${pathname} not found` });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
