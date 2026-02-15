"use client";

import { memo } from "react";

import { CvCard, type CvListItem } from "@/components/cv-card/cv-card";
import { CvGridSkeleton } from "@/components/cv-card-skeleton/cv-card-skeleton";

import styles from "./CvGrid.module.scss";

type Props = {
  cvs: CvListItem[];
  isLoading: boolean;
  isCreating: boolean;
  deletingId: string | null;
  duplicatingId: string | null;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onRequestDelete: (id: string) => void;
  onRequestDuplicate: (id: string) => void;
  onPaywall: (id: string) => void;
};

function CvGridImpl({
  cvs,
  isLoading,
  isCreating,
  deletingId,
  duplicatingId,
  onCreate,
  onEdit,
  onRequestDelete,
  onRequestDuplicate,
  onPaywall,
}: Props) {
  return (
    <div className={styles.grid}>
      <button
        onClick={onCreate}
        className={styles.createCard}
        disabled={isCreating}
        type="button"
      >
        <div className={styles.plusIcon}>+</div>
        <p>{isCreating ? "Creating..." : "Create CV"}</p>
      </button>

      {isLoading ? (
        <CvGridSkeleton count={2} />
      ) : (
        cvs.map((cv) => (
          <CvCard
            key={cv.id}
            cv={cv}
            deletingId={deletingId}
            duplicatingId={duplicatingId}
            onEdit={onEdit}
            onRequestDelete={onRequestDelete}
            onRequestDuplicate={onRequestDuplicate}
            onPaywall={onPaywall}
          />
        ))
      )}
    </div>
  );
}

export const CvGrid = memo(CvGridImpl);
