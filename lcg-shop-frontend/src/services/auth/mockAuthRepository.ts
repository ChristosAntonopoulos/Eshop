import {
  DEMO_CREDENTIALS_HINT,
  seedMockUsers,
  toAuthUser,
  type MockUserRecord,
} from "@/data/mockUsers";
import type { AuthSession } from "@/features/auth/types/auth.types";
import {
  clearAuthSession,
  loadAuthSession,
  loadRegisteredUsers,
  saveAuthSession,
  saveRegisteredUsers,
} from "@/features/auth/utils/authStorage";
import type { AuthRepository } from "./authRepository";

const SESSION_DAYS = 7;

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function createToken(userId: string): string {
  return `mock-token-${userId}-${Date.now()}`;
}

function createSession(user: MockUserRecord): AuthSession {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return {
    token: createToken(user.id),
    user: toAuthUser(user),
    expiresAt: expiresAt.toISOString(),
  };
}

function loadAllUsers(): MockUserRecord[] {
  try {
    const extra = JSON.parse(loadRegisteredUsers()) as MockUserRecord[];
    return [...seedMockUsers, ...extra];
  } catch {
    return [...seedMockUsers];
  }
}

function findByEmail(email: string): MockUserRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return loadAllUsers().find((u) => u.email.toLowerCase() === normalized);
}

export const mockAuthRepository: AuthRepository = {
  async login(credentials) {
    await delay();
    const user = findByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error(`Invalid email or password. ${DEMO_CREDENTIALS_HINT}`);
    }

    const session = createSession(user);
    saveAuthSession(session);
    return session;
  },

  async register(data) {
    await delay(500);
    const email = data.email.trim().toLowerCase();

    if (findByEmail(email)) {
      throw new Error("An account with this email already exists.");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const newUser: MockUserRecord = {
      id: `user-${Date.now()}`,
      email,
      password: data.password,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim(),
      role: "CUSTOMER",
      createdAt: new Date().toISOString(),
    };

    const extra = JSON.parse(loadRegisteredUsers()) as MockUserRecord[];
    extra.push(newUser);
    saveRegisteredUsers(JSON.stringify(extra));

    const session = createSession(newUser);
    saveAuthSession(session);
    return session;
  },

  async logout() {
    await delay(200);
    clearAuthSession();
  },

  async getCurrentUser() {
    const session = loadAuthSession();
    return session?.user ?? null;
  },
};
