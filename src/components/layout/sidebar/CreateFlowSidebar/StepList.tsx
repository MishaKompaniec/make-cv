"use client";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";
import { StepItem } from "./StepItem";

export function StepList({
  steps,
  currentIndex,
}: {
  steps: CvBuilderStep[];
  currentIndex: number;
}) {
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.path} className={styles.stepWrapper}>
            <StepItem
              step={step}
              index={index}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          </div>
        );
      })}
    </div>
  );
}
