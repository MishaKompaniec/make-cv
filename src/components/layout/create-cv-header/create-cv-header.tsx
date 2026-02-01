import styles from "./create-cv-header.module.scss";

interface CreateCvHeaderProps {
  stepNumber: string;
  title: string;
  description: string;
}

export function CreateCvHeader({
  stepNumber,
  title,
  description,
}: CreateCvHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.flexContainer}>
        <h1>{title}</h1>
        <div className={styles.stepBadge}>{stepNumber}</div>
      </div>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
