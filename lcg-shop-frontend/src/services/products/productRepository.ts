import type { Product } from "@/features/products/types/product.types";

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price-asc" | "price-desc" | "name";
  onlyInStock?: boolean;
  /** When true, include inactive products (admin catalog). */
  includeInactive?: boolean;
}

/** Writable product fields for create/update (admin). */
export type ProductWriteInput = Omit<Product, "id" | "createdAt" | "slug"> & {
  slug?: string;
};

export interface ProductRepository {
  getProducts(params?: ProductQueryParams): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getRelatedProducts(productId: string): Promise<Product[]>;
  create(data: ProductWriteInput): Promise<Product>;
  update(id: string, data: ProductWriteInput): Promise<Product>;
  setActive(id: string, isActive: boolean): Promise<Product>;
}
