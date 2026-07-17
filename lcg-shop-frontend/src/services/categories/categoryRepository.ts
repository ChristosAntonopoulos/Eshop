import type { Category } from "@/features/products/types/product.types";

export type CategoryWriteInput = Omit<Category, "id" | "slug"> & {
  slug?: string;
};

export interface CategoryRepository {
  getCategories(options?: { includeInactive?: boolean }): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getCategoryById(id: string): Promise<Category | null>;
  create(data: CategoryWriteInput): Promise<Category>;
  update(id: string, data: CategoryWriteInput): Promise<Category>;
  setActive(id: string, isActive: boolean): Promise<Category>;
}
