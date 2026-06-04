import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/features/cart/CartContext";
import styles from "./CheckoutPage.module.css";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    clearCart();
    setSubmitted(true);
    setLoading(false);
  };

  if (items.length === 0 && !submitted) {
    return (
      <Container>
        <h1 className="page-title">Checkout</h1>
        <p className={styles.emptyMsg}>
          Your cart is empty.{" "}
          <Link to="/products">Continue shopping</Link>
        </p>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container>
        <Card className={styles.success}>
          <h1>Order placed!</h1>
          <p>
            Thank you for shopping at LCG Shop. This is a demo checkout — no
            payment was processed.
          </p>
          <Link to="/products">
            <Button variant="accent">Continue shopping</Button>
          </Link>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Demo checkout — no payment required</p>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Contact</h2>
          <div className={styles.row}>
            <Input label="First name" name="firstName" required autoComplete="given-name" />
            <Input label="Last name" name="lastName" required autoComplete="family-name" />
          </div>
          <Input label="Email" name="email" type="email" required autoComplete="email" />
          <Input label="Phone" name="phone" type="tel" required autoComplete="tel" />

          <h2>Delivery</h2>
          <Input label="Address" name="address" required autoComplete="street-address" />
          <div className={styles.row}>
            <Input label="City" name="city" defaultValue="Marousi" required autoComplete="address-level2" />
            <Input label="Postal code" name="postalCode" required autoComplete="postal-code" />
          </div>

          <label className={styles.textareaLabel} htmlFor="notes">
            Order notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            className={styles.textarea}
            rows={3}
            placeholder="Delivery instructions, pickup time, etc."
          />

          <Button type="submit" variant="accent" size="lg" isLoading={loading}>
            Place order
          </Button>
        </form>
        <CartSummary subtotal={subtotal} showCheckoutButton={false} />
      </div>
    </Container>
  );
}
