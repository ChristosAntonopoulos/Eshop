import { Minus, Plus } from "lucide-react";
import styles from "./QuantitySelector.module.css";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  disabled,
}: QuantitySelectorProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={styles.root} aria-label="Quantity">
      <button
        type="button"
        className={styles.btn}
        onClick={decrease}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={increase}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
