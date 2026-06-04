import { apiClient, type QueryParams } from "@/services/api/apiClient";
import type { Product } from "@/features/products/types/product.types";
import type { ProductRepository, ProductQueryParams } from "./productRepository";

function toQueryParams(params?: ProductQueryParams): QueryParams | undefined {
  if (!params) return undefined;
  return params as QueryParams;
}

export const httpProductRepository: ProductRepository = {
  async getProducts(params?: ProductQueryParams) {
    return apiClient.get<Product[]>("/products", { params: toQueryParams(params) });
  },

  async getProductBySlug(slug: string) {
    return apiClient.get<Product | null>(`/products/${slug}`);
  },

  async getFeaturedProducts() {
    return apiClient.get<Product[]>("/products/featured");
  },

  async getRelatedProducts(productId: string) {
    return apiClient.get<Product[]>(`/products/${productId}/related`);
  },
};
