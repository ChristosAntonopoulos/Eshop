import { mockAuthRepository } from "./mockAuthRepository";
import { httpAuthRepository } from "./httpAuthRepository";

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

export const authRepository = useMockAuth
  ? mockAuthRepository
  : httpAuthRepository;
