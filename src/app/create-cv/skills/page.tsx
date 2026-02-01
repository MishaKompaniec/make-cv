import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import styles from "./page.module.scss";

const stepTitle = "Skills";

export default function SkillsPage() {
  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 5"
        title={stepTitle}
        description="Highlight your key skills and competencies that make you stand out to employers."
      />

      <section className={styles.wrapper}>
        <form className={styles.form}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Technical skills</span>
            <Input
              placeholder="JavaScript, React, Node.js, Python..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Soft skills</span>
            <Input
              placeholder="Communication, Leadership, Problem-solving..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Languages</span>
            <Input
              placeholder="English (Native), Spanish (Fluent), French (Basic)"
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Certifications</span>
            <Input
              placeholder="AWS Certified Developer, Google Analytics Certification..."
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        backHref="/create-cv/education"
        nextHref="/create-cv/summary"
      />
    </div>
  );
}
