import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./input.module.scss";

type InputSize = "sm" | "md" | "lg" | "xl";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = "md",
      error = false,
      fullWidth = false,
      className = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const classNames = [
      styles.input,
      inputSize !== "md" ? styles[inputSize] : "",
      error ? styles.error : "",
      fullWidth ? styles.fullWidth : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <input className={classNames} disabled={disabled} ref={ref} {...props} />
    );
  },
);

Input.displayName = "Input";
