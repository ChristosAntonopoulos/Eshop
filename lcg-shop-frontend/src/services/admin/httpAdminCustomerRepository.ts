import { apiClient } from "@/services/api/apiClient";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { AdminCustomerRepository } from "./adminCustomerRepository";

export const httpAdminCustomerRepository: AdminCustomerRepository = {
  async listUsers() {
    return apiClient.get<AuthUser[]>("/admin/customers");
  },

  async getUser(id: string) {
    return apiClient.get<AuthUser | null>(`/admin/customers/${id}`);
  },
};
