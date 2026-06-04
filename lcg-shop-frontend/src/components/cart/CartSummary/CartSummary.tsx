import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "./CartSummary.module.css";

const MOCK_SHIPPING = 3.5;

interface CartSummaryProps {
  subtotal: number;
  checkoutHref?: string;
  showCheckoutButton?: boolean;
}

export function CartSummary({
  subtotal,
  checkoutHref = "/checkout",
  showCheckoutButton = true,
}: CartSummaryProps) {
  const total = subtotal + (subtotal > 0 ? MOCK_SHIPPING : 0);

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Order summary</h2>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className={styles.line}>
          <dt>Shipping (estimate)</dt>
          <dd>
            {subtotal > 0 ? formatCurrency(MOCK_SHIPPING) : formatCurrency(0)}
          </dd>
        </div>
        <div className={`${styles.line} ${styles.total}`}>
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
      {showCheckoutButton &&
        (subtotal > 0 ? (
          <Link to={checkoutHref} className={styles.checkoutLink}>
            <Button variant="accent" fullWidth>
              Proceed to checkout
            </Button>
          </Link>
        ) : (
          <Button variant="accent" fullWidth disabled>
            Proceed to checkout
          </Button>
        ))}
    </Card>
  );
}
