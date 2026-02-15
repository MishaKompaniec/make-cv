"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import type { CvBuilderStep } from "@/hooks/use-cv-builder-flow";

import styles from "./sidebar.module.scss";

type Props = {
  previousPath: string;
  currentStep: CvBuilderStep | null;
  currentStepNumber: number;
  totalSteps: number;
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export function MobileHeader({
  previousPath,
  currentStep,
  currentStepNumber,
  totalSteps,
  isMenuOpen,
  toggleMenu,
}: Props) {
  const { data: session } = useSession();

  const email = session?.user?.email ?? "";
  const avatarUrl = session?.user?.image;

  const getInitial = (value?: string | null) => {
    if (!value) return "?";

    const trimmed = value.trim();

    return trimmed ? trimmed[0].toUpperCase() : "?";
  };

  if (!currentStep) {
    return null;
  }

  return (
    <div className={styles.mobileHeader}>
      <Link
        href={previousPath}
        className={styles.mobileHeaderIconButton}
        aria-label="Go back"
      >
        <svg
          className={styles.mobileHeaderIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <button
        type="button"
        className={styles.mobileHeaderCenter}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label="Toggle steps"
      >
        <div className={styles.mobileHeaderStepCount}>
          Step {currentStepNumber} of {totalSteps}
        </div>

        <div className={styles.mobileHeaderTitleRow}>
          <div className={styles.mobileHeaderTitle}>{currentStep.title}</div>

          <svg
            className={`${styles.mobileHeaderChevron}${
              isMenuOpen ? ` ${styles.mobileHeaderChevronOpen}` : ""
            }`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className={styles.mobileHeaderIconButton} aria-label="User profile">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="User avatar"
            width={44}
            height={44}
            className={styles.mobileHeaderAvatarImage}
          />
        ) : (
          <div className={styles.mobileHeaderAvatarInitial}>
            {getInitial(email)}
          </div>
        )}
      </div>
    </div>
  );
}
