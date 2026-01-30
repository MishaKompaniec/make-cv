import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import styles from "./navigation-footer.module.scss";

interface NavigationFooterProps {
  backHref?: string;
  nextHref?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextText?: string;
}

export function NavigationFooter({
  backHref,
  nextHref,
  showBack = true,
  showNext = true,
  nextText = "Next",
}: NavigationFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {showBack && backHref && (
          <Link href={backHref} className={styles.backButton}>
            <Button variant="outline">Back</Button>
          </Link>
        )}

        {showNext && nextHref && (
          <Link href={nextHref} className={styles.nextButton}>
            <Button>{nextText}</Button>
          </Link>
        )}
      </div>
    </footer>
  );
}
