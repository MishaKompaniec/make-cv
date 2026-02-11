import { forwardRef } from "react";

import {
  DatePicker,
  type DatePickerValue,
} from "@/components/ui/date-picker/date-picker";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";

import styles from "./page.module.scss";

export type EducationItem = {
  id: string;
  diploma: string;
  schoolName: string;
  schoolLocation: string;
  startDate?: DatePickerValue;
  endDate?: DatePickerValue;
  description: string;
};

type EducationCardProps = {
  education: EducationItem;
  errors?: {
    diploma?: string;
    schoolName?: string;
    schoolLocation?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  };
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<EducationItem, "id">>) => void;
};

export const EducationCard = forwardRef<HTMLDivElement, EducationCardProps>(
  (
    {
      education,
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
      <div className={styles.experienceCard} ref={ref}>
        <div className={styles.experienceCardControls}>
          {canMoveUp && (
            <button
              type="button"
              className={styles.reorderExperienceButton}
              aria-label="Move education up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderExperienceButton} ${styles.reorderUp}`}
              aria-label="Move education down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeExperienceButton}
            aria-label="Remove education"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.experienceRowSingle}>
          <Input
            label="Name of the diploma / study area"
            placeholder="BSc Computer Science"
            fullWidth
            value={education.diploma}
            onChange={(e) => onChange({ diploma: e.target.value })}
            error={errors?.diploma}
            required
          />
        </div>

        <div className={styles.experienceRowTwoCols}>
          <Input
            label="School name"
            placeholder="University of Technology"
            fullWidth
            value={education.schoolName}
            onChange={(e) => onChange({ schoolName: e.target.value })}
            error={errors?.schoolName}
          />
          <Input
            label="School location"
            placeholder="Boston, MA"
            fullWidth
            value={education.schoolLocation}
            onChange={(e) => onChange({ schoolLocation: e.target.value })}
            error={errors?.schoolLocation}
          />
        </div>

        <div className={styles.experienceDescription}>
          <div className={styles.experienceDatesRow}>
            <DatePicker
              label="Start date"
              placeholder="MM/YYYY"
              fullWidth
              value={education.startDate}
              onChange={(v) => onChange({ startDate: v })}
              error={errors?.startDate}
            />
            <DatePicker
              label="End date"
              placeholder="MM/YYYY"
              fullWidth
              value={education.endDate}
              onChange={(v) => onChange({ endDate: v })}
              error={errors?.endDate}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Describe your studies, achievements, thesis, etc."
            fullWidth
            value={education.description}
            onChange={(e) => onChange({ description: e.target.value })}
            error={errors?.description}
          />
        </div>
      </div>
    );
  },
);

EducationCard.displayName = "EducationCard";
