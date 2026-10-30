// Pure deterministic mock data provider for seamless standalone deployment on Vercel
// Contains the 50 fictional taxpayers and calculations

const FICTIONAL_TAXPAYERS_BASE = [
  { name: "Arun Kumar", city: "Erode", street: "12 Gandhi Street", type: "Residential", usage: "Owner Occupied", val: 2800000, area: 1450, tax: 12000, scenario: 1 },
  { name: "Priya Raman", city: "Chennai", street: "45 Anna Nagar", type: "Residential", usage: "Owner Occupied", val: 3800000, area: 1800, tax: 18000, scenario: 2 },
  { name: "Suresh Babu", city: "Coimbatore", street: "7 Market Road", type: "Commercial", usage: "Commercial Operations", val: 6500000, area: 3200, tax: 36000, scenario: 8 },
  { name: "Lakshmi Narayanan", city: "Madurai", street: "23 Temple Street", type: "Residential", usage: "Rented/Leased", val: 2400000, area: 1250, tax: 10000, scenario: 6 },
  { name: "Kavitha Ramesh", city: "Salem", street: "9 Lake View Road", type: "Residential", usage: "Owner Occupied", val: 1900000, area: 1100, tax: 8000, scenario: 9 },
  { name: "Muthu Selvam", city: "Erode", street: "56 Farm Road", type: "Agricultural", usage: "Vacant Land", val: 1100000, area: 4500, tax: 6000, scenario: 3 },
  { name: "Anand Chandrasekar", city: "Chennai", street: "88 Mount Road", type: "Commercial", usage: "Commercial Operations", val: 8200000, area: 4100, tax: 44000, scenario: 1 },
  { name: "Deepa Krishnan", city: "Coimbatore", street: "14 Race Course Road", type: "Residential", usage: "Owner Occupied", val: 4200000, area: 2100, tax: 20000, scenario: 2 },
  { name: "Rajesh Kannan", city: "Madurai", street: "31 Palace Road", type: "Residential", usage: "Owner Occupied", val: 2100000, area: 1150, tax: 9500, scenario: 4 },
  { name: "Shanthi Natarajan", city: "Trichy", street: "5 Rockfort View", type: "Residential", usage: "Rented/Leased", val: 2600000, area: 1350, tax: 11000, scenario: 5 },
  { name: "Venkatesh Prasad", city: "Chennai", street: "17 Besant Avenue", type: "Residential", usage: "Owner Occupied", val: 5100000, area: 2400, tax: 24000, scenario: 1 },
  { name: "Meenakshi Sundaram", city: "Madurai", street: "4 North Veli Street", type: "Commercial", usage: "Mixed Use", val: 4900000, area: 2300, tax: 26000, scenario: 2 },
  { name: "Saravanan Murugan", city: "Salem", street: "62 Cherry Road", type: "Industrial", usage: "Commercial Operations", val: 7800000, area: 5500, tax: 42000, scenario: 7 },
  { name: "Bhuvaneshwari K", city: "Erode", street: "19 Perundurai Road", type: "Residential", usage: "Owner Occupied", val: 2200000, area: 1200, tax: 10000, scenario: 6 },
  { name: "Dinesh Karthik", city: "Coimbatore", street: "73 Avinashi Road", type: "Commercial", usage: "Commercial Operations", val: 7100000, area: 3600, tax: 38000, scenario: 8 },
  { name: "Geetha Govindarajan", city: "Chennai", street: "10 T Nagar Main Road", type: "Residential", usage: "Rented/Leased", val: 3400000, area: 1650, tax: 16000, scenario: 3 },
  { name: "Hariharan Subramanian", city: "Trichy", street: "28 Thillai Nagar", type: "Residential", usage: "Owner Occupied", val: 2900000, area: 1500, tax: 13000, scenario: 9 },
  { name: "Indira Parthasarathy", city: "Chennai", street: "52 Adyar Bridge Road", type: "Residential", usage: "Owner Occupied", val: 5600000, area: 2600, tax: 27000, scenario: 10 },
  { name: "Jayaprakash Narayanan", city: "Salem", street: "8 Bretts Road", type: "Residential", usage: "Owner Occupied", val: 1800000, area: 1050, tax: 8500, scenario: 4 },
  { name: "Karthik Raja", city: "Madurai", street: "90 West Masi Street", type: "Commercial", usage: "Commercial Operations", val: 5400000, area: 2700, tax: 29000, scenario: 5 },
  { name: "Lavanya Balaji", city: "Coimbatore", street: "36 Saibaba Colony", type: "Residential", usage: "Owner Occupied", val: 3100000, area: 1550, tax: 14000, scenario: 1 },
  { name: "Manikandan Ramanathan", city: "Erode", street: "41 Brough Road", type: "Residential", usage: "Owner Occupied", val: 2300000, area: 1250, tax: 10500, scenario: 2 },
  { name: "Nandhini Vijay", city: "Chennai", street: "64 Kilpauk Garden", type: "Residential", usage: "Owner Occupied", val: 4600000, area: 2200, tax: 22000, scenario: 7 },
  { name: "Om Prakash", city: "Trichy", street: "12 Cantonment High Rd", type: "Commercial", usage: "Commercial Operations", val: 6200000, area: 3100, tax: 33000, scenario: 6 },
  { name: "Pavithra Srinivasan", city: "Salem", street: "25 Omalur Main Road", type: "Residential", usage: "Owner Occupied", val: 2000000, area: 1100, tax: 9000, scenario: 8 },
  { name: "Raghavan Iyengar", city: "Madurai", street: "77 South Veli Street", type: "Residential", usage: "Owner Occupied", val: 2500000, area: 1300, tax: 11500, scenario: 3 },
  { name: "Sangeetha Mohan", city: "Coimbatore", street: "18 Peelamedu Road", type: "Residential", usage: "Rented/Leased", val: 3300000, area: 1600, tax: 15500, scenario: 9 },
  { name: "Thirunavukkarasu S", city: "Chennai", street: "39 Velachery Main Rd", type: "Residential", usage: "Owner Occupied", val: 4100000, area: 1950, tax: 19000, scenario: 10 },
  { name: "Uma Maheshwari", city: "Trichy", street: "82 KK Nagar", type: "Residential", usage: "Owner Occupied", val: 2700000, area: 1400, tax: 12500, scenario: 4 },
  { name: "Vignesh Shivan", city: "Erode", street: "15 Sathy Road", type: "Agricultural", usage: "Vacant Land", val: 1300000, area: 4800, tax: 7000, scenario: 5 },
  { name: "Aarthy Selvaraj", city: "Salem", street: "50 Meyyanur Bypass", type: "Residential", usage: "Owner Occupied", val: 2150000, area: 1150, tax: 9800, scenario: 1 },
  { name: "Balasubramanian T", city: "Chennai", street: "21 Mylapore Tank", type: "Residential", usage: "Owner Occupied", val: 4800000, area: 2300, tax: 23000, scenario: 2 },
  { name: "Chitra Durairaj", city: "Madurai", street: "43 Alagar Kovil Road", type: "Commercial", usage: "Mixed Use", val: 5100000, area: 2500, tax: 27000, scenario: 7 },
  { name: "Dhanalakshmi S", city: "Coimbatore", street: "69 Gandhipuram 4th St", type: "Commercial", usage: "Commercial Operations", val: 6700000, area: 3300, tax: 35000, scenario: 6 },
  { name: "Elango Pandian", city: "Trichy", street: "33 Woraiyur Bazaar", type: "Residential", usage: "Owner Occupied", val: 2400000, area: 1250, tax: 10800, scenario: 8 },
  { name: "Fathima Begum", city: "Chennai", street: "11 Triplicane High Rd", type: "Residential", usage: "Rented/Leased", val: 3200000, area: 1550, tax: 15000, scenario: 3 },
  { name: "Ganesan Muthusamy", city: "Erode", street: "92 Chennimalai Road", type: "Industrial", usage: "Commercial Operations", val: 8900000, area: 6000, tax: 48000, scenario: 9 },
  { name: "Hemalatha Sridhar", city: "Salem", street: "71 Fairlands Main Rd", type: "Residential", usage: "Owner Occupied", val: 2250000, area: 1200, tax: 10200, scenario: 10 },
  { name: "Ilayaraja Ilangovan", city: "Madurai", street: "16 Simmakkal Cross", type: "Residential", usage: "Owner Occupied", val: 2350000, area: 1250, tax: 10600, scenario: 4 },
  { name: "Jayashree Viswanathan", city: "Coimbatore", street: "84 R.S. Puram West", type: "Residential", usage: "Owner Occupied", val: 4500000, area: 2150, tax: 21000, scenario: 5 },
  { name: "Kannan Devaraj", city: "Chennai", street: "27 Nungambakkam High", type: "Commercial", usage: "Commercial Operations", val: 7600000, area: 3800, tax: 41000, scenario: 1 },
  { name: "Loganayaki R", city: "Trichy", street: "58 Srirangam North St", type: "Residential", usage: "Owner Occupied", val: 2800000, area: 1450, tax: 12800, scenario: 2 },
  { name: "Murugesan Arumugam", city: "Erode", street: "63 Nasiyanur Road", type: "Residential", usage: "Owner Occupied", val: 1950000, area: 1100, tax: 8800, scenario: 7 },
  { name: "Nalini Chandran", city: "Salem", street: "38 Hasthampatti", type: "Residential", usage: "Rented/Leased", val: 2450000, area: 1300, tax: 11200, scenario: 6 },
  { name: "Prabhakar Natarajan", city: "Chennai", street: "79 Porur Trunk Road", type: "Commercial", usage: "Commercial Operations", val: 5900000, area: 2950, tax: 31000, scenario: 8 },
  { name: "Rajeswari Annamalai", city: "Madurai", street: "22 Mattuthavani Link", type: "Residential", usage: "Owner Occupied", val: 2650000, area: 1350, tax: 11800, scenario: 3 },
  { name: "Senthil Nathan", city: "Coimbatore", street: "51 Singanallur Road", type: "Residential", usage: "Owner Occupied", val: 3050000, area: 1500, tax: 14200, scenario: 9 },
  { name: "Thenmozhi Kalidass", city: "Trichy", street: "74 Vayalur Road", type: "Residential", usage: "Owner Occupied", val: 2550000, area: 1300, tax: 11400, scenario: 10 },
  { name: "Udayakumar Ramasamy", city: "Chennai", street: "85 Chromepet GST Rd", type: "Industrial", usage: "Commercial Operations", val: 8100000, area: 5200, tax: 43000, scenario: 4 },
  { name: "Vasanthi Thangaraj", city: "Salem", street: "47 Suramangalam Main", type: "Residential", usage: "Owner Occupied", val: 2050000, area: 1150, tax: 9200, scenario: 5 },
];

