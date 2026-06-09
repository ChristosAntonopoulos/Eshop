import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/features/auth/types/auth.types";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(data: RegisterData): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
