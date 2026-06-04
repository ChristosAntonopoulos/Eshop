import type { Category } from "@/features/products/types/product.types";

export const mockCategories: Category[] = [
  {
    id: "supplements",
    slug: "supplements",
    name: "Supplements",
    description: "Protein, creatine, amino acids and daily performance support.",
    imageUrl: "https://picsum.photos/seed/cat-supplements/600/400",
    isActive: true,
  },
  {
    id: "protein-snacks",
    slug: "protein-snacks",
    name: "Protein Snacks",
    description: "Bars, cookies and high-protein snacks for active days.",
    imageUrl: "https://picsum.photos/seed/cat-protein-snacks/600/400",
    isActive: true,
  },
  {
    id: "hydration",
    slug: "hydration",
    name: "Hydration",
    description: "Electrolytes, carbolytes and hydration products.",
    imageUrl: "https://picsum.photos/seed/cat-hydration/600/400",
    isActive: true,
  },
  {
    id: "swimming",
    slug: "swimming",
    name: "Swimming",
    description: "Swimming accessories for training and pool use.",
    imageUrl: "https://picsum.photos/seed/cat-swimming/600/400",
    isActive: true,
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    description: "Bottles, bags, shakers and everyday training accessories.",
    imageUrl: "https://picsum.photos/seed/cat-accessories/600/400",
    isActive: true,
  },
  {
    id: "training",
    slug: "training",
    name: "Training",
    description: "Gloves, bands and essentials for gym and home workouts.",
    imageUrl: "https://picsum.photos/seed/cat-training/600/400",
    isActive: true,
  },
];
