import {
  loadMockCategories,
  saveMockCategories,
} from "@/data/mockCatalogStore";
import type { Category } from "@/features/products/types/product.types";
import { slugify } from "@/utils/slugify";
import type {
  CategoryRepository,
  CategoryWriteInput,
} from "./categoryRepository";

function delay(ms = 250): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function ensureUniqueSlug(base: string, excludeId?: string): string {
  const categories = loadMockCategories();
  let slug = base;
  let n = 2;
  while (categories.some((c) => c.slug === slug && c.id !== excludeId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function toCategory(
  id: string,
  data: CategoryWriteInput,
): Category {
  const slug = ensureUniqueSlug(data.slug?.trim() || slugify(data.name), id);
  return {
    id,
    slug,
    name: data.name.trim(),
    description: data.description.trim(),
    imageUrl: data.imageUrl?.trim() || undefined,
    isActive: data.isActive,
  };
}

export const mockCategoryRepository: CategoryRepository = {
  async getCategories(options?: { includeInactive?: boolean }) {
    await delay();
    const categories = loadMockCategories();
    if (options?.includeInactive) return categories;
    return categories.filter((c) => c.isActive);
  },

  async getCategoryBySlug(slug: string) {
    await delay();
    return (
      loadMockCategories().find((c) => c.slug === slug && c.isActive) ?? null
    );
  },

  async getCategoryById(id: string) {
    await delay();
    return loadMockCategories().find((c) => c.id === id) ?? null;
  },

  async create(data: CategoryWriteInput) {
    await delay(400);
    const categories = loadMockCategories();
    const category = toCategory(`cat-${Date.now()}`, data);
    // Keep id aligned with slug for new categories (matches seed pattern)
    const withId: Category = { ...category, id: category.slug };
    if (categories.some((c) => c.id === withId.id)) {
      withId.id = category.slug;
    }
    categories.push(withId);
    saveMockCategories(categories);
    return withId;
  },

  async update(id: string, data: CategoryWriteInput) {
    await delay(400);
    const categories = loadMockCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category ${id} not found.`);
    }
    const updated = toCategory(id, data);
    // Preserve id; update slug fields only
    categories[index] = { ...updated, id };
    saveMockCategories(categories);
    return categories[index];
  },

  async setActive(id: string, isActive: boolean) {
    await delay();
    const categories = loadMockCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category ${id} not found.`);
    }
    categories[index] = { ...categories[index], isActive };
    saveMockCategories(categories);
    return categories[index];
  },
};
