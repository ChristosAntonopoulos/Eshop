import type { AuthUser } from "@/features/auth/types/auth.types";

export interface AdminCustomerRepository {
  listUsers(): Promise<AuthUser[]>;
  getUser(id: string): Promise<AuthUser | null>;
}
