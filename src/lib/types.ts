export type ReportType = "sms" | "handle" | "url";
export type Platform = "instagram" | "messenger" | "whatsapp" | "other";
export type Verdict = "safe" | "suspicious" | "scam";

export interface Report {
  id: string;
  deviceId: string;
  type: ReportType;
  identifier: string;
  platform?: Platform;
  excerpt?: string;
  createdAt: number;
}

export interface ClassifyResult {
  verdict: Verdict;
  severity: number; // 0-100
  reasons: string[];
  indicators: string[];
  communityMatches: number;
}

export const TYPE_LABEL: Record<ReportType, string> = {
  sms: "SMS / Phone",
  handle: "Social handle",
  url: "URL / Link",
};
