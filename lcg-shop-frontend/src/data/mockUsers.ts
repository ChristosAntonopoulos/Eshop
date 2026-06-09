import type { AuthUser, UserRole } from "@/features/auth/types/auth.types";

/** Internal mock record — passwords are plain text for demo only. */
export interface MockUserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  defaultAddress?: AuthUser["defaultAddress"];
  createdAt: string;
}

export const DEMO_CREDENTIALS_HINT =
  "Try maria@example.com / password123 or admin@lcgshop.gr / admin123";

export const seedMockUsers: MockUserRecord[] = [
  {
    id: "user-1",
    email: "maria@example.com",
    password: "password123",
    firstName: "Maria",
    lastName: "Papadopoulou",
    phone: "+30 210 1234567",
    role: "CUSTOMER",
    defaultAddress: {
      street: "Leoforos Kifisias 45",
      city: "Marousi",
      postalCode: "15125",
      country: "GR",
    },
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "user-2",
    email: "admin@lcgshop.gr",
    password: "admin123",
    firstName: "Nikos",
    lastName: "Antoniou",
    phone: "+30 210 9876543",
    role: "ADMIN",
    createdAt: "2025-10-15T08:00:00Z",
  },
  {
    id: "user-3",
    email: "dimitris@example.com",
    password: "demo123",
    firstName: "Dimitris",
    lastName: "Nikolaou",
    phone: "+30 694 1234567",
    role: "CUSTOMER",
    defaultAddress: {
      street: "Kifisias Ave 12",
      city: "Marousi",
      postalCode: "15123",
      country: "GR",
    },
    createdAt: "2026-01-20T14:00:00Z",
  },
];

export function toAuthUser(record: MockUserRecord): AuthUser {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    phone: record.phone,
    role: record.role,
    defaultAddress: record.defaultAddress,
    createdAt: record.createdAt,
  };
}
