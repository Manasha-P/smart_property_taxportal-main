const mongoose = require("mongoose");
const Taxpayer = require("../models/Taxpayer");
const TaxPayment = require("../models/TaxPayment");
const standaloneStore = require("./standaloneStore");

/**
 * Data Provider Layer
 * Decouples database queries from business logic / controllers.
 * Robust fallback to standaloneStore when MongoDB is not connected or empty.
 */
class TaxpayerDataProvider {
  static async getTaxpayerByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim();

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        let taxpayer = await Taxpayer.findOne({ aadhaarDemoId: new RegExp(`^${clean}$`, "i") });
        if (taxpayer) return taxpayer;

        taxpayer = await Taxpayer.findOne({ numericAadhaar: clean });
        if (taxpayer) return taxpayer;

        taxpayer = await Taxpayer.findOne({ propertyId: new RegExp(`^${clean}$`, "i") });
        if (taxpayer) return taxpayer;

        if (clean.match(/^[0-9a-fA-F]{24}$/)) {
          taxpayer = await Taxpayer.findById(clean);
          if (taxpayer) return taxpayer;
        }
      } catch (err) {
        console.warn("Mongoose query fallback:", err.message);
      }
    }

    return standaloneStore.findTaxpayer(clean);
  }

  static async getTaxpayerByAadhaar(aadhaarDemoId) {
    return this.getTaxpayerByIdentifier(aadhaarDemoId);
  }

  static async getPaymentsByTaxpayerId(taxpayerId) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const payments = await TaxPayment.find({ taxpayerId }).sort({ financialYear: 1, month: 1, paymentDate: 1 });
        if (payments && payments.length > 0) return payments;
      } catch (err) {
        console.warn("Mongoose payments fallback:", err.message);
      }
    }
    return standaloneStore.getPayments(taxpayerId);
  }

  static async getAllTaxpayers() {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const taxpayers = await Taxpayer.find({});
        if (taxpayers && taxpayers.length > 0) return taxpayers;
      } catch (err) {
        console.warn("Mongoose getAllTaxpayers fallback:", err.message);
      }
    }
    return standaloneStore.getAllTaxpayers();
  }

  static async getAllPayments() {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const payments = await TaxPayment.find({});
        if (payments && payments.length > 0) return payments;
      } catch (err) {
        console.warn("Mongoose getAllPayments fallback:", err.message);
      }
    }
    return standaloneStore.getAllPayments();
  }
}

module.exports = TaxpayerDataProvider;
