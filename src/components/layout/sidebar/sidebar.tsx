"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./sidebar.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button/button";

export function Sidebar() {
  const pathname = usePathname();
  const isCreateFlow = pathname.startsWith("/create-cv");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const steps = [
    { title: "Choose template", path: "/create-cv" },
    { title: "Contact details", path: "/create-cv/contact-details" },
    { title: "Summary", path: "/create-cv/summary" },
    { title: "Work experience", path: "/create-cv/work-experience" },
    { title: "Education", path: "/create-cv/education" },
    { title: "Skills", path: "/create-cv/skills" },
    { title: "Other sections", path: "/create-cv/other-sections" },
    { title: "Finalize", path: "/create-cv/finalize" },
  ];

  const currentStepIndex = useMemo(() => {
    const currentIndex = steps.findIndex((step) => step.path === pathname);
    return currentIndex >= 0 ? currentIndex : 0;
  }, [pathname, steps]);

  const currentStep = steps[currentStepIndex];
  const stepCount = steps.length;
  const currentStepNumber = currentStepIndex + 1;

  const previousStepPath = useMemo(() => {
    if (currentStepIndex === 0) return "/";
    return steps[currentStepIndex - 1]?.path ?? "/create-cv";
  }, [currentStepIndex, steps]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("create-flow", isCreateFlow);
    return () => {
      document.body.classList.remove("create-flow");
    };
  }, [isCreateFlow]);

  return (
    <aside className={styles.sidebar}>
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
                  <img
                    src={session.user.image}
                    alt="User avatar"
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
