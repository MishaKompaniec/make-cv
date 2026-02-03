"use client";

import { Button } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import styles from "./navigation-footer.module.scss";

interface NavigationFooterProps {
  backHref?: string;
  nextHref?: string;

  onNextClick?: () => void;
}

export function NavigationFooter({
  backHref,
  nextHref,
  onNextClick,
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

        <Button variant="primary" onClick={handleNextClick}>
          Next Step
        </Button>
      </div>
    </footer>
  );
}
