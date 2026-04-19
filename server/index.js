import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// simple health check (useful for debugging)
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing text" });
    }

    const prompt = `
You are a scam detection system.

Analyze the following message and return ONLY valid JSON:

{
  "verdict": "safe" | "suspicious" | "scam",
  "severity": number (0-100),
  "reasons": string[]
}

Rules:
- scam = clear fraud
- suspicious = uncertain / risky
- safe = harmless
- reasons must be short (max 10 words each)
- max 4 reasons

Text:
"""${text}"""
`;

    const result = await model.generateContent(prompt);
    let raw = result.response.text();

    // 🧹 Clean Gemini markdown formatting (VERY IMPORTANT)
    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Parse error:", raw);

      return res.json({
        verdict: "suspicious",
        severity: 50,
        reasons: ["AI response parsing failed"],
      });
    }

    // sanitize output
    const severity = Math.max(
      0,
      Math.min(100, Number(parsed.severity) || 0)
    );

    const verdict =
      parsed.verdict === "safe" ||
      parsed.verdict === "suspicious" ||
      parsed.verdict === "scam"
        ? parsed.verdict
        : severity >= 55
        ? "scam"
        : severity >= 25
        ? "suspicious"
        : "safe";

    res.json({
      verdict,
      severity,
      reasons: Array.isArray(parsed.reasons)
        ? parsed.reasons.slice(0, 4)
        : [],
    });
  } catch (err) {
    console.error("AI ERROR:", err);

    // Rate limit handling
    if (err.status === 429) {
      return res.status(429).json({
        error: "RATE_LIMIT",
        message: "Too many requests, wait a minute",
      });
    }

    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(8787, () => {
  console.log("Server running on http://localhost:8787");
});