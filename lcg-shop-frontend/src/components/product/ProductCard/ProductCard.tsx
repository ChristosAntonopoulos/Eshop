import { Link } from "react-router-dom";
import type { Product } from "@/features/products/types/product.types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/features/cart/CartContext";
import { ProductPrice } from "../ProductPrice";
import { ProductBadges } from "../ProductBadges";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const outOfStock = product.stockQuantity === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className={styles.card} padding="none">
      <Link to={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        </div>
      </Link>
      <div className={styles.body}>
        <ProductBadges product={product} />
        <Link to={`/products/${product.slug}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <p className={styles.short}>{product.shortDescription}</p>
        {product.brand && <p className={styles.brand}>{product.brand}</p>}
        <ProductPrice
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
        />
        <Button
          variant="accent"
          size="sm"
          fullWidth
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </Card>
  );
}
