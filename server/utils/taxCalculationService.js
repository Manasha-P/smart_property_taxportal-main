/**
 * Tax Calculation Service
 * Centralized, decimal-safe financial calculation engine for the Municipal Property Tax Portal.
 */

// Helper to round currency amounts safely to 2 decimal places
const roundCurrency = (val) => Math.round((Number(val) || 0) * 100) / 100;

// Filter only valid confirmed payment transactions and avoid double counting
const getValidConfirmedPayments = (payments = []) => {
  const seenTxnRefs = new Set();
  const valid = [];

  for (const p of payments) {
    // Exclude explicitly failed or cancelled transactions
    if (p.transactionStatus === "Failed" || p.transactionStatus === "Cancelled") {
      continue;
    }

    // Deduplicate confirmed transaction references if present
    if (p.transactionRef) {
      if (seenTxnRefs.has(p.transactionRef)) {
        continue;
      }
      seenTxnRefs.add(p.transactionRef);
    }

    valid.push(p);
  }

  return valid;
};

// Groups valid payment records by financial year and derives totals & trends
const buildAnnualSummary = (payments = []) => {
  const validPayments = getValidConfirmedPayments(payments);
  const yearMap = {};

  validPayments.forEach((p) => {
    const fy = p.financialYear || "2024-25";
    if (!yearMap[fy]) {
      yearMap[fy] = {
        financialYear: fy,
        taxDue: 0,
        taxPaid: 0,
        completedPaymentsCount: 0,
        overdueCount: 0,
      };
    }
    yearMap[fy].taxDue += roundCurrency(p.taxDue);
    yearMap[fy].taxPaid += roundCurrency(p.amountPaid);
    if (p.status === "Paid" || (p.amountPaid > 0 && p.amountPaid >= p.taxDue)) {
      yearMap[fy].completedPaymentsCount += 1;
    } else if (p.status === "Unpaid" || p.status === "Partially Paid") {
      yearMap[fy].overdueCount += 1;
    }
  });

  const sortedYears = Object.values(yearMap)
    .map((y) => {
      const taxDue = roundCurrency(y.taxDue);
      const taxPaid = roundCurrency(y.taxPaid);
      const outstanding = roundCurrency(Math.max(0, taxDue - taxPaid));
      const progressPercentage = taxDue === 0 ? 0 : roundCurrency((taxPaid / taxDue) * 100);

      let status = "Unpaid";
      if (taxPaid >= taxDue && taxDue > 0) status = "Paid";
      else if (taxPaid > 0) status = "Partially Paid";

      return {
        financialYear: y.financialYear,
        taxDue,
        taxPaid,
        outstanding,
        progressPercentage,
        completedPaymentsCount: y.completedPaymentsCount,
        overdueCount: y.overdueCount,
        status,
      };
    })
    .sort((a, b) => a.financialYear.localeCompare(b.financialYear));

  // Compute year-over-year comparison
  return sortedYears.map((y, idx) => {
    let yoyGrowth = null;
    if (idx > 0) {
      const prev = sortedYears[idx - 1];
      if (prev.taxPaid > 0) {
        yoyGrowth = roundCurrency(((y.taxPaid - prev.taxPaid) / prev.taxPaid) * 100);
      }
    }
    return {
      ...y,
      yoyGrowth,
    };
  });
};