const BANKS = ["State Bank of India", "Indian Bank", "Bank of India"];
const MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

// Generate deterministic records
const TAXPAYERS = FICTIONAL_TAXPAYERS_BASE.map((item, index) => {
  const idNum = 1001 + index;
  const demoId = `DEMO-${idNum}`;
  const numericAadhaar = `10010000${idNum}`;
  const propId = `PROP-${idNum}`;

  return {
    _id: `tp_${idNum}`,
    aadhaarDemoId: demoId,
    numericAadhaar,
    name: item.name,
    propertyId: propId,
    propertyAddress: `${item.street}, ${item.city}`,
    propertyType: item.type,
    propertyUsage: item.usage,
    propertyAreaSqFt: item.area,
    propertyValue: item.val,
    annualAssessedTax: item.tax,
    assessmentYear: "2024-25",
    scenario: item.scenario,
    hasAssessmentDiscrepancy: item.scenario === 8,
    hasDocumentationDiscrepancy: item.scenario === 9,
    discrepancyNotes: item.scenario === 8 
      ? `Satellite GIS imagery indicates unapproved constructed area (${item.area + 450} sq. ft vs recorded ${item.area} sq. ft).`
      : item.scenario === 9 
      ? "Parent title deed and registered building completion certificate require physical counter-attestation."
      : ""
  };
});

