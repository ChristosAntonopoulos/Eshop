export type UserRole = "CUSTOMER" | "ADMIN";

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  defaultAddress?: UserAddress;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
