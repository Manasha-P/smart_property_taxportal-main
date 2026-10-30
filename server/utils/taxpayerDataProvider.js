const Taxpayer = require("../models/Taxpayer");
const TaxPayment = require("../models/TaxPayment");

/**
 * Data Provider Layer
 * Decouples database queries from business logic / controllers.
 * Future-ready abstraction: can be replaced with an external API data provider.
 */
class TaxpayerDataProvider {
  static async getTaxpayerByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim();

    // Check by aadhaarDemoId (case-insensitive)
    let taxpayer = await Taxpayer.findOne({ aadhaarDemoId: new RegExp(`^${clean}$`, "i") });
    if (taxpayer) return taxpayer;

    // Check by numericAadhaar
    taxpayer = await Taxpayer.findOne({ numericAadhaar: clean });
    if (taxpayer) return taxpayer;

    // Check by propertyId (case-insensitive)
    taxpayer = await Taxpayer.findOne({ propertyId: new RegExp(`^${clean}$`, "i") });
    if (taxpayer) return taxpayer;

    // Check by ObjectId if valid
    if (clean.match(/^[0-9a-fA-F]{24}$/)) {
      taxpayer = await Taxpayer.findById(clean);
      if (taxpayer) return taxpayer;
    }

    return null;
  }

  static async getTaxpayerByAadhaar(aadhaarDemoId) {
    return this.getTaxpayerByIdentifier(aadhaarDemoId);
  }

  static async getPaymentsByTaxpayerId(taxpayerId) {
    return await TaxPayment.find({ taxpayerId }).sort({ financialYear: 1, month: 1, paymentDate: 1 });
  }
}

module.exports = TaxpayerDataProvider;
