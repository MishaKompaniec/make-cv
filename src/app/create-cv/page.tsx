import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { PageHeader } from "@/components/layout/page-header/page-header";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

export default function CreateCvPage() {
  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Tell us who you are so we can place your contact details prominently in every template."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form className={styles.form}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Full name</span>
              <Input placeholder="Jane Doe" fullWidth />
            </label>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Job title</span>
                <Input placeholder="Product Designer" fullWidth />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>City</span>
                <Input placeholder="Copenhagen, Denmark" fullWidth />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Phone number</span>
                <Input type="tel" placeholder="(+45) 1234 5678" fullWidth />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Email</span>
                <Input type="email" placeholder="jane@email.com" fullWidth />
              </label>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Birthdate</span>
                <Input type="date" fullWidth />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Postal code</span>
                <Input placeholder="1234" fullWidth />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>LinkedIn</span>
                <Input placeholder="linkedin.com/in/janedoe" fullWidth />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Git</span>
                <Input placeholder="github.com/janedoe" fullWidth />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Nationality</span>
                <Input placeholder="Danish" fullWidth />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Work permit</span>
                <Input placeholder="EU Citizen" fullWidth />
              </label>
            </div>
          </form>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>CV Preview</div>
          <div className={styles.previewContent}>
            Your CV preview will appear here as you fill in the details
          </div>
        </div>
      </section>

      <NavigationFooter
        showBack={false}
        nextHref="/create-cv/work-experience"
      />
    </div>
  );
}
