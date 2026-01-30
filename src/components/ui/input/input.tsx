import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, fullWidth = false, ...props }, ref) => {
    const classNames = [
      styles.input,
      fullWidth ? styles.fullWidth : "",
      error ? styles.error : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.inputWrapper}>
        <input ref={ref} className={classNames} {...props} />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
