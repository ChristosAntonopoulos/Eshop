export type ProductCategory =
  | "supplements"
  | "protein-snacks"
  | "hydration"
  | "swimming"
  | "accessories"
  | "training";

export interface ProductNutritionalInfo {
  protein?: string;
  carbs?: string;
  calories?: string;
  servingSize?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  gallery: string[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  nutritionalInfo?: ProductNutritionalInfo;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}
