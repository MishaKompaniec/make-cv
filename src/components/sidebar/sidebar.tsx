"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/ui/logo/logo";
import { useCvBuilderFlow } from "@/hooks/use-cv-builder-flow";

import { MobileDropdown } from "../layout/sidebar/CreateFlowSidebar/MobileDropdown";
import { MobileHeader } from "../layout/sidebar/CreateFlowSidebar/MobileHeader";
import { StepList } from "../layout/sidebar/CreateFlowSidebar/StepList";
import styles from "./sidebar.module.scss";

export function Sidebar() {
  const { id } = useParams();
  const cvId = Array.isArray(id) ? id[0] : id;
  const flow = useCvBuilderFlow(cvId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={`${styles.header} ${styles.desktopOnly}`}>
        <Logo />
      </Link>
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
    </aside>
  );
}
