import { ReportType } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export async function analyzeWithAI(text: string, type: ReportType) {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, type }),
  });

  if (!res.ok) throw new Error("AI failed");

  return await res.json();
}