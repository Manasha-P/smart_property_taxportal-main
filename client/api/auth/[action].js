export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  const { action } = req.query;
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  if (action === "login") {
    const { email } = body;
    const cleanEmail = email ? email.trim() : "officer@revenue.gov.in";
    const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Municipal Officer";

    return res.status(200).json({
      _id: "demo_officer_01",
      name: formattedName,
      email: cleanEmail,
      role: "officer",
      token: "officer_session_token_" + Date.now(),
    });
  }

  if (action === "register") {
    const { name, email } = body;
    return res.status(201).json({
      _id: "demo_officer_" + Date.now(),
      name: name ? name.trim() : "Municipal Officer",
      email: email ? email.trim() : "officer@revenue.gov.in",
      role: "officer",
      token: "officer_session_token_" + Date.now(),
    });
  }

  return res.status(404).json({ message: "Auth action not found" });
}
