import styles from "./page-header.module.scss";

interface PageHeaderProps {
  stepNumber: string;
  title: string;
  description: string;
}

export function PageHeader({ stepNumber, title, description }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.stepBadge}>{stepNumber}</div>
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
