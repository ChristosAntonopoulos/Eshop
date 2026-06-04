import { mockCategories } from "@/data/mockCategories";
import type { CategoryRepository } from "./categoryRepository";

export const mockCategoryRepository: CategoryRepository = {
  async getCategories() {
    return mockCategories.filter((c) => c.isActive);
  },

  async getCategoryBySlug(slug: string) {
    return mockCategories.find((c) => c.slug === slug && c.isActive) ?? null;
  },
};
