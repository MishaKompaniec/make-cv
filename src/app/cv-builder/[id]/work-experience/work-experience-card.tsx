import { forwardRef } from "react";

import {
  DatePicker,
  type DatePickerValue,
} from "@/components/ui/date-picker/date-picker";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { normalizeText } from "@/lib/text-normalization";

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
  errors?: {
    jobTitle?: string;
    companyName?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  };
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
            onChange={(e) =>
              onChange({ jobTitle: normalizeText(e.target.value) })
            }
            error={errors?.jobTitle}
            required
          />
        </div>

        <div className={styles.experienceRowTwoCols}>
          <Input
            label="Company name"
            placeholder="Tech Company Inc."
            fullWidth
            value={experience.companyName}
            onChange={(e) =>
              onChange({ companyName: normalizeText(e.target.value) })
            }
            error={errors?.companyName}
            required
          />
          <Input
            label="City"
            placeholder="San Francisco"
            fullWidth
            value={experience.city}
            onChange={(e) => onChange({ city: normalizeText(e.target.value) })}
            error={errors?.city}
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
              error={errors?.startDate}
              required
            />
            <DatePicker
              label="End date"
              placeholder="MM/YYYY"
              fullWidth
              value={experience.endDate}
              onChange={(v) => onChange({ endDate: v })}
              error={errors?.endDate}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Add 3–5 bullet points about your role and achievements"
            fullWidth
            value={experience.description}
            onChange={(e) =>
              onChange({ description: normalizeText(e.target.value) })
            }
            error={errors?.description}
          />
        </div>
      </div>
    );
  },
);

WorkExperienceCard.displayName = "WorkExperienceCard";
