"use client";

import { Button } from "@/components/ui/button/button";

import styles from "./EmptyState.module.scss";

type Props = {
  isCreating: boolean;
  onCreate: () => void;
};

export function EmptyState({ isCreating, onCreate }: Props) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyContent}>
        <div aria-hidden className={styles.iconSlot}>
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="6" width="60" height="60" rx="12" fill="#f5f2f2ff" />
            <rect x="16" y="16" width="40" height="8" rx="2" fill="#daf0e0" />
            <rect x="16" y="28" width="28" height="6" rx="2" fill="#2f855a" />
            <rect x="16" y="38" width="24" height="6" rx="2" fill="#bcdbc5ff" />
            <rect x="16" y="48" width="32" height="6" rx="2" fill="#daf0e0" />
            <circle cx="52" cy="42" r="7" stroke="#2f855a" strokeWidth="2.5" />
            <path
              d="M52 38v4l2.5 2.5"
              stroke="#2f855a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Create your first CV</h2>
        <p className={styles.text}>
          Start by creating a new CV, then customize sections, colors, and download when ready.
        </p>
        <Button variant="primary" size="md" onClick={onCreate} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create CV"}
        </Button>
      </div>
    </div>
  );
}
