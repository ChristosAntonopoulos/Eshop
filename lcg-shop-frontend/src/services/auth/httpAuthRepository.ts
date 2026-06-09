import { apiClient } from "@/services/api/apiClient";
import type { AuthSession, AuthUser } from "@/features/auth/types/auth.types";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from "@/features/auth/utils/authStorage";
import type { AuthRepository } from "./authRepository";

export const httpAuthRepository: AuthRepository = {
  async login(credentials) {
    const session = await apiClient.post<AuthSession>("/auth/login", credentials);
    saveAuthSession(session);
    return session;
  },

  async register(data) {
    const session = await apiClient.post<AuthSession>("/auth/register", data);
    saveAuthSession(session);
    return session;
  },

  async logout() {
    try {
      await apiClient.post<void>("/auth/logout", {});
    } finally {
      clearAuthSession();
    }
  },

  async getCurrentUser() {
    const cached = loadAuthSession();
    if (!cached) return null;

    try {
      return await apiClient.get<AuthUser>("/auth/me");
    } catch {
      clearAuthSession();
      return null;
    }
  },
};
