"use client";

import { Button } from "@/components/ui/button/button";
import Link from "next/link";
import styles from "./navigation-footer.module.scss";

interface NavigationFooterProps {
  backHref?: string;
  nextHref?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextText?: string;
  onNextClick?: () => void;
}

export function NavigationFooter({
  backHref,
  nextHref,
  showBack = true,
  showNext = true,
  nextText = "Next",
  onNextClick,
}: NavigationFooterProps) {
  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick();
    } else if (nextHref) {
      window.location.href = nextHref;
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {showBack && backHref && (
          <Link href={backHref} className={styles.backButton}>
            <Button variant="outline">Back</Button>
          </Link>
        )}

        {showNext && (
          <div className={styles.nextButton}>
            <Button variant="primary" onClick={handleNextClick} fullWidth>
              {nextText}
            </Button>
          </div>
        )}
      </div>
    </footer>
  );
}
