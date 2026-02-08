import { forwardRef,InputHTMLAttributes } from "react";

import styles from "./input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
  required?: boolean;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      error,
      fullWidth = false,
      required = false,
      label,
      ...props
    },
    ref,
  ) => {
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
        {label && (
          <span
            className={`${styles.label} ${required ? styles.required : ""}`}
          >
            {label}
          </span>
        )}
        <input
          ref={ref}
          className={classNames}
          {...props}
          required={required}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
