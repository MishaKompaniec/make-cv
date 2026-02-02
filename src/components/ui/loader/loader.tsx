"use client";

import styles from "./loader.module.scss";

interface LoaderProps {
  size?: number;
}

export function Loader({ size = 28 }: LoaderProps) {
  return (
    <span
      className={styles.loader}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 9)) }}
      aria-label="Loading"
      role="status"
    />
  );
}
