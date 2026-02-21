"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button/button";

import styles from "./navigation-footer.module.scss";

interface NavigationFooterProps {
  backHref?: string;
  onBackClick?: () => void;
  nextHref?: string;
  onNextClick?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}

export function NavigationFooter({
  backHref,
  onBackClick,
  nextHref,
  onNextClick,
  nextLabel = "Next Step",
  nextDisabled = false,
  nextLoading = false,
}: NavigationFooterProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backHref) {
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
          loading={nextLoading}
        >
          {nextLabel}
        </Button>
      </div>
    </footer>
  );
}
