"use client";

import { PageHeader } from "@/components/layout/page-header/page-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import styles from "./page.module.scss";

const stepTitle = "Choose template";

export default function ChooseTemplatePage() {
  const handleNextClick = () => {
    window.location.href = "/create-cv/contact-details";
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Choose a template to start building your CV."
      />

      <div className={styles.content}>
        <div className={styles.placeholderCard}>Templates will be here</div>
      </div>

      <NavigationFooter
        showBack={false}
        nextText="Next"
        nextHref="/create-cv/contact-details"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
