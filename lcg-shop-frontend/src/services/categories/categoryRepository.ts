import type { Category } from "@/features/products/types/product.types";

export interface CategoryRepository {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
}
