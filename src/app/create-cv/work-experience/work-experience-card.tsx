import { forwardRef } from "react";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import {
  DatePicker,
  type DatePickerValue,
} from "@/components/ui/date-picker/date-picker";
import styles from "./page.module.scss";

export type ExperienceItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  city: string;
  startDate?: DatePickerValue;
  endDate?: DatePickerValue;
  description: string;
};

type WorkExperienceCardProps = {
  experience: ExperienceItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<Omit<ExperienceItem, "id">>) => void;
};

export const WorkExperienceCard = forwardRef<
  HTMLDivElement,
  WorkExperienceCardProps
>(
  (
    {
      experience,
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
              aria-label="Move work experience up"
              onClick={onMoveUp}
            />
          )}

          {canMoveDown && (
            <button
              type="button"
              className={`${styles.reorderExperienceButton} ${styles.reorderUp}`}
              aria-label="Move work experience down"
              onClick={onMoveDown}
            />
          )}

          <button
            type="button"
            className={styles.removeExperienceButton}
            aria-label="Remove work experience"
            onClick={onRemove}
          >
            ×
          </button>
        </div>

        <div className={styles.experienceRowSingle}>
          <Input
            label="Job title"
            placeholder="Senior Product Designer"
            fullWidth
            value={experience.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
          />
        </div>

        <div className={styles.experienceRowTwoCols}>
          <Input
            label="Company name"
            placeholder="Tech Company Inc."
            fullWidth
            value={experience.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
          />
          <Input
            label="City"
            placeholder="San Francisco"
            fullWidth
            value={experience.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </div>

        <div className={styles.experienceDescription}>
          <div className={styles.experienceDatesRow}>
            <DatePicker
              label="Start date"
              placeholder="MM/YYYY"
              fullWidth
              value={experience.startDate}
              onChange={(v) => onChange({ startDate: v })}
            />
            <DatePicker
              label="End date"
              placeholder="MM/YYYY"
              fullWidth
              value={experience.endDate}
              onChange={(v) => onChange({ endDate: v })}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Add 3–5 bullet points about your role and achievements"
            fullWidth
            value={experience.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>
      </div>
    );
  },
);

WorkExperienceCard.displayName = "WorkExperienceCard";
