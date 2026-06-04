import { useEffect, useState } from "react";
import type { Category } from "@/features/products/types/product.types";
import { categoryRepository } from "@/services/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    categoryRepository
      .getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
