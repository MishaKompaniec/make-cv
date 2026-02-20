import styles from "./button-spinner.module.scss";

interface ButtonSpinnerProps {
  size?: number;
  tone?: "default" | "accent";
}

export function ButtonSpinner({
  size = 20,
  tone = "default",
}: ButtonSpinnerProps) {
  const className = [styles.spinner, tone === "accent" ? styles.accent : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={className}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