// Generate payments per taxpayer
const PAYMENTS_MAP = {};

TAXPAYERS.forEach((tp) => {
  const monthlyDue = Math.round(tp.annualAssessedTax / 12);
  const payments = [];

  MONTHS.forEach((month, idx) => {
    const bank = BANKS[idx % BANKS.length];
    const txnRef = `TXN-${bank.slice(0, 3).toUpperCase()}-2024${String(idx + 1).padStart(2, "0")}-${tp.aadhaarDemoId.slice(-4)}`;
    const dueDate = new Date(2024, 3 + idx, 15);
    const payDate = new Date(2024, 3 + idx, 10);

    let amtPaid = monthlyDue;
    let status = "Paid";

    if (tp.scenario === 3) {
      amtPaid = 0;
      status = "Unpaid";
    } else if (tp.scenario === 2 && idx >= 10) {
      amtPaid = 0;
      status = "Overdue";
    } else if (tp.scenario === 4 && idx % 3 === 0) {
      amtPaid = Math.round(monthlyDue * 0.5);
      status = "Partial";
    } else if (tp.scenario === 5 && idx % 2 === 1) {
      amtPaid = 0;
      status = "Unpaid";
    }

    payments.push({
      _id: `pay_${tp.aadhaarDemoId}_${idx}`,
      taxpayerId: tp._id,
      financialYear: "2024-25",
      month,
      bankName: bank,
      taxDue: monthlyDue,
      amountPaid: amtPaid,
      paymentDate: status !== "Unpaid" ? payDate.toISOString() : null,
      paymentDueDate: dueDate.toISOString(),
      transactionRef: txnRef,
      maskedAccount: `XXXX-XXXX-${3000 + idx}`,
      paymentPurpose: "Municipal Property Tax Instalment",
      status,
      transactionStatus: status === "Unpaid" ? "Pending" : "Success",
      reconciliationStatus: status === "Paid" ? "Reconciled" : "Pending",
    });
  });

  PAYMENTS_MAP[tp.aadhaarDemoId] = payments;
  PAYMENTS_MAP[tp.numericAadhaar] = payments;
});

