import { Report, ReportType } from "./types";

const REPORTS_KEY = "blockoff:reports";
const SETTINGS_KEY = "blockoff:settings";

export interface Settings {
  shareWithCommunity: boolean;
}

export function getReports(): Report[] {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveReport(r: Report) {
  const all = getReports();
  all.unshift(r);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(all));
}

export function getSettings(): Settings {
  try {
    return { shareWithCommunity: true, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { shareWithCommunity: true };
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export interface CommunityEntry {
  identifier: string;
  type: ReportType;
  count: number;
  lastSeen: number;
}

// Seed community list (representing what the backend will provide)
const SEED: CommunityEntry[] = [
  { identifier: "+47 900 12 345", type: "sms", count: 42, lastSeen: Date.now() - 1000 * 60 * 60 * 3 },
  { identifier: "+44 7700 900123", type: "sms", count: 28, lastSeen: Date.now() - 1000 * 60 * 60 * 12 },
  { identifier: "@official_paypaI_support", type: "handle", count: 67, lastSeen: Date.now() - 1000 * 60 * 30 },
  { identifier: "@dhl-redelivery", type: "handle", count: 19, lastSeen: Date.now() - 1000 * 60 * 60 * 24 },
  { identifier: "http://bit.ly/dhl-redeliv3ry", type: "url", count: 91, lastSeen: Date.now() - 1000 * 60 * 5 },
  { identifier: "https://login-secure-banking.co", type: "url", count: 53, lastSeen: Date.now() - 1000 * 60 * 60 * 6 },
  { identifier: "+1 415 555 0199", type: "sms", count: 14, lastSeen: Date.now() - 1000 * 60 * 60 * 48 },
];

export function getCommunity(): CommunityEntry[] {
  // Merge seed with locally reported items so it feels live.
  const local = getReports();
  const map = new Map<string, CommunityEntry>();
  for (const s of SEED) map.set(s.type + "::" + normalize(s.identifier), { ...s });
  for (const r of local) {
    const key = r.type + "::" + normalize(r.identifier);
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.lastSeen = Math.max(existing.lastSeen, r.createdAt);
    } else {
      map.set(key, { identifier: r.identifier, type: r.type, count: 1, lastSeen: r.createdAt });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

export function findCommunity(identifier: string, type: ReportType): CommunityEntry | undefined {
  const key = type + "::" + normalize(identifier);
  return getCommunity().find((c) => c.type + "::" + normalize(c.identifier) === key);
}
