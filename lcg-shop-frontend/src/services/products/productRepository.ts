import type { Product } from "@/features/products/types/product.types";

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price-asc" | "price-desc" | "name";
  onlyInStock?: boolean;
}

export interface ProductRepository {
  getProducts(params?: ProductQueryParams): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getRelatedProducts(productId: string): Promise<Product[]>;
}
