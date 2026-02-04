import { forwardRef } from "react";

import { Input } from "@/components/ui/input/input";
import styles from "./page.module.scss";

export type InterestItem = {
  id: string;
  title: string;
};

type InterestErrors = {
  title?: string;
};

interface InterestsCardProps {
  interest: InterestItem;
  errors?: InterestErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<InterestItem, "id">>) => void;
}

export const InterestsCard = forwardRef<HTMLDivElement, InterestsCardProps>(
  (
    {
      interest,
      errors,
      canMoveUp,
      canMoveDown,
      onMoveUp,
      onMoveDown,
      onRemove,
      onChange,
    },
    ref,
  ) => {
    return (
      <div className={styles.itemCard} ref={ref}>
        <div className={styles.skillCardControls}>
          {canMoveUp && (
            <button
              type="button"
              className={styles.reorderSkillButton}
              aria-label="Move interest up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderSkillButton} ${styles.reorderUp}`}
              aria-label="Move interest down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeSkillButton}
            aria-label="Remove interest"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.itemCardBody}>
          <Input
            label="Interest"
            value={interest.title}
            onChange={(e) => onChange({ title: e.target.value })}
            error={errors?.title}
            required
            fullWidth
            maxLength={25}
          />
        </div>
      </div>
    );
  },
);

InterestsCard.displayName = "InterestsCard";
