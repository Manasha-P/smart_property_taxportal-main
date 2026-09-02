const Taxpayer = require("../models/Taxpayer");
const TaxPayment = require("../models/TaxPayment");

/**
 * Data Provider Layer
 * Decouples database queries from business logic / controllers.
 * Future-ready abstraction: can be replaced with an external API data provider.
 */
class TaxpayerDataProvider {
  static async getTaxpayerByAadhaar(aadhaarDemoId) {
    return await Taxpayer.findOne({ aadhaarDemoId });
  }

  static async getPaymentsByTaxpayerId(taxpayerId) {
    return await TaxPayment.find({ taxpayerId }).sort({ financialYear: 1, month: 1 });
  }
}

module.exports = TaxpayerDataProvider;
