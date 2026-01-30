import { Button } from "@/components/ui/button/button";
import styles from "./page.module.scss";

export default function MyCVPage() {
  return (
    <div className={styles.container}>
      <h1>My CV</h1>

      <div className={styles.grid}>
        <div className={styles.createCard}>
          <div className={styles.plusIcon}>+</div>
          <p>Create CV</p>
        </div>

        <div className={styles.cvCard}>
          <div className={styles.cvPreview}>
            <div className={styles.previewHeader}></div>
            <div className={styles.previewContent}>
              <div className={styles.previewLine}></div>
              <div className={`${styles.previewLine} ${styles.short}`}></div>
              <div className={styles.previewLine}></div>
            </div>
          </div>
          <div className={styles.cvInfo}>
            <h3>CV of Misha</h3>
            <p className={styles.updated}>Updated 2 hours ago</p>
            <div className={styles.actions}>
              <Button variant="ghost" size="sm">
                Download
              </Button>
              <Button variant="ghost" size="sm">
                Duplicate
              </Button>
              <Button variant="ghost" size="sm">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
