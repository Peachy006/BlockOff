const KEY = "blockoff:device-id";
const ONBOARDED = "blockoff:onboarded";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "dev-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function regenerateDeviceId(): string {
  const id = uuid();
  localStorage.setItem(KEY, id);
  return id;
}

export function shortDeviceId(id: string): string {
  return id.replace(/-/g, "").slice(0, 10).toUpperCase();
}

export function hasOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED) === "1";
}

export function setOnboarded() {
  localStorage.setItem(ONBOARDED, "1");
}
