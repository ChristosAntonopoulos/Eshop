import clsx from "clsx";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "new"
  | "sale"
  | "out-of-stock"
  | "low-stock"
  | "category";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>{children}</span>
  );
}
