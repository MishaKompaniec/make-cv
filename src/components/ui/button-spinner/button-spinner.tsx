import styles from "./button-spinner.module.scss";

interface ButtonSpinnerProps {
  size?: number;
}

export function ButtonSpinner({ size = 20 }: ButtonSpinnerProps) {
  return (
    <span
      className={styles.spinner}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
