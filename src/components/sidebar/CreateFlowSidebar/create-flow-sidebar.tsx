"use client";

import { useState } from "react";

import { MobileDropdown } from "@/components/layout/sidebar/CreateFlowSidebar/MobileDropdown";
import { MobileHeader } from "@/components/layout/sidebar/CreateFlowSidebar/MobileHeader";
import { StepList } from "@/components/layout/sidebar/CreateFlowSidebar/StepList";
import { useCvBuilderFlow } from "@/hooks/use-cv-builder-flow";

import styles from "./create-flow-sidebar.module.scss";

export function CreateFlowSidebar({ cvId }: { cvId: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const flow = useCvBuilderFlow(cvId);

  return (
    <>
      <MobileHeader
        previousPath={flow.previousPath}
        currentStep={flow.currentStep}
        currentStepNumber={flow.currentStepNumber}
        totalSteps={flow.totalSteps}
        isMenuOpen={isMobileMenuOpen}
        toggleMenu={() => setIsMobileMenuOpen((v) => !v)}
      />

      {isMobileMenuOpen ? (
        <button
          type="button"
          className={styles.mobileOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close steps"
        />
      ) : null}

      <MobileDropdown
        steps={flow.steps}
        currentIndex={flow.currentIndex}
        isOpen={isMobileMenuOpen}
      />

      <StepList steps={flow.steps} currentIndex={flow.currentIndex} />
    </>
  );
}
