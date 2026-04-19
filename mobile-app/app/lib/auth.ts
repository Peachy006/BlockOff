const API_URL = "http://localhost:8080";

const AUTH_KEY = "blockoff:authed";
const USER_KEY = "blockoff:user";

export interface AuthUser {
  id: string;
  email: string;
  phoneNumber: string;
  passwordHash?: string;
}

// ------------------ state helpers ------------------

export function isAuthed(): boolean {
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthed(value: boolean) {
  if (value) localStorage.setItem(AUTH_KEY, "1");
  else {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthed(true);
}

// ------------------ API calls ------------------

export async function createUser(
  email: string,
  phoneNumber: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}&phoneNumber=${encodeURIComponent(
      phoneNumber,
    )}&password=${encodeURIComponent(password)}`,
    { method: "POST" },
  );

  if (!res.ok) throw new Error("Failed to create user");

  const user: AuthUser = await res.json();
  saveUser(user);
  return user;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(
    `${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    { method: "POST" },
  );

  if (res.status === 401) throw new Error("Invalid email or password");
  if (!res.ok) throw new Error("Login failed");

  const user: AuthUser = await res.json();
  saveUser(user);
  return user;
}

export async function getUser(id: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export function logout() {
  setAuthed(false);
}