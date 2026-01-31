import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import styles from "./page.module.scss";

const stepTitle = "Work experience";

export default function WorkExperiencePage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.stepBadge}>Step 2</p>
          <h1>{stepTitle}</h1>
          <p className={styles.description}>
            Add your work experience to show employers your career progression
            and achievements.
          </p>
        </header>

        <form className={styles.form}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Job title</span>
            <Input placeholder="Senior Product Designer" fullWidth />
          </label>

          <div className={styles.row}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Company</span>
              <Input placeholder="Tech Company Inc." fullWidth />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.label}>Location</span>
              <Input placeholder="San Francisco, CA" fullWidth />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Start date</span>
              <Input placeholder="January 2022" fullWidth />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.label}>End date</span>
              <Input placeholder="Present" fullWidth />
            </label>
          </div>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Description</span>
            <Input
              placeholder="Describe your responsibilities and achievements..."
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        backHref="/create-cv/contact-details"
        nextHref="/create-cv/education"
      />
    </div>
  );
}
