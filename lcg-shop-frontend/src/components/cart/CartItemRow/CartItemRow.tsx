import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CartItem } from "@/features/cart/types/cart.types";
import styles from "./CartItemRow.module.css";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className={styles.row}>
      <Link to={`/products/${item.slug}`} className={styles.imageLink}>
        <img src={item.imageUrl} alt={item.name} className={styles.image} />
      </Link>
      <div className={styles.details}>
        <Link to={`/products/${item.slug}`} className={styles.name}>
          {item.name}
        </Link>
        <p className={styles.unit}>{formatCurrency(item.price)} each</p>
        <QuantitySelector
          value={item.quantity}
          max={item.stockQuantity}
          onChange={(qty) => onUpdateQuantity(item.productId, qty)}
        />
      </div>
      <div className={styles.actions}>
        <p className={styles.total}>{formatCurrency(lineTotal)}</p>
        <button
          type="button"
          className={styles.remove}
          onClick={() => onRemove(item.productId)}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
