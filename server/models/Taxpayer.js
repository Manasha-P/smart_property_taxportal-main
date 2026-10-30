const mongoose = require("mongoose");

const taxpayerSchema = new mongoose.Schema(
  {
    aadhaarDemoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
      unique: true,
    },
    propertyAddress: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial", "Agricultural", "Industrial"],
      default: "Residential",
    },
    propertyValue: {
      type: Number,
      required: true,
    },
    numericAadhaar: {
      type: String,
      trim: true,
      index: true,
    },
    propertyUsage: {
      type: String,
      enum: ["Owner Occupied", "Rented/Leased", "Mixed Use", "Vacant Land", "Commercial Operations"],
      default: "Owner Occupied",
    },
    propertyAreaSqFt: {
      type: Number,
      default: 1200,
    },
    annualAssessedTax: {
      type: Number,
      default: 0,
    },
    assessmentYear: {
      type: String,
      default: "2024-25",
    },
    hasDocumentationDiscrepancy: {
      type: Boolean,
      default: false,
    },
    hasAssessmentDiscrepancy: {
      type: Boolean,
      default: false,
    },
    discrepancyNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Taxpayer", taxpayerSchema);