"use client";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";

export function StepItem({
  step,
  index,
  isActive,
  isCompleted,
}: {
  step: CvBuilderStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
}) {
  const className = `${styles.step} ${isActive ? styles.activeStep : ""} ${
    isCompleted ? styles.completedStep : ""
  }`;

  return (
    <div className={className}>
      <span className={styles.stepNumber}>{isCompleted ? "✓" : index + 1}</span>
      <span className={styles.stepTitle}>{step.title}</span>
    </div>
  );
}
