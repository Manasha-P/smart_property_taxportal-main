const Anthropic = require("@anthropic-ai/sdk");
const generateRuleBasedAnalysis = require("./ruleBasedAnalysis");

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "your_key_here"
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const generateAIAnalysis = async (taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals) => {
  // If no valid Anthropic key is present, fallback immediately to rule-based analysis engine
  if (!anthropic) {
    console.log("No valid ANTHROPIC_API_KEY set — using rule-based fallback.");
    return generateRuleBasedAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);
  }

  try {
    const payload = {
      taxpayerInfo: {
        name: taxpayer.name,
        aadhaar: taxpayer.aadhaarDemoId,
        propertyId: taxpayer.propertyId,
        propertyAddress: taxpayer.propertyAddress,
        propertyType: taxpayer.propertyType,
        propertyValue: taxpayer.propertyValue,
      },
      overallTotals,
      annualSummary,
      monthlySummary,
      bankSummary,
    };

    const prompt = `You are an AI Compliance & Analytics Engine for a Government Property Tax Portal.
Analyze the following taxpayer profile retrieved directly from MongoDB:

${JSON.stringify(payload, null, 2)}

Instructions:
1. Base all numerical figures, tax amounts, bank names, and statuses STRICTLY on the data provided above. Do NOT invent or alter any figures.
2. Generate a JSON object containing:
{
  "complianceLevel": "HIGH" | "MEDIUM" | "LOW",
  "summaryText": "Human-readable summary describing taxpayer name, property type/address/value, tax due, paid amount, outstanding balance, progress %, and tax status.",
  "paymentPattern": "Factual 2-3 sentence analysis of taxpayer payment behavior across banks and periods.",
  "paymentConsistency": "Analysis of payment regularity every month/year.",
  "outstandingTrend": "Analysis of outstanding tax trend.",
  "historicalCompliance": "Multi-year compliance summary.",
  "currentStatusText": "Evaluation of current tax status.",
  "recommendation": "Clear actionable recommendation for the taxpayer or tax authorities."
}

Respond ONLY with valid JSON (no markdown wrapping).`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const { generateSurveyRecommendations } = require("./surveyRecommendationService");
    const surveyRecommendations = generateSurveyRecommendations(taxpayer, overallTotals, monthlySummary, parsed.complianceLevel);
    const officerReviewRequired = surveyRecommendations.some((r) => r.type === "Officer review" || r.priority === "HIGH");

    return {
      ...parsed,
      surveyRecommendations,
      officerReviewRequired,
      source: "ai-api",
    };
  } catch (err) {
    console.error("AI API call failed, using rule-based fallback:", err.message);
    return generateRuleBasedAnalysis(taxpayer, annualSummary, monthlySummary, bankSummary, overallTotals);
  }
};

module.exports = generateAIAnalysis;