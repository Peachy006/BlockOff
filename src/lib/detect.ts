import { ReportType, ClassifyResult } from "./types";

// --- helpers ---------------------------------------------------------

const SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly"
];

const RISKY_TLDS = [
  ".zip", ".xyz", ".top", ".click", ".ru", ".cn", ".tk", ".ml", ".gq", ".cf"
];

const TRUSTED_BRANDS = [
  "dhl", "posten", "postnord", "fedex",
  "dnb", "nordea", "sparebank",
  "paypal", "amazon", "apple", "microsoft", "netflix",
  "skatteetaten", "irs"
];

function extractUrls(text: string): string[] {
  const re = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  return text.match(re) || [];
}

function normalizeHost(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `http://${url}`);
    return u.hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isIpHost(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

function hasRiskyTld(host: string): boolean {
  return RISKY_TLDS.some(tld => host.endsWith(tld));
}

function isShortener(host: string): boolean {
  return SHORTENERS.some(s => host.includes(s));
}

// naive lookalike: numbers swapped for letters
function isLookalikeBrand(host: string): string | null {
  const h = host.replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s");
  for (const brand of TRUSTED_BRANDS) {
    if (h.includes(brand) && !host.includes(brand)) {
      return brand;
    }
  }
  return null;
}

function containsAny(input: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(input));
}

// --- main ------------------------------------------------------------

export function classify(text: string, type: ReportType): ClassifyResult {
  const input = text.toLowerCase();

  let score = 0;
  const reasons: string[] = [];
  const indicators: string[] = [];

  const add = (points: number, reason: string, indicator: string) => {
    score += points;
    if (reasons.length < 4 && !reasons.includes(reason)) reasons.push(reason);
    if (!indicators.includes(indicator)) indicators.push(indicator);
  };

  // --- URL analysis ---
  const urls = extractUrls(text);
  for (const u of urls) {
    const host = normalizeHost(u);

    if (!host) {
      add(10, "Malformed link", "Malformed URL");
      continue;
    }

    if (isShortener(host)) {
      add(25, "Uses URL shortener", "Shortened URL");
    }

    if (isIpHost(host)) {
      add(25, "Uses IP address link", "IP URL");
    }

    if (hasRiskyTld(host)) {
      add(20, "Suspicious domain ending", "Risky TLD");
    }

    const lookalike = isLookalikeBrand(host);
    if (lookalike) {
      add(30, "Lookalike domain impersonation", "Lookalike domain");
    }

    // brand mention + link mismatch (very rough)
    if (TRUSTED_BRANDS.some(b => input.includes(b)) && !TRUSTED_BRANDS.some(b => host.includes(b))) {
      add(15, "Brand mentioned but link mismatches", "Impersonation");
    }
  }

  // --- urgency / pressure ---
  if (containsAny(input, [
    /\burgent\b/, /\bimmediately\b/, /\bnow\b/, /\bfinal notice\b/,
    /\bwithin \d+ (hours?|minutes?)\b/
  ])) {
    add(20, "Urgency language", "Urgency");
  }

  // --- threats / account issues ---
  if (containsAny(input, [
    /\baccount\b.*\b(suspended|locked|restricted)\b/,
    /\bkonto\b.*\b(sperret|låst)\b/,
    /\bverify\b|\bverifiser\b/
  ])) {
    add(20, "Account threat or verification", "Account threat");
  }

  // --- payment / fees ---
  if (containsAny(input, [
    /\bpay\b/, /\bpayment\b/, /\bfee\b/, /\bcharge\b/,
    /\bbetaling\b/, /\bgebyr\b/
  ])) {
    add(20, "Requests payment or fee", "Payment request");
  }

  // --- delivery scams ---
  if (containsAny(input, [
    /\bdhl\b/, /\bposten\b/, /\bpostnord\b/, /\bfedex\b/,
    /\bpackage\b|\bpakke\b|\bdelivery\b/
  ])) {
    add(15, "Delivery service mention", "Delivery scam");
  }

  // --- OTP / codes ---
  if (containsAny(input, [
    /\bcode\b/, /\botp\b/, /\bverification code\b/,
    /\bkode\b/
  ])) {
    add(25, "Requests or mentions verification code", "OTP phishing");
  }

  // --- prizes / giveaways ---
  if (containsAny(input, [
    /\bwon\b/, /\bwinner\b/, /\bprize\b/, /\bgift\b/,
    /\bgratulerer\b/, /\bgevinst\b/
  ])) {
    add(20, "Prize or reward claim", "Prize scam");
  }

  // --- crypto / investment ---
  if (containsAny(input, [
    /\bbitcoin\b/, /\bcrypto\b/, /\binvest\b/, /\bdouble your\b/
  ])) {
    add(25, "Crypto or investment lure", "Investment scam");
  }

  // --- emotional manipulation ---
  if (containsAny(input, [
    /\bhelp me\b/, /\burgent help\b/, /\bi'm stuck\b/,
    /\bhjelp meg\b/
  ])) {
    add(20, "Emotional manipulation", "Manipulation");
  }

  // --- phone patterns ---
  if (type === "sms" && /^\+?\d{6,}$/.test(text.replace(/\s/g, ""))) {
    add(10, "Bare phone number provided", "Phone number");
  }

  // --- handles ---
  if (type === "handle" && text.startsWith("@")) {
    add(10, "Social handle reported", "Handle");
  }

  // clamp score
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