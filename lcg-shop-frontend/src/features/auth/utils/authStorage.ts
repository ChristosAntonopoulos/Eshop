import type { AuthSession } from "@/features/auth/types/auth.types";

const SESSION_KEY = "lcg-shop-auth-session";
const REGISTERED_USERS_KEY = "lcg-shop-registered-users";

export function loadAuthSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AuthSession;
    if (new Date(session.expiresAt) < new Date()) {
      clearAuthSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function loadRegisteredUsers(): string {
  return localStorage.getItem(REGISTERED_USERS_KEY) ?? "[]";
}

export function saveRegisteredUsers(data: string): void {
  localStorage.setItem(REGISTERED_USERS_KEY, data);
}
