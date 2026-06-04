import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/features/products/types/product.types";
import styles from "./ProductBadges.module.css";

interface ProductBadgesProps {
  product: Product;
}

export function ProductBadges({ product }: ProductBadgesProps) {
  const inStock = product.stockQuantity > 0;
  const onSale =
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price;

  return (
    <div className={styles.root}>
      {product.isNew && <Badge variant="new">New</Badge>}
      {onSale && <Badge variant="sale">Sale</Badge>}
      {product.isFeatured && <Badge variant="category">Featured</Badge>}
      {!inStock && <Badge variant="out-of-stock">Out of stock</Badge>}
      {inStock && product.stockQuantity <= 5 && (
        <Badge variant="low-stock">Only {product.stockQuantity} left</Badge>
      )}
    </div>
  );
}
