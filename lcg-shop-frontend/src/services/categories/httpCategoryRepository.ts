import { apiClient } from "@/services/api/apiClient";
import type { Category } from "@/features/products/types/product.types";
import type { CategoryRepository } from "./categoryRepository";

export const httpCategoryRepository: CategoryRepository = {
  async getCategories() {
    return apiClient.get<Category[]>("/categories");
  },

  async getCategoryBySlug(slug: string) {
    return apiClient.get<Category | null>(`/categories/${slug}`);
  },
};
