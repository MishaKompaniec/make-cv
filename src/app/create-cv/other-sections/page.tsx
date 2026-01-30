import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import styles from "./page.module.scss";

const stepTitle = "Other sections";

export default function OtherSectionsPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.stepBadge}>Step 6</p>
          <h1>{stepTitle}</h1>
          <p className={styles.description}>
            Add additional sections to make your CV more comprehensive and
            personalized.
          </p>
        </header>

        <form className={styles.form}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Projects</span>
            <Input
              placeholder="Personal projects, freelance work, open source contributions..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Volunteer experience</span>
            <Input
              placeholder="Community service, nonprofit work, charitable activities..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Awards and honors</span>
            <Input
              placeholder="Employee of the Month, Best Project Award, Academic distinctions..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Publications</span>
            <Input
              placeholder="Articles, research papers, blog posts, books..."
              fullWidth
            />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>References</span>
            <Input
              placeholder="Available upon request or specific contact information..."
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        backHref="/create-cv/summary"
        nextHref="/create-cv/finalize"
      />
    </div>
  );
}