// Helper calculators
const round = (val) => Math.round((Number(val) || 0) * 100) / 100;

export const mockFindTaxpayer = (identifier) => {
  if (!identifier) return null;
  const clean = String(identifier).trim().toUpperCase();
  return TAXPAYERS.find((t) => 
    t.aadhaarDemoId.toUpperCase() === clean || 
    t.numericAadhaar === clean || 
    t.propertyId.toUpperCase() === clean
  ) || null;
};

export const mockGetPayments = (identifier) => {
  const tp = mockFindTaxpayer(identifier);
  if (!tp) return [];
  return PAYMENTS_MAP[tp.aadhaarDemoId] || [];
};

export const mockBuildOverallTotals = (taxpayer, payments) => {
  const totalTaxAmount = taxpayer.annualAssessedTax;
  const totalPaid = payments.reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);
  const totalOutstanding = Math.max(0, totalTaxAmount - totalPaid);
  const paymentProgress = totalTaxAmount > 0 ? Math.min(100, round((totalPaid / totalTaxAmount) * 100)) : 100;

  let taxpayerStatus = "NON-TAX PAYER";
  if (totalOutstanding === 0 && totalPaid > 0) {
    taxpayerStatus = "TAX PAYER";
  } else if (totalPaid > 0 && totalOutstanding > 0) {
    taxpayerStatus = "PARTIALLY PAID";
  }

  const completedPaymentsCount = payments.filter((p) => p.status === "Paid").length;
  const missedInstalmentsCount = payments.filter((p) => p.status === "Overdue" || p.status === "Unpaid").length;

  return {
    totalTaxAmount: round(totalTaxAmount),
    totalPaid: round(totalPaid),
    totalOutstanding: round(totalOutstanding),
    paymentProgress,
    taxpayerStatus,
    completedPaymentsCount,
    missedInstalmentsCount,
  };
};

