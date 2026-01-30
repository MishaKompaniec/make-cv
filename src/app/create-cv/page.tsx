import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

export default function CreateCvPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.stepBadge}>Step 1</p>
          <h1>{stepTitle}</h1>
          <p className={styles.description}>
            Tell us who you are so we can place your contact details prominently
            in every template.
          </p>
        </header>

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
              <span className={styles.label}>Email address</span>
              <Input type="email" placeholder="jane@email.com" fullWidth />
            </label>

            <label className={styles.fieldGroup}>
              <span className={styles.label}>Phone number</span>
              <Input type="tel" placeholder="(+45) 1234 5678" fullWidth />
            </label>
          </div>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>Professional summary</span>
            <Input
              placeholder="Add a short pitch that highlights your value"
              fullWidth
            />
          </label>
        </form>
      </section>

      <NavigationFooter
        showBack={false}
        nextHref="/create-cv/work-experience"
      />
    </div>
  );
}
