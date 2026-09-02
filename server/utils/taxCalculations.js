// Groups raw payment records by financial year and totals them
const buildAnnualSummary = (payments) => {
  const yearMap = {};

  payments.forEach((p) => {
    if (!yearMap[p.financialYear]) {
      yearMap[p.financialYear] = { financialYear: p.financialYear, taxDue: 0, taxPaid: 0 };
    }
    yearMap[p.financialYear].taxDue += p.taxDue;
    yearMap[p.financialYear].taxPaid += p.amountPaid;
  });

  return Object.values(yearMap)
    .map((y) => {
      const outstanding = Math.max(0, y.taxDue - y.taxPaid);
      const progressPercentage = y.taxDue === 0 ? 0 : Math.round((y.taxPaid / y.taxDue) * 10000) / 100;
      let status = "Unpaid";
      if (y.taxPaid >= y.taxDue && y.taxDue > 0) status = "Paid";
      else if (y.taxPaid > 0) status = "Partially Paid";

      return {
        ...y,
        outstanding,
        progressPercentage,
        status,
      };
    })
    .sort((a, b) => a.financialYear.localeCompare(b.financialYear));
};

// Groups payment records by bank (aggregating tax due, tax paid, outstanding, and status)
const buildBankSummary = (payments) => {
  const bankMap = {};

  payments.forEach((p) => {
    const bankName = p.bankName;
    if (!bankMap[bankName]) {
      bankMap[bankName] = {
        bankName,
        taxAmount: 0,
        paidAmount: 0,
      };
    }
    bankMap[bankName].taxAmount += p.taxDue;
    bankMap[bankName].paidAmount += p.amountPaid;
  });

  return Object.values(bankMap).map((b) => {
    const outstanding = Math.max(0, b.taxAmount - b.paidAmount);
    let status = "Unpaid";
    if (b.paidAmount >= b.taxAmount && b.taxAmount > 0) status = "Paid";
    else if (b.paidAmount > 0) status = "Partially Paid";

    return {
      bankName: b.bankName,
      taxAmount: b.taxAmount,
      paidAmount: b.paidAmount,
      outstanding,
      status,
    };
  });
};

// Groups payment records by month (e.g. April, May, June, July)
const buildMonthlySummary = (payments) => {
  const monthOrder = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
  const monthMap = {};

  payments.forEach((p) => {
    const month = p.month || "Current Month";
    if (!monthMap[month]) {
      monthMap[month] = { month, taxDue: 0, taxPaid: 0 };
    }
    monthMap[month].taxDue += p.taxDue;
    monthMap[month].taxPaid += p.amountPaid;
  });

  return Object.values(monthMap)
    .map((m) => {
      const outstanding = Math.max(0, m.taxDue - m.taxPaid);
      const paymentPercentage = m.taxDue === 0 ? 0 : Math.round((m.taxPaid / m.taxDue) * 10000) / 100;
      let status = "Unpaid";
      if (m.taxPaid >= m.taxDue && m.taxDue > 0) status = "Paid";
      else if (m.taxPaid > 0) status = "Partially Paid";

      return {
        month: m.month,
        taxDue: m.taxDue,
        taxPaid: m.taxPaid,
        outstanding,
        paymentPercentage,
        status,
      };
    })
    .sort((a, b) => {
      const idxA = monthOrder.indexOf(a.month);
      const idxB = monthOrder.indexOf(b.month);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });
};

// Overall totals across ALL years/banks/months
const buildOverallTotals = (payments) => {
  const totalTaxAmount = payments.reduce((sum, p) => sum + p.taxDue, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstanding = Math.max(0, totalTaxAmount - totalPaid);
  const paymentProgress = totalTaxAmount === 0 ? 0 : Math.round((totalPaid / totalTaxAmount) * 10000) / 100;

  // Exact prompt requirements for status:
  // Tax Paid = Tax Due -> TAX PAYER
  // 0 < Tax Paid < Tax Due -> PARTIALLY PAID
  // Tax Paid = 0 -> NON-TAX PAYER
  let overallStatus = "NON-TAX PAYER";
  if (totalPaid >= totalTaxAmount && totalTaxAmount > 0) {
    overallStatus = "TAX PAYER";
  } else if (totalPaid > 0) {
    overallStatus = "PARTIALLY PAID";
  }

  return {
    totalTaxAmount,
    totalPaid,
    totalOutstanding,
    paymentProgress,
    overallStatus,
  };
};

const buildProgress = (payments) => {
  const totals = buildOverallTotals(payments);
  return {
    totalDue: totals.totalTaxAmount,
    totalPaid: totals.totalPaid,
    outstanding: totals.totalOutstanding,
    percentage: totals.paymentProgress,
    status: totals.overallStatus,
  };
};

module.exports = {
  buildAnnualSummary,
  buildBankSummary,
  buildMonthlySummary,
  buildOverallTotals,
  buildProgress,
};