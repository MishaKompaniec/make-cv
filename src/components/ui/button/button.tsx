import { ButtonHTMLAttributes, ReactNode } from "react";
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
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    size !== "md" ? styles[size] : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
