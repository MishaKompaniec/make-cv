import { forwardRef, type TextareaHTMLAttributes } from "react";

import styles from "./textarea.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  fullWidth?: boolean;
  required?: boolean;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      error,
      fullWidth = false,
      required = false,
      label,
      onChange,
      value = "",
      maxLength,
      ...props
    },
    ref,
  ) => {
    const length = value?.toString().length ?? 0;

    const classNames = [
      styles.textarea,
      fullWidth ? styles.fullWidth : "",
      error ? styles.error : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.textareaWrapper}>
        {label && (
          <span
            className={`${styles.label} ${required ? styles.required : ""}`}
          >
            {label}
          </span>
        )}
        <textarea
          ref={ref}
          className={classNames}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          {...props}
          required={required}
        />
        {typeof maxLength === "number" && (
          <div className={styles.metaRow}>
            <span className={styles.counter}>
              {length}/{maxLength}
            </span>
          </div>
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
