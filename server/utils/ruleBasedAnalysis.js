/**
 * Pure deterministic rule-based analysis engine.
 * Guarantees factually accurate output based strictly on MongoDB dataset.
 */
const generateRuleBasedAnalysis = (taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals) => {
  const { totalTaxAmount, totalPaid, totalOutstanding, paymentProgress, overallStatus } = overallTotals;
  const taxpayerName = taxpayer.name;

  let complianceLevel = "MEDIUM";
  let paymentPattern = "";
  let paymentConsistency = "";
  let outstandingTrend = "";
  let historicalCompliance = "";
  let currentStatusText = "";
  let recommendation = "";

  const totalYears = annualSummary.length;
  const paidYears = annualSummary.filter((y) => y.status === "Paid").length;
  const unpaidYears = annualSummary.filter((y) => y.status === "Unpaid").length;

  if (overallStatus === "TAX PAYER") {
    complianceLevel = "HIGH";
    paymentPattern = `${taxpayerName} maintains a highly regular and punctual tax payment behavior across all recorded banks and financial years.`;
    paymentConsistency = `Payments are consistently completed in full for every financial period.`;
    outstandingTrend = `Outstanding tax is ₹0, showing zero accumulation of unpaid property tax obligations over time.`;
    historicalCompliance = `Historical payment record is exemplary with 100% compliance across all ${totalYears} financial years.`;
    currentStatusText = `All current-year and historical tax obligations have been fully satisfied.`;
    recommendation = `Continue making property tax payments within the applicable payment period to maintain the current HIGH compliance level.`;
  } else if (overallStatus === "PARTIALLY PAID") {
    complianceLevel = "MEDIUM";
    paymentPattern = `${taxpayerName} has demonstrated partial payment compliance. Payments have been submitted for certain periods or banks, but full obligations remain incomplete.`;
    paymentConsistency = `Payment consistency is moderate, with partial payments recorded in recent financial terms.`;
    outstandingTrend = `An outstanding tax balance of ₹${totalOutstanding.toLocaleString("en-IN")} remains due across active bank accounts.`;
    historicalCompliance = `${paidYears} of ${totalYears} financial years are fully paid, while pending balances exist for remaining terms.`;
    currentStatusText = `${taxpayerName} has completed ${paymentProgress}% of overall property tax obligations (Paid ₹${totalPaid.toLocaleString("en-IN")} out of ₹${totalTaxAmount.toLocaleString("en-IN")}).`;
    recommendation = `The taxpayer should complete the remaining outstanding payment of ₹${totalOutstanding.toLocaleString("en-IN")} to avoid statutory late fees and achieve full tax compliance.`;
  } else {
    // NON-TAX PAYER
    complianceLevel = "LOW";
    paymentPattern = `No property tax payments have been recorded for ${taxpayerName} across any bank accounts or monthly periods.`;
    paymentConsistency = `Payment consistency is non-existent as no transactions have been processed.`;
    outstandingTrend = `Outstanding tax obligation is at maximum (₹${totalOutstanding.toLocaleString("en-IN")}), showing an unresolved balance for all tracked periods.`;
    historicalCompliance = `Non-compliant across all ${totalYears} financial years with 0% historical tax remittance.`;
    currentStatusText = `Status: NON-TAX PAYER. Full tax liability of ₹${totalTaxAmount.toLocaleString("en-IN")} remains entirely unpaid.`;
    recommendation = `The taxpayer should be urgently notified about the outstanding property tax of ₹${totalOutstanding.toLocaleString("en-IN")} and encouraged to initiate payment immediately.`;
  }

  // Factual human readable AI summary based strictly on MongoDB data
  const summaryText = `Taxpayer ${taxpayerName} owns a ${taxpayer.propertyType} property located at ${taxpayer.propertyAddress} valued at ₹${taxpayer.propertyValue.toLocaleString("en-IN")}. The current total tax due is ₹${totalTaxAmount.toLocaleString("en-IN")}, with ₹${totalPaid.toLocaleString("en-IN")} paid to date and an outstanding balance of ₹${totalOutstanding.toLocaleString("en-IN")}. Overall payment progress is ${paymentProgress}%, establishing a tax status of "${overallStatus}".`;

  const { generateSurveyRecommendations } = require("./surveyRecommendationService");
  const surveyRecommendations = generateSurveyRecommendations(taxpayer, overallTotals, monthlySummary, complianceLevel);
  const officerReviewRequired = surveyRecommendations.some((r) => r.type === "Officer review" || r.priority === "HIGH");

  return {
    complianceLevel,
    summaryText,
    paymentPattern,
    paymentConsistency,
    outstandingTrend,
    historicalCompliance,
    currentStatusText,
    recommendation,
    surveyRecommendations,
    officerReviewRequired,
    source: "rule-based",
  };
};

module.exports = generateRuleBasedAnalysis;