import type { Category, Product } from "@/features/products/types/product.types";
import { mockCategories } from "./mockCategories";
import { mockProducts } from "./mockProducts";

const PRODUCTS_KEY = "lcg-shop-mock-products";
const CATEGORIES_KEY = "lcg-shop-mock-categories";

function cloneProducts(): Product[] {
  return structuredClone(mockProducts);
}

function cloneCategories(): Category[] {
  return structuredClone(mockCategories);
}

export function loadMockProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return cloneProducts();
    return JSON.parse(raw) as Product[];
  } catch {
    return cloneProducts();
  }
}

export function saveMockProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadMockCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return cloneCategories();
    return JSON.parse(raw) as Category[];
  } catch {
    return cloneCategories();
  }
}

export function saveMockCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