// Groups payment records by simulated bank institution
const buildBankSummary = (payments = []) => {
  const bankMap = {};

  payments.forEach((p) => {
    const bankName = p.bankName || "State Bank of India";
    if (!bankMap[bankName]) {
      bankMap[bankName] = {
        bankName,
        taxAmount: 0,
        paidAmount: 0,
        confirmedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        reconciledAmount: 0,
        unreconciledAmount: 0,
      };
    }

    const isConfirmed = p.transactionStatus !== "Failed" && p.transactionStatus !== "Cancelled";
    bankMap[bankName].taxAmount += roundCurrency(p.taxDue);

    if (isConfirmed) {
      bankMap[bankName].paidAmount += roundCurrency(p.amountPaid);
      if (p.amountPaid > 0) {
        bankMap[bankName].confirmedCount += 1;
      }
      if (p.reconciliationStatus === "Reconciled") {
        bankMap[bankName].reconciledAmount += roundCurrency(p.amountPaid);
      } else {
        bankMap[bankName].unreconciledAmount += roundCurrency(p.amountPaid);
      }
    }

    if (p.transactionStatus === "Pending") {
      bankMap[bankName].pendingCount += 1;
    } else if (p.transactionStatus === "Failed" || p.transactionStatus === "Cancelled") {
      bankMap[bankName].failedCount += 1;
    }
  });

  return Object.values(bankMap).map((b) => {
    const taxAmount = roundCurrency(b.taxAmount);
    const paidAmount = roundCurrency(b.paidAmount);
    const outstanding = roundCurrency(Math.max(0, taxAmount - paidAmount));
    const recoveryRate = taxAmount === 0 ? 0 : roundCurrency((paidAmount / taxAmount) * 100);

    let status = "Unpaid";
    if (paidAmount >= taxAmount && taxAmount > 0) status = "Paid";
    else if (paidAmount > 0) status = "Partially Paid";

    return {
      bankName: b.bankName,
      taxAmount,
      paidAmount,
      outstanding,
      recoveryRate,
      confirmedCount: b.confirmedCount,
      pendingCount: b.pendingCount,
      failedCount: b.failedCount,
      reconciledAmount: roundCurrency(b.reconciledAmount),
      unreconciledAmount: roundCurrency(b.unreconciledAmount),
      status,
    };
  });
};

// Groups payment records by month in Indian fiscal year sequence
const buildMonthlySummary = (payments = []) => {
  const monthOrder = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];
  const monthMap = {};

  const validPayments = getValidConfirmedPayments(payments);

  validPayments.forEach((p) => {
    if (!p.month) return;
    const m = p.month;
    if (!monthMap[m]) {
      monthMap[m] = {
        month: m,
        taxDue: 0,
        taxPaid: 0,
        transactionCount: 0,
        dueDate: p.paymentDueDate || null,
        overdue: false,
      };
    }
    monthMap[m].taxDue += roundCurrency(p.taxDue);
    monthMap[m].taxPaid += roundCurrency(p.amountPaid);
    monthMap[m].transactionCount += 1;
    if (p.paymentDueDate && new Date(p.paymentDueDate) < new Date() && p.amountPaid < p.taxDue) {
      monthMap[m].overdue = true;
    }
  });

  return Object.values(monthMap)
    .map((m) => {
      const taxDue = roundCurrency(m.taxDue);
      const taxPaid = roundCurrency(m.taxPaid);
      const outstanding = roundCurrency(Math.max(0, taxDue - taxPaid));
      const paymentPercentage = taxDue === 0 ? 0 : roundCurrency((taxPaid / taxDue) * 100);

      let status = "Unpaid";
      if (taxPaid >= taxDue && taxDue > 0) status = "Paid";
      else if (taxPaid > 0) status = "Partially Paid";

      return {
        month: m.month,
        taxDue,
        taxPaid,
        outstanding,
        paymentPercentage,
        transactionCount: m.transactionCount,
        dueDate: m.dueDate,
        isOverdue: m.overdue,
        status,
      };
    })
    .sort((a, b) => {
      const idxA = monthOrder.indexOf(a.month);
      const idxB = monthOrder.indexOf(b.month);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });
};

