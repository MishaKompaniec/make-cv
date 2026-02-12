import { forwardRef } from "react";

import { Input } from "@/components/ui/input/input";
import { Select } from "@/components/ui/select/select";

import styles from "./page.module.scss";

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export type LanguageItem = {
  id: string;
  name: string;
  level: LanguageLevel;
};

type LanguageErrors = {
  name?: string;
};

interface LanguagesCardProps {
  language: LanguageItem;
  errors?: LanguageErrors;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<LanguageItem, "id">>) => void;
}

const LEVEL_OPTIONS: LanguageLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
];

const LEVEL_SELECT_OPTIONS = LEVEL_OPTIONS.map((v) => ({ value: v, label: v }));

export const LanguagesCard = forwardRef<HTMLDivElement, LanguagesCardProps>(
  (
    {
      language,
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
              aria-label="Move language up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderSkillButton} ${styles.reorderUp}`}
              aria-label="Move language down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeSkillButton}
            aria-label="Remove language"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.itemCardBody}>
          <div className={styles.row2}>
            <Input
              label="Language name"
              value={language.name}
              onChange={(e) => onChange({ name: e.target.value })}
              error={errors?.name}
              required
              fullWidth
              maxLength={25}
            />

            <Select
              label="Level"
              value={language.level}
              onChange={(nextValue) =>
                onChange({ level: nextValue as LanguageLevel })
              }
              options={LEVEL_SELECT_OPTIONS}
            />
          </div>
        </div>
      </div>
    );
  },
);

LanguagesCard.displayName = "LanguagesCard";
