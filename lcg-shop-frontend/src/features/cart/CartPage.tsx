import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "./CartContext";
import styles from "./CartPage.module.css";

export function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <Container>
        <EmptyState
          title="Your cart is empty"
          description="Add supplements, snacks or gear to get started."
          action={
            <Link to="/products">
              <Button variant="accent">Browse products</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="page-title">Cart</h1>
      <p className="page-subtitle">{items.length} line items</p>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
        <CartSummary subtotal={subtotal} />
      </div>
    </Container>
  );
}
