import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ padding = "md", className, children, ...props }: CardProps) {
  return (
    <div className={clsx(styles.card, styles[padding], className)} {...props}>
      {children}
    </div>
  );
}
