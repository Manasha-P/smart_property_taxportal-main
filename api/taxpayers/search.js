import { mockFindTaxpayer } from "../data.js";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const identifier = body.identifier || body.aadhaar;
  if (!identifier) {
    return res.status(400).json({ message: "Please enter a valid 12-digit Aadhaar UID number." });
  }

  const tp = mockFindTaxpayer(identifier);
  if (!tp) {
    return res.status(404).json({
      message: "Taxpayer record not found in demonstration registry. Please verify the 12-digit Aadhaar UID.",
    });
  }

  return res.status(200).json({
    success: true,
    recordId: tp.aadhaarDemoId,
    name: tp.name,
    propertyId: tp.propertyId,
    propertyType: tp.propertyType,
  });
}
