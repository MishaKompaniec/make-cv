import { useState } from "react";

import { PreviewModal } from "@/components/layout/modal-preview/preview";
import { Button } from "@/components/ui/button/button";

import styles from "./builder-header.module.scss";

interface PageHeaderProps {
  stepNumber: string;
  title: string;
  description: string;
  hidePreviewButton?: boolean;
}

export function PageHeader({
  stepNumber,
  title,
  description,
  hidePreviewButton,
}: PageHeaderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.flexContainer}>
          <h1>{title}</h1>
          <div className={styles.stepBadge}>{stepNumber}</div>
        </div>
        <p className={styles.description}>{description}</p>

        {!hidePreviewButton ? (
          <div>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsPreviewOpen(true)}
            >
              Preview CV
            </Button>
          </div>
        ) : null}
      </header>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
