import { mockProducts } from "@/data/mockProducts";
import type { ProductRepository, ProductQueryParams } from "./productRepository";

export const mockProductRepository: ProductRepository = {
  async getProducts(params?: ProductQueryParams) {
    let products = [...mockProducts].filter((p) => p.isActive);

    if (params?.search) {
      const search = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((tag) => tag.toLowerCase().includes(search)),
      );
    }

    if (params?.categoryId) {
      products = products.filter((p) => p.categoryId === params.categoryId);
    }

    if (params?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.onlyInStock) {
      products = products.filter((p) => p.stockQuantity > 0);
    }

    if (params?.sortBy === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    }

    if (params?.sortBy === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    }

    if (params?.sortBy === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (params?.sortBy === "newest") {
      products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return products;
  },

  async getProductBySlug(slug: string) {
    return mockProducts.find((p) => p.slug === slug && p.isActive) ?? null;
  },

  async getFeaturedProducts() {
    return mockProducts.filter((p) => p.isFeatured && p.isActive);
  },

  async getRelatedProducts(productId: string) {
    const product = mockProducts.find((p) => p.id === productId);

    if (!product) return [];

    return mockProducts
      .filter(
        (p) =>
          p.id !== productId &&
          p.categoryId === product.categoryId &&
          p.isActive,
      )
      .slice(0, 4);
  },
};
