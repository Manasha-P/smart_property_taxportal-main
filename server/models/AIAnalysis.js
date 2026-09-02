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