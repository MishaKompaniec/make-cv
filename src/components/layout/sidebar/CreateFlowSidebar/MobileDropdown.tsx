"use client";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";
import { StepItem } from "./StepItem";

export function MobileDropdown({
  steps,
  currentIndex,
  isOpen,
}: {
  steps: CvBuilderStep[];
  currentIndex: number;
  isOpen: boolean;
}) {
  return (
    <div
      className={`${styles.mobileDropdown}${
        isOpen ? ` ${styles.mobileDropdownOpen}` : ""
      }`}
    >
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.path} className={styles.mobileDropdownItem}>
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
