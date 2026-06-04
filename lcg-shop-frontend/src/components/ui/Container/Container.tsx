import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "./Container.module.css";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section";
}

export function Container({
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={clsx(styles.container, className)} {...props}>
      {children}
    </Tag>
  );
}
