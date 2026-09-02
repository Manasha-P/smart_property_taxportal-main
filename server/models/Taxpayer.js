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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Taxpayer", taxpayerSchema);