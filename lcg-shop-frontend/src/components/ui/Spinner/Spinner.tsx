import styles from "./Spinner.module.css";

export function Spinner() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
}
