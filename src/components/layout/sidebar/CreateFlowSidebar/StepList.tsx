"use client";

import { memo } from "react";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";
import { StepItem } from "./StepItem";

type Props = {
  steps: CvBuilderStep[];
  currentIndex: number;
};

export const StepList = memo(function StepList({ steps, currentIndex }: Props) {
  if (!steps.length) return null;

  return (
    <div className={styles.steps} role="list">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.key} className={styles.stepWrapper} role="listitem">
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
});
