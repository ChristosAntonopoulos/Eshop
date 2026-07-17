import { apiClient, type QueryParams } from "@/services/api/apiClient";
import type { Product } from "@/features/products/types/product.types";
import type {
  ProductRepository,
  ProductQueryParams,
  ProductWriteInput,
} from "./productRepository";

function toQueryParams(params?: ProductQueryParams): QueryParams | undefined {
  if (!params) return undefined;
  return params as QueryParams;
}

export const httpProductRepository: ProductRepository = {
  async getProducts(params?: ProductQueryParams) {
    return apiClient.get<Product[]>("/products", {
      params: toQueryParams(params),
    });
  },

  async getProductBySlug(slug: string) {
    return apiClient.get<Product | null>(`/products/${slug}`);
  },

  async getProductById(id: string) {
    return apiClient.get<Product | null>(`/products/by-id/${id}`);
  },

  async getFeaturedProducts() {
    return apiClient.get<Product[]>("/products/featured");
  },

  async getRelatedProducts(productId: string) {
    return apiClient.get<Product[]>(`/products/${productId}/related`);
  },

  async create(data: ProductWriteInput) {
    return apiClient.post<Product>("/products", data);
  },

  async update(id: string, data: ProductWriteInput) {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  async setActive(id: string, isActive: boolean) {
    return apiClient.patch<Product>(`/products/${id}/active`, { isActive });
  },
};
