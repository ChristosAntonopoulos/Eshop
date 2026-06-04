import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/products/types/product.types";
import { productRepository } from "@/services/products";
import type { ProductQueryParams } from "@/services/products/productRepository";

export function useProducts(params?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params ?? {});
  const stableParams = useMemo(
    () => JSON.parse(paramsKey) as ProductQueryParams,
    [paramsKey],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productRepository
      .getProducts(stableParams)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, stableParams]);

  return { products, loading, error };
}
