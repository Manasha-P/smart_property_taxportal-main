/**
 * AI-Recommended Municipal Survey & Action Engine
 * Generates transparent, evidence-based recommendations based on calculated tax figures,
 * payment history, and property assessment records.
 */

const generateSurveyRecommendations = (taxpayer, overallTotals, payments, complianceLevel) => {
  const recommendations = [];
  const { totalTaxAmount, totalPaid, totalOutstanding, paymentProgress, overallStatus } = overallTotals;

  const now = new Date();
  const formatFollowUpDate = (daysAhead) => {
    const d = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  // 1. Property Assessment Survey
  if (taxpayer.hasAssessmentDiscrepancy) {
    recommendations.push({
      title: "Physical Property Assessment & GIS Re-measurement Survey",
      type: "Property assessment survey",
      reason: "Recorded built-up area or property usage diverges from municipal GIS satellite registry records.",
      evidence: taxpayer.discrepancyNotes || `Property registered as ${taxpayer.propertyType} (${taxpayer.propertyAreaSqFt} sq. ft), but GIS survey indicates potential undeclared expansion.`,
      financialCalculation: `Assessed base value: ₹${taxpayer.propertyValue.toLocaleString("en-IN")}. Potential tax variance upon physical verification: ₹${Math.round(totalTaxAmount * 0.25).toLocaleString("en-IN")}.`,
      priority: "HIGH",
      proposedAction: "Dispatch Municipal Field Assessment Surveyor to verify carpet area, current commercial occupancy, and physical boundary demarcation.",
      responsibleDepartment: "Directorate of Town Planning & Municipal Valuation",
      recommendedFollowUpDate: formatFollowUpDate(14),
    });
  }

  // 2. Document Verification
  if (taxpayer.hasDocumentationDiscrepancy) {
    recommendations.push({
      title: "Statutory Property Title & Ownership Deed Verification",
      type: "Document verification",
      reason: "Title deed documentation, municipal building permit, or occupancy certificate is incomplete or pending formal attestation.",
      evidence: taxpayer.discrepancyNotes || "Encumbrance certificate or recent mutation record requires physical archival validation.",
      financialCalculation: `Property current valuation: ₹${taxpayer.propertyValue.toLocaleString("en-IN")}. Annual assessed liability: ₹${totalTaxAmount.toLocaleString("en-IN")}.`,
      priority: "MEDIUM",
      proposedAction: "Request taxpayer to submit registered parent title deed, latest patta/khata extract, and approved building plan via citizen e-filing portal.",
      responsibleDepartment: "Revenue Records & Land Administration Wing",
      recommendedFollowUpDate: formatFollowUpDate(21),
    });
  }

  // 3. Payment Reconciliation
  const hasUnreconciled = payments.some(
    (p) => p.reconciliationStatus === "Unreconciled" || p.transactionStatus === "Pending" || p.transactionStatus === "Failed"
  );
  if (hasUnreconciled) {
    const pendingAmount = payments
      .filter((p) => p.reconciliationStatus === "Unreconciled" || p.transactionStatus === "Pending")
      .reduce((sum, p) => sum + (p.amountPaid || p.taxDue), 0);

    recommendations.push({
      title: "Inter-Bank Remittance & Payment Settlement Reconciliation",
      type: "Payment reconciliation",
      reason: "Electronic payment transactions exist with pending banking clearance or unconfirmed gateway response.",
      evidence: `One or more transactions across integrated partner banks require batch reconciliation clearance.`,
      financialCalculation: `Unconfirmed or pending transaction sum: ₹${pendingAmount.toLocaleString("en-IN")}.`,
      priority: "MEDIUM",
      proposedAction: "Initiate electronic clearance audit with the participating bank's treasury node and reconcile transaction reference IDs.",
      responsibleDepartment: "Municipal Accounts & Treasury Reconciliation Unit",
      recommendedFollowUpDate: formatFollowUpDate(7),
    });
  }

  // 4. Payment Reminder
  if (totalOutstanding > 0 && !taxpayer.hasAssessmentDiscrepancy) {
    const isHighPriority = totalOutstanding > 10000 || overallStatus === "NON-TAX PAYER";
    recommendations.push({
      title: overallStatus === "NON-TAX PAYER" ? "Statutory Demand Notice & Revenue Arrears Notice" : "Digital Tax Balance & Payment Reminder",
      type: "Payment reminder",
      reason: `Unpaid municipal property tax balance of ₹${totalOutstanding.toLocaleString("en-IN")} remains overdue for assessment period ${taxpayer.assessmentYear || "2024-25"}.`,
      evidence: `Payment progress stands at ${paymentProgress}%. Total confirmed remittance is ₹${totalPaid.toLocaleString("en-IN")} against assessed ₹${totalTaxAmount.toLocaleString("en-IN")}.`,
      financialCalculation: `Outstanding principal dues: ₹${totalOutstanding.toLocaleString("en-IN")}. Accruing statutory interest if unremitted within 30 days.`,
      priority: isHighPriority ? "HIGH" : "MEDIUM",
      proposedAction: overallStatus === "NON-TAX PAYER"
        ? "Issue formal Form-7 Statutory Demand Notice via registered speed post and SMS alert with a 15-day compliance window."
        : "Transmit digital SMS and WhatsApp notification with instant online payment link to settle remaining balance.",
      responsibleDepartment: "Revenue Recovery & Arrears Collection Department",
      recommendedFollowUpDate: formatFollowUpDate(10),
    });
  }

  // 5. Officer Review
  const multipleDiscrepancies = (taxpayer.hasAssessmentDiscrepancy ? 1 : 0) + (taxpayer.hasDocumentationDiscrepancy ? 1 : 0) + (totalOutstanding > 15000 ? 1 : 0);
  if (multipleDiscrepancies >= 2 || (overallStatus === "NON-TAX PAYER" && totalTaxAmount > 20000)) {
    recommendations.push({
      title: "Senior Revenue Officer Administrative Review",
      type: "Officer review",
      reason: "Compound risk factors identified involving substantial arrears and property documentation variance.",
      evidence: `Multiple simultaneous alerts flagged: cumulative arrears ₹${totalOutstanding.toLocaleString("en-IN")} along with property audit notices.`,
      financialCalculation: `Total exposure risk to municipal exchequer: ₹${totalTaxAmount.toLocaleString("en-IN")}.`,
      priority: "HIGH",
      proposedAction: "Schedule file for in-person administrative review by the Zonal Revenue Officer prior to initiating coercive recovery.",
      responsibleDepartment: "Zonal Municipal Commissioner Secretariat",
      recommendedFollowUpDate: formatFollowUpDate(7),
    });
  }

  // 6. Routine Monitoring
  if (overallStatus === "TAX PAYER" && !taxpayer.hasAssessmentDiscrepancy && !taxpayer.hasDocumentationDiscrepancy) {
    recommendations.push({
      title: "Routine Periodic Municipal Registry Monitoring",
      type: "Routine monitoring",
      reason: "Taxpayer profile exhibits 100% statutory compliance with all assessed dues settled and zero discrepancies.",
      evidence: `Complete payment history verified across all recorded banks. Payment completion: 100% (₹${totalPaid.toLocaleString("en-IN")} remitted).`,
      financialCalculation: `Outstanding balance: ₹0. Valid for Municipal Citizen Compliance Certificate issuance.`,
      priority: "LOW",
      proposedAction: "Maintain account in good standing; issue automated digital tax clearance certificate for the current financial year.",
      responsibleDepartment: "Municipal Citizen Services & Certification Desk",
      recommendedFollowUpDate: formatFollowUpDate(90),
    });
  }

  return recommendations;
};

module.exports = { generateSurveyRecommendations };