export const mockBuildMonthlySummary = (payments) => {
  return payments.map((p) => ({
    month: p.month,
    taxDue: round(p.taxDue),
    taxPaid: round(p.amountPaid),
    outstanding: round(Math.max(0, p.taxDue - p.amountPaid)),
    progress: p.taxDue > 0 ? Math.min(100, Math.round((p.amountPaid / p.taxDue) * 100)) : 100,
    status: p.status,
    bankName: p.bankName,
    paymentDate: p.paymentDate,
  }));
};

export const mockBuildAnnualSummary = (payments) => {
  const fyMap = {};
  payments.forEach((p) => {
    const fy = p.financialYear || "2024-25";
    if (!fyMap[fy]) {
      fyMap[fy] = { financialYear: fy, taxDue: 0, taxPaid: 0 };
    }
    fyMap[fy].taxDue += Number(p.taxDue) || 0;
    fyMap[fy].taxPaid += Number(p.amountPaid) || 0;
  });

  return Object.values(fyMap).map((item) => ({
    financialYear: item.financialYear,
    taxDue: round(item.taxDue),
    taxPaid: round(item.taxPaid),
    outstanding: round(Math.max(0, item.taxDue - item.taxPaid)),
    progress: item.taxDue > 0 ? Math.min(100, Math.round((item.taxPaid / item.taxDue) * 100)) : 100,
    status: item.taxPaid >= item.taxDue ? "Settled" : item.taxPaid > 0 ? "Partial" : "Unpaid",
  }));
};

export const mockBuildBankSummary = (payments) => {
  const bankMap = {};
  payments.forEach((p) => {
    const bank = p.bankName || "State Bank of India";
    if (!bankMap[bank]) {
      bankMap[bank] = { bankName: bank, totalDue: 0, totalPaid: 0, transactionCount: 0 };
    }
    bankMap[bank].totalDue += Number(p.taxDue) || 0;
    bankMap[bank].totalPaid += Number(p.amountPaid) || 0;
    bankMap[bank].transactionCount += 1;
  });

  return Object.values(bankMap).map((b) => ({
    bankName: b.bankName,
    totalDue: round(b.totalDue),
    totalPaid: round(b.totalPaid),
    outstanding: round(Math.max(0, b.totalDue - b.totalPaid)),
    progress: b.totalDue > 0 ? Math.min(100, Math.round((b.totalPaid / b.totalDue) * 100)) : 100,
    transactionCount: b.transactionCount,
    status: b.totalPaid >= b.totalDue ? "Settled" : "Pending",
  }));
};

export const mockDetectQualityAlerts = (taxpayer, payments, totals) => {
  const alerts = [];
  if (totals.totalOutstanding > 0) {
    alerts.push({
      type: "PAYMENT_OVERDUE",
      severity: "Warning",
      title: "Outstanding Municipal Arrears",
      message: `Taxpayer has ₹${totals.totalOutstanding.toLocaleString("en-IN")} pending in property tax dues.`,
    });
  }
  if (taxpayer.hasAssessmentDiscrepancy) {
    alerts.push({
      type: "GIS_SATELLITE_DISCREPANCY",
      severity: "Critical",
      title: "Unassessed Area Detected",
      message: taxpayer.discrepancyNotes || "Satellite cadastre imagery reveals constructed area mismatch.",
    });
  }
  if (taxpayer.hasDocumentationDiscrepancy) {
    alerts.push({
      type: "DOCUMENTATION_PENDING",
      severity: "Info",
      title: "Title Verification Advisory",
      message: taxpayer.discrepancyNotes || "Building completion certificate requires counter-verification.",
    });
  }
  return alerts;
};

