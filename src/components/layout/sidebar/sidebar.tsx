"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams,usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button/button";

import styles from "./sidebar.module.scss";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const cvId = params.id as string;
  const isCreateFlow = pathname.startsWith("/cv-builder/") && !!cvId;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const steps = useMemo(
    () => [
      { title: "Choose template", path: `/cv-builder/${cvId}` },
      { title: "Contact details", path: `/cv-builder/${cvId}/contact-details` },
      { title: "Summary", path: `/cv-builder/${cvId}/summary` },
      { title: "Work experience", path: `/cv-builder/${cvId}/work-experience` },
      { title: "Education", path: `/cv-builder/${cvId}/education` },
      { title: "Skills", path: `/cv-builder/${cvId}/skills` },
      { title: "Other sections", path: `/cv-builder/${cvId}/other-sections` },
      { title: "Finalize", path: `/cv-builder/${cvId}/finalize` },
    ],
    [cvId],
  );

  const currentStepIndex = useMemo(() => {
    const currentIndex = steps.findIndex((step) => step.path === pathname);
    return currentIndex >= 0 ? currentIndex : 0;
  }, [pathname, steps]);

  const currentStep = steps[currentStepIndex];
  const stepCount = steps.length;
  const currentStepNumber = currentStepIndex + 1;

  const previousStepPath = useMemo(() => {
    if (currentStepIndex === 0) return "/";
    return steps[currentStepIndex - 1]?.path ?? `/cv-builder/${cvId}`;
  }, [currentStepIndex, steps, cvId]);

  useEffect(() => {
    document.body.classList.toggle("create-flow", isCreateFlow);
    return () => {
      document.body.classList.remove("create-flow");
    };
  }, [isCreateFlow]);

  return (
    <aside key={pathname} className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        Makemycv
      </Link>

      {isCreateFlow ? (
        <>
          <div className={styles.mobileHeader}>
            <Link
              href={previousStepPath}
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
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle steps"
            >
              <div className={styles.mobileHeaderStepCount}>
                Step {currentStepNumber} of {stepCount}
              </div>
              <div className={styles.mobileHeaderTitleRow}>
                <div className={styles.mobileHeaderTitle}>
                  {currentStep.title}
                </div>
                <svg
                  className={`${styles.mobileHeaderChevron}${
                    isMobileMenuOpen ? ` ${styles.mobileHeaderChevronOpen}` : ""
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

            <div className={styles.mobileHeaderIconButton} aria-hidden="true" />
          </div>

          {isMobileMenuOpen ? (
            <button
              type="button"
              className={styles.mobileOverlay}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close steps"
            />
          ) : null}

          <div
            className={`${styles.mobileDropdown}${
              isMobileMenuOpen ? ` ${styles.mobileDropdownOpen}` : ""
            }`}
          >
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActiveStep = index === currentStepIndex;
              const isCompletedStep = index < currentStepIndex;

              return (
                <div key={step.path} className={styles.mobileDropdownItem}>
                  <div
                    className={`${styles.step} ${
                      isActiveStep ? styles.activeStep : ""
                    } ${isCompletedStep ? styles.completedStep : ""}`}
                  >
                    <span className={styles.stepNumber}>
                      {isCompletedStep ? "✓" : stepNumber}
                    </span>
                    <span className={styles.stepTitle}>{step.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.steps}>
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActiveStep = index === currentStepIndex;
              const isCompletedStep = index < currentStepIndex;

              return (
                <div key={step.path} className={styles.stepWrapper}>
                  <div
                    className={`${styles.step} ${
                      isActiveStep ? styles.activeStep : ""
                    } ${isCompletedStep ? styles.completedStep : ""}`}
                  >
                    <span className={styles.stepNumber}>
                      {isCompletedStep ? "✓" : stepNumber}
                    </span>
                    <span className={styles.stepTitle}>{step.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <nav className={styles.nav}>
            <Link
              href="/"
              className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}
            >
              My CV
            </Link>
          </nav>

          <div className={styles.account}>
            {status === "authenticated" ? (
              <>
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className={styles.avatar}
                  />
                )}
                <div className={styles.email}>
                  {session.user?.email ?? "Account"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="md"
                onClick={() => signIn("google")}
              >
                Sign in
              </Button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
