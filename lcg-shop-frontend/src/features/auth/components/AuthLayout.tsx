import { Link } from "react-router-dom";
import { Dumbbell, ShieldCheck, ShoppingBag } from "lucide-react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <aside className={styles.panel} aria-hidden="true">
        <div className={styles.panelInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandMark}>LCG</span> Shop
          </Link>
          <h2 className={styles.panelTitle}>Train harder. Shop smarter.</h2>
          <p className={styles.panelText}>
            Supplements, hydration and gear for athletes near OAKA — order as a
            guest or create an account for faster checkout next time.
          </p>
          <ul className={styles.perks}>
            <li>
              <ShoppingBag size={20} />
              <span>Guest checkout — no account required</span>
            </li>
            <li>
              <Dumbbell size={20} />
              <span>Curated performance products</span>
            </li>
            <li>
              <ShieldCheck size={20} />
              <span>Secure account for returning customers</span>
            </li>
          </ul>
        </div>
        <div className={styles.panelGlow} />
      </aside>

      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          {footer && <div className={styles.formFooter}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
