"use client";

import { memo } from "react";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";
import { StepItem } from "./StepItem";

type Props = {
  steps: CvBuilderStep[];
  currentIndex: number;
  isOpen: boolean;
};

export const MobileDropdown = memo(function MobileDropdown({
  steps,
  currentIndex,
  isOpen,
}: Props) {
  if (!steps.length) {
    return null;
  }

  return (
    <div
      className={`${styles.mobileDropdown}${
        isOpen ? ` ${styles.mobileDropdownOpen}` : ""
      }`}
      role="menu"
      aria-hidden={!isOpen}
    >
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.key} className={styles.mobileDropdownItem}>
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
