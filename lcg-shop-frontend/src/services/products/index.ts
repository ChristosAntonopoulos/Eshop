import { mockProductRepository } from "./mockProductRepository";
import { httpProductRepository } from "./httpProductRepository";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const productRepository = useMockData
  ? mockProductRepository
  : httpProductRepository;
