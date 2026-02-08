import { forwardRef } from "react";

import { Input } from "@/components/ui/input/input";

import styles from "./page.module.scss";

export type SkillItem = {
  id: string;
  title: string;
};

type SkillsCardProps = {
  skill: SkillItem;
  errors?: {
    title?: string;
  };
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<SkillItem, "id">>) => void;
};

export const SkillsCard = forwardRef<HTMLDivElement, SkillsCardProps>(
  (
    {
      skill,
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
      <div className={styles.skillCard} ref={ref}>
        <div className={styles.skillCardControls}>
          {canMoveUp && (
            <button
              type="button"
              className={styles.reorderSkillButton}
              aria-label="Move skill up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderSkillButton} ${styles.reorderUp}`}
              aria-label="Move skill down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeSkillButton}
            aria-label="Remove skill"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.skillRowSingle}>
          <Input
            label="Skill Title"
            placeholder="Communication"
            fullWidth
            value={skill.title}
            onChange={(e) => onChange({ title: e.target.value })}
            error={errors?.title}
            required
          />
        </div>
      </div>
    );
  },
);

SkillsCard.displayName = "SkillsCard";