export const mockGenerateCompliance = (taxpayer, totals) => {
  let complianceLevel = "MEDIUM";
  let summaryText = `Taxpayer ${taxpayer.name} has remitted ₹${totals.totalPaid.toLocaleString("en-IN")} of ₹${totals.totalTaxAmount.toLocaleString("en-IN")} due.`;
  
  if (totals.paymentProgress === 100) {
    complianceLevel = "HIGH";
    summaryText = `Taxpayer ${taxpayer.name} maintains an exemplary record with 100% tax clearance and zero outstanding arrears across all verified bank remittances.`;
  } else if (totals.totalPaid === 0) {
    complianceLevel = "LOW";
    summaryText = `Taxpayer ${taxpayer.name} has recorded zero payment against the assessed property liability for FY ${taxpayer.assessmentYear}. Immediate statutory notice required.`;
  }

  const surveyRecommendations = [];
  if (taxpayer.hasAssessmentDiscrepancy) {
    surveyRecommendations.push({
      title: "Physical GIS Cadastre Survey Directive",
      reason: "Satellite imagery reveals unrecorded constructed extension.",
      evidence: taxpayer.discrepancyNotes,
      financialCalculation: `Estimated unassessed tax differential: ₹${Math.round(taxpayer.annualAssessedTax * 0.35).toLocaleString("en-IN")}`,
      priority: "HIGH",
      proposedNextAction: "Dispatch Municipal Revenue Inspector for on-site physical measurement.",
      responsibleDepartment: "Directorate of Town Planning & Municipal Cadastre",
      recommendedFollowUpDate: "Within 15 days",
    });
  } else if (totals.totalOutstanding > 0) {
    surveyRecommendations.push({
      title: "Statutory Form-7 Demand Notice",
      reason: "Outstanding balance overdue past statutory settlement cycle.",
      evidence: `Cumulative unpaid balance: ₹${totals.totalOutstanding.toLocaleString("en-IN")}`,
      financialCalculation: `Statutory interest penalty (1.5%/month): ₹${Math.round(totals.totalOutstanding * 0.015).toLocaleString("en-IN")}`,
      priority: "MEDIUM",
      proposedNextAction: "Issue automated SMS e-Challan reminder and postal demand notice.",
      responsibleDepartment: "Revenue Recovery & Collection Division",
      recommendedFollowUpDate: "30 November 2026",
    });
  } else {
    surveyRecommendations.push({
      title: "Routine Cadastre Monitoring",
      reason: "Tax records reconciled in full with verified inter-bank CBS remittances.",
      evidence: "100% electronic payment clearance logged across partner banks.",
      financialCalculation: "Current balance: ₹0 (Nil Arrears)",
      priority: "LOW",
      proposedNextAction: "Maintain annual routine monitoring; issue Form-V tax clearance certificate.",
      responsibleDepartment: "Citizen Services & Digital Treasury Registry",
      recommendedFollowUpDate: "Next Fiscal Year Assessment Cycle",
    });
  }

  return {
    complianceLevel,
    summaryText,
    paymentPattern: totals.paymentProgress === 100 ? "Consistent Remittances" : "Irregular / Pending Clearance",
    paymentConsistency: totals.paymentProgress >= 80 ? "High" : totals.paymentProgress >= 40 ? "Moderate" : "Low",
    outstandingTrend: totals.totalOutstanding === 0 ? "Zero Arrears" : "Arrears Accumulated",
    historicalCompliance: totals.paymentProgress === 100 ? "Excellent" : "Under Scrutiny",
    currentStatusText: totals.taxpayerStatus,
    recommendation: totals.paymentProgress === 100 
      ? "Issue Form-V Tax Clearance Certificate with early payment rebate entitlement." 
      : "Issue statutory municipal payment notice under Section 114.",
    surveyRecommendations,
    officerReviewRequired: taxpayer.hasAssessmentDiscrepancy || totals.totalPaid === 0,
    source: "Rule-Based Statutory Audit Engine",
    generatedAt: new Date().toISOString(),
  };
};

