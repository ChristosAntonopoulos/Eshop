import { apiClient } from "@/services/api/apiClient";
import type { Category } from "@/features/products/types/product.types";
import type {
  CategoryRepository,
  CategoryWriteInput,
} from "./categoryRepository";

export const httpCategoryRepository: CategoryRepository = {
  async getCategories(options?: { includeInactive?: boolean }) {
    return apiClient.get<Category[]>("/categories", {
      params: options?.includeInactive ? { includeInactive: true } : undefined,
    });
  },

  async getCategoryBySlug(slug: string) {
    return apiClient.get<Category | null>(`/categories/${slug}`);
  },

  async getCategoryById(id: string) {
    return apiClient.get<Category | null>(`/categories/by-id/${id}`);
  },

  async create(data: CategoryWriteInput) {
    return apiClient.post<Category>("/categories", data);
  },

  async update(id: string, data: CategoryWriteInput) {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  async setActive(id: string, isActive: boolean) {
    return apiClient.patch<Category>(`/categories/${id}/active`, { isActive });
  },
};