// Overall totals across all payments with deterministic classification
const buildOverallTotals = (taxpayer, payments = []) => {
  const validPayments = getValidConfirmedPayments(payments);

  let totalTaxAmount = validPayments.reduce((sum, p) => sum + roundCurrency(p.taxDue), 0);
  const totalPaid = validPayments.reduce((sum, p) => sum + roundCurrency(p.amountPaid), 0);

  // If taxpayer has a statutory annualAssessedTax and current year payments exist, reconcile
  if (taxpayer && taxpayer.annualAssessedTax && totalTaxAmount < taxpayer.annualAssessedTax) {
    totalTaxAmount = roundCurrency(taxpayer.annualAssessedTax);
  }

  totalTaxAmount = roundCurrency(totalTaxAmount);
  const totalPaidClean = roundCurrency(totalPaid);
  const totalOutstanding = roundCurrency(Math.max(0, totalTaxAmount - totalPaidClean));
  const paymentProgress = totalTaxAmount === 0 ? 0 : roundCurrency((totalPaidClean / totalTaxAmount) * 100);

  // Count confirmed and pending/missed periods
  const completedPaymentsCount = validPayments.filter((p) => p.amountPaid > 0 && p.amountPaid >= p.taxDue).length;
  const partialPaymentsCount = validPayments.filter((p) => p.amountPaid > 0 && p.amountPaid < p.taxDue).length;
  const missedInstalmentsCount = validPayments.filter((p) => p.taxDue > 0 && p.amountPaid === 0).length;

  // Strict deterministic classification
  let overallStatus = "NON-TAX PAYER";
  if (totalPaidClean >= totalTaxAmount && totalTaxAmount > 0) {
    overallStatus = "TAX PAYER";
  } else if (totalPaidClean > 0) {
    overallStatus = "PARTIALLY PAID";
  }

  return {
    totalTaxAmount,
    totalPaid: totalPaidClean,
    totalOutstanding,
    paymentProgress,
    completedPaymentsCount,
    partialPaymentsCount,
    missedInstalmentsCount,
    overallStatus,
  };
};

// Data quality & reconciliation alerts detection
const detectQualityAlerts = (taxpayer, payments = [], overallTotals = {}) => {
  const alerts = [];

  // Check documentation discrepancy
  if (taxpayer?.hasDocumentationDiscrepancy) {
    alerts.push({
      type: "DOCUMENT_DISCREPANCY",
      severity: "WARNING",
      title: "Property Documentation Discrepancy",
      message: taxpayer.discrepancyNotes || "Title deed or building permit documents require municipal verification.",
    });
  }

  // Check physical assessment discrepancy
  if (taxpayer?.hasAssessmentDiscrepancy) {
    alerts.push({
      type: "ASSESSMENT_DISCREPANCY",
      severity: "CRITICAL",
      title: "Property Assessment Variance Detected",
      message: taxpayer.discrepancyNotes || "Discrepancy noted between recorded built-up area and aerial GIS survey.",
    });
  }

  // Check for overdue instalments
  const overdueRecords = payments.filter(
    (p) => p.paymentDueDate && new Date(p.paymentDueDate) < new Date() && p.amountPaid < p.taxDue
  );
  if (overdueRecords.length > 0) {
    alerts.push({
      type: "OVERDUE_INSTALMENTS",
      severity: "WARNING",
      title: `${overdueRecords.length} Overdue Tax Instalment(s)`,
      message: `Statutory payment deadlines have elapsed for ${overdueRecords.length} quarterly/monthly instalment(s).`,
    });
  }

  // Check for unreconciled or pending bank payments
  const unreconciled = payments.filter((p) => p.reconciliationStatus === "Unreconciled" || p.transactionStatus === "Pending");
  if (unreconciled.length > 0) {
    alerts.push({
      type: "BANK_RECONCILIATION_PENDING",
      severity: "INFO",
      title: `${unreconciled.length} Pending Bank Reconciliation Item(s)`,
      message: "Simulated bank payment clearances are currently undergoing inter-bank clearance settlement.",
    });
  }

  // Check for failed transactions
  const failed = payments.filter((p) => p.transactionStatus === "Failed");
  if (failed.length > 0) {
    alerts.push({
      type: "FAILED_TRANSACTION",
      severity: "WARNING",
      title: `${failed.length} Failed Electronic Remittance(s)`,
      message: "Electronic payment attempts were rejected by the issuing gateway and are excluded from completed revenue.",
    });
  }

  return alerts;
};

module.exports = {
  roundCurrency,
  getValidConfirmedPayments,
  buildAnnualSummary,
  buildBankSummary,
  buildMonthlySummary,
  buildOverallTotals,
  detectQualityAlerts,
};