export const mockGetAdminOverview = () => {
  let totalCityTaxDue = 0;
  let totalCityTaxPaid = 0;
  const complianceDistribution = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const bankMap = {
    "State Bank of India": { bankName: "State Bank of India", totalDue: 0, totalPaid: 0 },
    "Indian Bank": { bankName: "Indian Bank", totalDue: 0, totalPaid: 0 },
    "Bank of India": { bankName: "Bank of India", totalDue: 0, totalPaid: 0 },
  };

  TAXPAYERS.forEach((tp) => {
    const payments = PAYMENTS_MAP[tp.aadhaarDemoId] || [];
    const totals = mockBuildOverallTotals(tp, payments);
    totalCityTaxDue += totals.totalTaxAmount;
    totalCityTaxPaid += totals.totalPaid;

    if (totals.paymentProgress === 100) complianceDistribution.HIGH++;
    else if (totals.totalPaid > 0) complianceDistribution.MEDIUM++;
    else complianceDistribution.LOW++;

    payments.forEach((p) => {
      if (bankMap[p.bankName]) {
        bankMap[p.bankName].totalDue += Number(p.taxDue) || 0;
        bankMap[p.bankName].totalPaid += Number(p.amountPaid) || 0;
      }
    });
  });

  const totalCityOutstanding = Math.max(0, totalCityTaxDue - totalCityTaxPaid);
  const cityProgressPercentage = totalCityTaxDue > 0 ? round((totalCityTaxPaid / totalCityTaxDue) * 100) : 100;

  const bankCollections = Object.values(bankMap).map((b) => ({
    bankName: b.bankName,
    totalDue: round(b.totalDue),
    totalPaid: round(b.totalPaid),
    outstanding: round(Math.max(0, b.totalDue - b.totalPaid)),
    progress: b.totalDue > 0 ? Math.round((b.totalPaid / b.totalDue) * 100) : 100,
  }));

  const highRiskTaxpayers = TAXPAYERS.filter((tp) => tp.scenario === 3 || tp.scenario === 8).slice(0, 5).map((tp) => ({
    name: tp.name,
    aadhaarDemoId: tp.aadhaarDemoId,
    propertyId: tp.propertyId,
    city: tp.propertyAddress.split(", ").pop(),
    taxDue: tp.annualAssessedTax,
    taxPaid: 0,
    outstanding: tp.annualAssessedTax,
    complianceLevel: "LOW",
    reason: tp.hasAssessmentDiscrepancy ? "Satellite GIS Discrepancy" : "Zero Payment Recorded",
  }));

  return {
    summary: {
      totalTaxpayers: TAXPAYERS.length,
      totalCityTaxDue: round(totalCityTaxDue),
      totalCityTaxPaid: round(totalCityTaxPaid),
      totalCityOutstanding: round(totalCityOutstanding),
      cityProgressPercentage,
    },
    complianceDistribution,
    bankCollections,
    highRiskTaxpayers,
    surveyStats: {
      "Physical Land Survey": 8,
      "Demand Notice Issued": 14,
      "Title Deed Verification": 6,
      "Routine Clearance": 22,
    },
    officerAiRecommendations: [
      "Prioritize Section 120 on-site physical measurement for properties exhibiting satellite GIS carpet area discrepancies in Coimbatore and Chennai North.",
      "Dispatch automated electronic e-Challan payment links via SMS for taxpayers with outstanding balances in the 2024-25 fiscal period.",
      "Reconcile pending batch remittances across State Bank of India and Indian Bank CBS gateways prior to end of month fiscal settlement.",
    ],
  };
};
