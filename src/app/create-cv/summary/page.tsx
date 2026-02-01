import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import styles from "./page.module.scss";

const stepTitle = "Summary";

export default function SummaryPage() {
  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 6"
        title={stepTitle}
        description="Write a compelling professional summary that captures your unique value proposition."
      />

      <section className={styles.wrapper}>
        <form className={styles.form}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Professional summary</span>
            <Input
              placeholder="Experienced professional with X years of expertise in..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Career objectives</span>
            <Input
              placeholder="Seeking to leverage my skills in a challenging role..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Key achievements</span>
            <Input
              placeholder="Increased revenue by X%, led team of Y people, completed Z projects..."
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        backHref="/create-cv/skills"
        nextHref="/create-cv/other-sections"
      />
    </div>
  );
}
