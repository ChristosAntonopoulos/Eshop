import { useEffect, useState } from "react";
import type { Product } from "@/features/products/types/product.types";
import { productRepository } from "@/services/products";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Spinner } from "@/components/ui/Spinner";
import { ProductGrid } from "../ProductGrid";
import styles from "./FeaturedProducts.module.css";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedProducts({
  title = "Featured products",
  subtitle = "Top picks from LCG Shop near OAKA",
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productRepository.getFeaturedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} />
      {loading ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
