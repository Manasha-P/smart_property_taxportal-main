const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "smart_property_taxportal_default_secret_key_2026";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;