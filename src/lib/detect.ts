import { ReportType, ClassifyResult } from "./types";

export function classify(text: string, type: ReportType): ClassifyResult {
  const input = text.toLowerCase();

  let score = 0;
  const reasons: string[] = [];
  const indicators: string[] = [];

  //  URGENCY
  if (/urgent|immediately|now|hurry|limited|final notice/.test(input)) {
    score += 20;
    reasons.push("Urgency language");
    indicators.push("Urgency");
  }

  //  MONEY / PAYMENT
  if (/pay|fee|payment|invoice|crypto|bitcoin/.test(input)) {
    score += 20;
    reasons.push("Requests payment");
    indicators.push("Payment request");
  }
  //  SUSPICIOUS LINKS
  if (/bit\.ly|tinyurl|\.xyz|\.top|\.click|\.ru/.test(input)) {
    score += 25;
    reasons.push("Suspicious link");
    indicators.push("Shortened URL");
  }

  // 🏦 IMPERSONATION
  if (/dhl|posten|fedex|dnb|bank|skatt|irs/.test(input)) {
    score += 15;
    reasons.push("Impersonates trusted service");
    indicators.push("Impersonation");
  }

  //  ACCOUNT THREATS
  if (/account|konto|locked|suspended|verify/.test(input)) {
    score += 15;
    reasons.push("Account threat");
    indicators.push("Threat");
  }

  //  PRIZES
  if (/won|winner|prize|gift/.test(input)) {
    score += 20;
    reasons.push("Too good to be true");
    indicators.push("Prize scam");
  }

  //  MANIPULATION
  if (/help me|urgent help|send money/.test(input)) {
    score += 25;
    reasons.push("Emotional manipulation");
    indicators.push("Manipulation");
  }

  // Clamp score
  score = Math.min(100, score);

  let verdict: "safe" | "suspicious" | "scam";

  if (score >= 60) verdict = "scam";
  else if (score >= 30) verdict = "suspicious";
  else verdict = "safe";

  return {
    verdict,
    severity: score,
    reasons,
    indicators,
    communityMatches: 0,
  };
}