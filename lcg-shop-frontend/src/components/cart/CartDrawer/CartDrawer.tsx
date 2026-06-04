import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "./CartDrawer.module.css";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal } = useCart();

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-label="Cart preview">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2>Your cart</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {items.length === 0 ? (
          <p className={styles.empty}>Cart is empty</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.productId}>
                <img src={item.imageUrl} alt="" className={styles.thumb} />
                <span>
                  {item.name} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.subtotal}>Subtotal: {formatCurrency(subtotal)}</p>
        <Link to="/cart" className={styles.link} onClick={onClose}>
          View cart
        </Link>
      </div>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close cart"
        onClick={onClose}
      />
    </div>
  );
}
