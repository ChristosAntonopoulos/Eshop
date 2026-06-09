import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/features/auth/AuthContext";
import styles from "./CheckoutPage.module.css";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.defaultAddress?.street ?? "",
    city: user?.defaultAddress?.city ?? "Marousi",
    postalCode: user?.defaultAddress?.postalCode ?? "",
  };

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
            Thank you for shopping at LCG Shop
            {isAuthenticated && user ? `, ${user.firstName}` : ""}. This is a
            demo checkout — no payment was processed.
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
      <p className="page-subtitle">
        Complete your order below — no account required. Guest checkout is always
        available.
      </p>

      {isAuthenticated && user ? (
        <div className={styles.signedInBanner}>
          <UserCheck size={18} />
          <span>
            Signed in as <strong>{user.firstName}</strong> — your details are
            pre-filled.{" "}
            <Link to="/account">Manage account</Link>
          </span>
        </div>
      ) : (
        <div className={styles.guestBanner}>
          <LogIn size={18} />
          <span>
            Checking out as guest.{" "}
            <Link to="/login" state={{ from: "/checkout" }}>
              Sign in
            </Link>{" "}
            to save your details for next time, or{" "}
            <Link to="/register">create an account</Link>.
          </span>
        </div>
      )}

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} key={user?.id ?? "guest"}>
          <h2>Contact</h2>
          <div className={styles.row}>
            <Input
              label="First name"
              name="firstName"
              defaultValue={defaultValues.firstName}
              required
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              name="lastName"
              defaultValue={defaultValues.lastName}
              required
              autoComplete="family-name"
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={defaultValues.email}
            required
            autoComplete="email"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues.phone}
            required
            autoComplete="tel"
          />

          <h2>Delivery</h2>
          <Input
            label="Address"
            name="address"
            defaultValue={defaultValues.address}
            required
            autoComplete="street-address"
          />
          <div className={styles.row}>
            <Input
              label="City"
              name="city"
              defaultValue={defaultValues.city}
              required
              autoComplete="address-level2"
            />
            <Input
              label="Postal code"
              name="postalCode"
              defaultValue={defaultValues.postalCode}
              required
              autoComplete="postal-code"
            />
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
