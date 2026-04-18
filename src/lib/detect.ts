import { ClassifyResult, ReportType, Verdict } from "./types";
import { findCommunity } from "./storage";

// Heuristic local detector — placeholder for the AI edge function.
// Returns the same shape the future Lovable AI call will return.
export function classify(input: string, type: ReportType): ClassifyResult {
  const text = input.trim();
  const lower = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];
  const indicators: string[] = [];

  const SCAM_WORDS = [
    "verify", "urgent", "suspend", "suspended", "click here", "won", "winner",
    "prize", "bitcoin", "crypto", "wallet", "bank", "password", "otp", "code",
    "delivery", "redeliver", "customs", "fee", "tax owed", "tax", "irs", "skatt",
    "pakke", "toll", "konto", "verifiser",
  ];
  const URL_RE = /(https?:\/\/|www\.|bit\.ly|tinyurl|t\.co|goo\.gl)\S+/i;
  const SUSPICIOUS_TLD = /\.(zip|xyz|top|click|country|gq|tk|ml|cf)\b/i;
  const LOOKALIKE = /(payp[a4]l|amaz[o0]n|app[l1]e|micr[o0]soft|netfl[i1]x|dhl|posten|fedex)/i;

  for (const w of SCAM_WORDS) {
    if (lower.includes(w)) {
      score += 12;
      indicators.push(`Keyword: "${w}"`);
    }
  }

  if (URL_RE.test(text)) {
    score += 18;
    reasons.push("Contains a link, often used to harvest credentials.");
    indicators.push("Embedded link");
  }
  if (SUSPICIOUS_TLD.test(text)) {
    score += 25;
    reasons.push("Uses a domain extension commonly abused by scammers.");
  }
  if (LOOKALIKE.test(text)) {
    score += 20;
    reasons.push("Impersonates a well-known brand.");
  }
  if (/[A-Z]{4,}/.test(text) && type !== "url") {
    score += 6;
    indicators.push("Heavy use of CAPS");
  }
  if (/\d{4,}/.test(text) && /(code|otp|verify)/i.test(lower)) {
    score += 15;
    reasons.push("Asks for a verification code.");
  }
  if (type === "url" && /[0-9]{3,}\./.test(text)) {
    score += 10;
    indicators.push("Numeric host or IP-like URL");
  }
  if (type === "handle" && /[il1|0o]{2,}/.test(text)) {
    score += 8;
    indicators.push("Look-alike characters in handle");
  }

  // Community boost
  const match = findCommunity(text, type);
  const communityMatches = match?.count ?? 0;
  if (communityMatches > 0) {
    score += Math.min(40, 15 + communityMatches);
    reasons.unshift(`Reported by ${communityMatches} other BlockOff user${communityMatches === 1 ? "" : "s"}.`);
  }

  if (reasons.length === 0 && indicators.length === 0) {
    reasons.push("No common scam patterns detected. Stay alert anyway.");
  }

  const severity = Math.max(0, Math.min(100, score));
  let verdict: Verdict = "safe";
  if (severity >= 55) verdict = "scam";
  else if (severity >= 25) verdict = "suspicious";

  return { verdict, severity, reasons, indicators, communityMatches };
}
