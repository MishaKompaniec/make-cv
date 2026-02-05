"use client";

import { Button } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import styles from "./navigation-footer.module.scss";

interface NavigationFooterProps {
  backHref?: string;
  nextHref?: string;

  onNextClick?: () => void;

  nextLabel?: string;
  nextDisabled?: boolean;
}

export function NavigationFooter({
  backHref,
  nextHref,
  onNextClick,
  nextLabel = "Next Step",
  nextDisabled = false,
}: NavigationFooterProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.push("/");
    }
  };

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick();
    } else if (nextHref) {
      router.push(nextHref);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>

        <Button
          variant="primary"
          onClick={handleNextClick}
          disabled={nextDisabled}
        >
          {nextLabel}
        </Button>
      </div>
    </footer>
  );
}
