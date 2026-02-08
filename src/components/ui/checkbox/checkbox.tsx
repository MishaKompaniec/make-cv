"use client";

import { forwardRef } from "react";
import styles from "./checkbox.module.scss";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { checked, onChange, disabled = false, className = "", label, ...props },
    ref,
  ) => {
    const isChecked = Boolean(checked);
    return (
      <label
        className={`${styles.checkboxContainer} ${disabled ? styles.disabled : ""} ${className}`}
      >
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            ref={ref}
            checked={isChecked}
            onChange={onChange}
            disabled={disabled}
            className={styles.checkboxInput}
            {...props}
          />
          <div
            className={`${styles.checkboxCustom} ${isChecked ? styles.checked : ""}`}
          >
            {isChecked && (
              <svg
                className={styles.checkmark}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 4.5L6 12L2.5 8.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
        {label && <span className={styles.checkboxLabel}>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
