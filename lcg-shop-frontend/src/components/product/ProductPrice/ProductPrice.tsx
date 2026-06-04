import { formatCurrency } from "@/utils/formatCurrency";
import styles from "./ProductPrice.module.css";

interface ProductPriceProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
}

export function ProductPrice({
  price,
  compareAtPrice,
  size = "md",
}: ProductPriceProps) {
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;

  return (
    <div className={`${styles.root} ${styles[size]}`}>
      <span className={styles.price}>{formatCurrency(price)}</span>
      {onSale && (
        <span className={styles.compare}>{formatCurrency(compareAtPrice)}</span>
      )}
    </div>
  );
}
