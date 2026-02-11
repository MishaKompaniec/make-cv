"use client";

import type { ReactNode } from "react";

import { CvCardLayout } from "@/components/cv-card/cv-card-layout";

import cardStyles from "../cv-card/cv-card.module.scss";
import styles from "./cv-card-skeleton.module.scss";

export function CvCardSkeletonLayout({ preview }: { preview?: ReactNode }) {
  return (
    <CvCardLayout
      ariaHidden
      preview={
        preview ?? (
          <div className={`${cardStyles.cvPreview} ${styles.shimmer}`} />
        )
      }
      title={<div className={`${styles.title} ${styles.shimmer}`} />}
      meta={
        <>
          <div className={`${styles.metaLine} ${styles.shimmer}`} />
          <div
            className={`${styles.metaLine} ${styles.metaLineSecondary} ${styles.shimmer}`}
          />
        </>
      }
      actionsLeft={
        <>
          <div className={`${styles.button} ${styles.shimmer}`} />
          <div className={`${styles.button} ${styles.shimmer}`} />
        </>
      }
      actionsRight={
        <div className={`${styles.deleteButton} ${styles.shimmer}`} />
      }
      download={
        <div className={`${styles.downloadButton} ${styles.shimmer}`} />
      }
    />
  );
}

export function CvCardSkeleton() {
  return <CvCardSkeletonLayout />;
}

export function CvGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <CvCardSkeleton key={`skeleton-${i}`} />
      ))}
    </>
  );
}
