import { forwardRef } from "react";

import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";

import styles from "./page.module.scss";

export type CustomSectionItem = {
  id: string;
  title: string;
  description: string;
};

type CustomSectionErrors = {
  title?: string;
};

interface CustomSectionCardProps {
  section: CustomSectionItem;
  errors?: CustomSectionErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<CustomSectionItem, "id">>) => void;
}

export const CustomSectionCard = forwardRef<
  HTMLDivElement,
  CustomSectionCardProps
>(
  (
    {
      section,
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
              aria-label="Move custom section up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderSkillButton} ${styles.reorderUp}`}
              aria-label="Move custom section down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeSkillButton}
            aria-label="Remove custom section"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.itemCardBody}>
          <Input
            label="Section title"
            value={section.title}
            onChange={(e) => onChange({ title: e.target.value })}
            error={errors?.title}
            required
            fullWidth
          />

          <Textarea
            label="Description"
            placeholder="Describe the section"
            fullWidth
            value={section.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>
      </div>
    );
  },
);

CustomSectionCard.displayName = "CustomSectionCard";
