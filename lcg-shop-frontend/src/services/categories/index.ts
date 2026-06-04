import { mockCategoryRepository } from "./mockCategoryRepository";
import { httpCategoryRepository } from "./httpCategoryRepository";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export const categoryRepository = useMockData
  ? mockCategoryRepository
  : httpCategoryRepository;
