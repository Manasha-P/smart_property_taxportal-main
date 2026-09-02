const mongoose = require("mongoose");

const taxPaymentSchema = new mongoose.Schema(
  {
    taxpayerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Taxpayer",
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    financialYear: {
      type: String, // e.g. "2024-25"
      required: true,
    },
    month: {
      type: String, // e.g. "April", "May", "June", "July"
    },
    taxDue: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Paid", "Partially Paid", "Unpaid"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxPayment", taxPaymentSchema);