import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import styles from "./page.module.scss";

const stepTitle = "Education";

export default function EducationPage() {
  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 5"
        title={stepTitle}
        description="Add your educational background to showcase your qualifications and knowledge."
      />

      <section className={styles.wrapper}>
        <form className={styles.form}>
          <label className={styles.fieldGroup}>
            <span className={styles.label}>Degree</span>
            <Input
              placeholder="Bachelor of Science in Computer Science"
              fullWidth
            />
          </label>

          <div className={styles.row}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Institution</span>
              <Input placeholder="University of Technology" fullWidth />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.label}>Location</span>
              <Input placeholder="Boston, MA" fullWidth />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Start date</span>
              <Input placeholder="September 2018" fullWidth />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.label}>End date</span>
              <Input placeholder="May 2022" fullWidth />
            </label>
          </div>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Achievements</span>
            <Input
              placeholder="Dean's List, GPA: 3.8, Relevant coursework..."
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        backHref="/create-cv/work-experience"
        nextHref="/create-cv/skills"
      />
    </div>
  );
}
