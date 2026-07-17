import {
  loadMockProducts,
  saveMockProducts,
} from "@/data/mockCatalogStore";
import type { Product } from "@/features/products/types/product.types";
import { slugify } from "@/utils/slugify";
import type {
  ProductRepository,
  ProductQueryParams,
  ProductWriteInput,
} from "./productRepository";

function delay(ms = 250): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function ensureUniqueSlug(base: string, excludeId?: string): string {
  const products = loadMockProducts();
  let slug = base;
  let n = 2;
  while (products.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function toProduct(id: string, data: ProductWriteInput, createdAt: string): Product {
  const slug = ensureUniqueSlug(
    data.slug?.trim() || slugify(data.name),
    id,
  );
  return {
    id,
    slug,
    name: data.name.trim(),
    description: data.description.trim(),
    shortDescription: data.shortDescription.trim(),
    categoryId: data.categoryId,
    brand: data.brand?.trim() || undefined,
    price: data.price,
    compareAtPrice: data.compareAtPrice,
    imageUrl: data.imageUrl.trim(),
    gallery: data.gallery.length ? data.gallery : [data.imageUrl.trim()],
    stockQuantity: data.stockQuantity,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    isNew: data.isNew,
    tags: data.tags,
    nutritionalInfo: data.nutritionalInfo,
    createdAt,
  };
}

function applyFilters(
  products: Product[],
  params?: ProductQueryParams,
): Product[] {
  let result = [...products];

  if (!params?.includeInactive) {
    result = result.filter((p) => p.isActive);
  }

  if (params?.search) {
    const search = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some((tag) => tag.toLowerCase().includes(search)),
    );
  }

  if (params?.categoryId) {
    result = result.filter((p) => p.categoryId === params.categoryId);
  }

  if (params?.minPrice !== undefined) {
    result = result.filter((p) => p.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= params.maxPrice!);
  }

  if (params?.onlyInStock) {
    result = result.filter((p) => p.stockQuantity > 0);
  }

  if (params?.sortBy === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (params?.sortBy === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  if (params?.sortBy === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (params?.sortBy === "newest") {
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return result;
}

export const mockProductRepository: ProductRepository = {
  async getProducts(params?: ProductQueryParams) {
    await delay();
    return applyFilters(loadMockProducts(), params);
  },

  async getProductBySlug(slug: string) {
    await delay();
    return (
      loadMockProducts().find((p) => p.slug === slug && p.isActive) ?? null
    );
  },

  async getProductById(id: string) {
    await delay();
    return loadMockProducts().find((p) => p.id === id) ?? null;
  },

  async getFeaturedProducts() {
    await delay();
    return loadMockProducts().filter((p) => p.isFeatured && p.isActive);
  },

  async getRelatedProducts(productId: string) {
    await delay();
    const products = loadMockProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) return [];

    return products
      .filter(
        (p) =>
          p.id !== productId &&
          p.categoryId === product.categoryId &&
          p.isActive,
      )
      .slice(0, 4);
  },

  async create(data: ProductWriteInput) {
    await delay(400);
    const products = loadMockProducts();
    const product = toProduct(
      `p-${Date.now()}`,
      data,
      new Date().toISOString(),
    );
    products.unshift(product);
    saveMockProducts(products);
    return product;
  },

  async update(id: string, data: ProductWriteInput) {
    await delay(400);
    const products = loadMockProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product ${id} not found.`);
    }
    const updated = toProduct(id, data, products[index].createdAt);
    products[index] = updated;
    saveMockProducts(products);
    return updated;
  },

  async setActive(id: string, isActive: boolean) {
    await delay();
    const products = loadMockProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product ${id} not found.`);
    }
    products[index] = { ...products[index], isActive };
    saveMockProducts(products);
    return products[index];
  },
};
