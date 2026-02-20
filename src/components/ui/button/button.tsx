import { ButtonHTMLAttributes, ReactNode } from "react";

import { ButtonSpinner } from "@/components/ui/button-spinner/button-spinner";

import styles from "./button.module.scss";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  const spinnerTone =
    variant === "outline" || variant === "ghost" ? "accent" : "default";

  const classNames = [
    styles.button,
    styles[variant],
    size !== "md" ? styles[size] : "",
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} disabled={disabled || loading} {...props}>
      {loading ? (
        <ButtonSpinner size={20} tone={spinnerTone} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
