import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import styles from "./page.module.scss";

const stepTitle = "Finalize";

export default function FinalizePage() {
  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 8"
        title={stepTitle}
        description="Review your CV and make final adjustments before downloading or sharing."
      />

      <section className={styles.wrapper}>
        <form className={styles.form}>
          <div className={styles.previewSection}>
            <h2>CV Preview</h2>
            <div className={styles.preview}>
              <p>Your CV will appear here for final review</p>
            </div>
          </div>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>CV filename</span>
            <Input placeholder="John_Doe_CV_2024" fullWidth />
          </label>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Template selection</span>
            <Input placeholder="Professional Template" fullWidth />
          </label>

          <div className={styles.exportOptions}>
            <h3>Export options</h3>
            <div className={styles.options}>
              <label className={styles.option}>
                <input type="checkbox" defaultChecked />
                <span>PDF format</span>
              </label>
              <label className={styles.option}>
                <input type="checkbox" />
                <span>Word format</span>
              </label>
              <label className={styles.option}>
                <input type="checkbox" />
                <span>Plain text</span>
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Button size="lg">Download CV</Button>
            <Button variant="ghost" type="button">
              Save draft
            </Button>
          </div>
        </form>
      </section>

      <NavigationFooter backHref="/create-cv/other-sections" showNext={false} />
    </div>
  );
}
