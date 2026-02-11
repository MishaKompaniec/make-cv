"use client";

import type { ReactNode } from "react";

import styles from "./cv-card.module.scss";

type Props = {
  className?: string;
  ariaHidden?: boolean;
  preview: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  actionsLeft: ReactNode;
  actionsRight: ReactNode;
  download: ReactNode;
};

export function CvCardLayout({
  className,
  ariaHidden,
  preview,
  title,
  meta,
  actionsLeft,
  actionsRight,
  download,
}: Props) {
  const rootClassName = className
    ? `${styles.cvCard} ${className}`
    : styles.cvCard;

  return (
    <div className={rootClassName} aria-hidden={ariaHidden}>
      {preview}

      <div className={styles.cvInfo}>
        {title}

        <div className={styles.meta}>{meta}</div>

        <div className={styles.actions}>
          <div className={styles.actionsLeft}>{actionsLeft}</div>
          {actionsRight}
        </div>

        <div className={styles.downloadRow}>{download}</div>
      </div>
    </div>
  );
}
