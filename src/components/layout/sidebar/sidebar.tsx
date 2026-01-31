"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.scss";

export function Sidebar() {
  const pathname = usePathname();
  const isCreateFlow = pathname.startsWith("/create-cv");

  const steps = [
    { title: "Choose template", path: "/create-cv" },
    { title: "Contact details", path: "/create-cv/contact-details" },
    { title: "Work experience", path: "/create-cv/work-experience" },
    { title: "Education", path: "/create-cv/education" },
    { title: "Skills", path: "/create-cv/skills" },
    { title: "Summary", path: "/create-cv/summary" },
    { title: "Other sections", path: "/create-cv/other-sections" },
    { title: "Finalize", path: "/create-cv/finalize" },
  ];

  const getCurrentStepIndex = () => {
    const currentIndex = steps.findIndex((step) => step.path === pathname);
    return currentIndex >= 0 ? currentIndex : -1;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        Makemycv
      </Link>

      {isCreateFlow ? (
        <div className={styles.steps}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActiveStep = index === currentStepIndex;
            const isCompletedStep = index < currentStepIndex;

            return (
              <div key={step.path} className={styles.stepWrapper}>
                <div
                  className={`${styles.step} ${isActiveStep ? styles.activeStep : ""} ${isCompletedStep ? styles.completedStep : ""}`}
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

          <div className={styles.account}>Account</div>
        </>
      )}
    </aside>
  );
}
