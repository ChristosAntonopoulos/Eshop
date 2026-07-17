import { mockAdminCustomerRepository } from "./mockAdminCustomerRepository";
import { httpAdminCustomerRepository } from "./httpAdminCustomerRepository";

const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH !== "false";

export const adminCustomerRepository = useMockAuth
  ? mockAdminCustomerRepository
  : httpAdminCustomerRepository;
