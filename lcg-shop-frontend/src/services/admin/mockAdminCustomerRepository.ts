import {
  seedMockUsers,
  toAuthUser,
  type MockUserRecord,
} from "@/data/mockUsers";
import { loadRegisteredUsers } from "@/features/auth/utils/authStorage";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { AdminCustomerRepository } from "./adminCustomerRepository";

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function loadAllUsers(): MockUserRecord[] {
  try {
    const extra = JSON.parse(loadRegisteredUsers()) as MockUserRecord[];
    return [...seedMockUsers, ...extra];
  } catch {
    return [...seedMockUsers];
  }
}

export const mockAdminCustomerRepository: AdminCustomerRepository = {
  async listUsers() {
    await delay();
    return loadAllUsers()
      .map(toAuthUser)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  },

  async getUser(id: string): Promise<AuthUser | null> {
    await delay();
    const user = loadAllUsers().find((u) => u.id === id);
    return user ? toAuthUser(user) : null;
  },
};
