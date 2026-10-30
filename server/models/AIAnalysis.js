const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    taxpayerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Taxpayer",
      required: true,
      unique: true, // one cached analysis per taxpayer
    },
    complianceLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW", "High", "Medium", "Low"],
      required: true,
    },
    summaryText: {
      type: String,
    },
    paymentPattern: {
      type: String,
      required: true,
    },
    paymentConsistency: {
      type: String,
    },
    outstandingTrend: {
      type: String,
    },
    historicalCompliance: {
      type: String,
    },
    currentStatusText: {
      type: String,
    },
    recommendation: {
      type: String,
      required: true,
    },
    dataHash: {
      type: String,
      default: "",
    },
    surveyRecommendations: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: [
            "Payment reminder",
            "Document verification",
            "Property assessment survey",
            "Payment reconciliation",
            "Routine monitoring",
            "Officer review",
          ],
          required: true,
        },
        reason: { type: String, required: true },
        evidence: { type: String, default: "" },
        financialCalculation: { type: String, default: "" },
        priority: {
          type: String,
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "MEDIUM",
        },
        proposedAction: { type: String, required: true },
        responsibleDepartment: { type: String, default: "Municipal Revenue Directorate" },
        recommendedFollowUpDate: { type: String, default: "" },
      },
    ],
    officerReviewRequired: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 1,
    },
    source: {
      type: String,
      enum: ["ai-api", "rule-based"],
      default: "rule-based",
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIAnalysis", aiAnalysisSchema);