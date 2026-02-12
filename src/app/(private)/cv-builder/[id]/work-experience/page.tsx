"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";
import { useSectionList } from "@/hooks/useSectionList";
import { workExperienceItemSchema } from "@/lib/validations/cv-schema";

import { useCv } from "../provider";
import styles from "./page.module.scss";
import {
  type ExperienceItem,
  WorkExperienceCard,
} from "./work-experience-card";

const stepTitle = "Work experience";

type ExperienceErrors = {
  jobTitle?: string;
  companyName?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

const validateExperience = (exp: ExperienceItem): ExperienceErrors => {
  const parsed = workExperienceItemSchema.safeParse(exp);
  if (parsed.success) return {};

  const out: ExperienceErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    if (key in out) continue;
    (out as Record<string, string>)[key] = issue.message;
  }
  return out;
};

export default function WorkExperiencePage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const didInitRef = useRef(false);
  const skipAutosaveRef = useRef(true);
  const lastScheduledSnapshotRef = useRef<string>("");

  const experiencesList = useSectionList<ExperienceItem, ExperienceErrors>({
    storageKey: "cv-work-experience",
    validateItem: validateExperience,
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      jobTitle: "",
      companyName: "",
      city: "",
      startDate: undefined,
      endDate: undefined,
      description: "",
    }),
    debounceMs: 600,
  });

  useEffect(() => {
    if (!cv) return;
    if (didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;
    const workExpFromApi = data["workExperience"];
    const initialItems = Array.isArray(workExpFromApi)
      ? (workExpFromApi as ExperienceItem[])
      : [];

    experiencesList.setItems(initialItems);
    didInitRef.current = true;
    skipAutosaveRef.current = true;
  }, [cv, experiencesList]);

  const patcher = useKeyedDebouncedCallback<"workExperience", ExperienceItem[]>(
    async (_key, value) => {
      if (!cvId) return;
      await patchCv({
        data: {
          workExperience: value,
        },
      });
    },
  );

  const schedule = patcher.schedule;
  const flush = patcher.flush;

  const isSaving = patcher.getIsInFlight();

  const schedulePatch = useCallback(() => {
    if (!didInitRef.current) return;
    if (!cvId) return;

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    const snapshot = JSON.stringify(experiencesList.items);
    if (snapshot === lastScheduledSnapshotRef.current) return;
    lastScheduledSnapshotRef.current = snapshot;

    schedule("workExperience", experiencesList.items);
  }, [cvId, experiencesList.items, schedule]);

  useEffect(() => {
    schedulePatch();
  }, [schedulePatch]);

  const handleNextClick = async () => {
    if (!experiencesList.validateAll()) return;
    try {
      await flush();
      router.push(`/cv-builder/${cvId}/education`);
    } finally {
      // patcher manages isSaving via in-flight tracking
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 4"
        title={stepTitle}
        description="Add your work experience to demonstrate your career progression, highlight key achievements, and show the impact you've made in each role. Include company names, job titles, dates, and measurable results wherever possible."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.form}>
            {experiencesList.items.map((exp, index) => (
              <WorkExperienceCard
                key={exp.id}
                ref={experiencesList.setCardRef(exp.id)}
                experience={exp}
                errors={experiencesList.errors[exp.id]}
                canMoveUp={experiencesList.items.length > 1 && index > 0}
                canMoveDown={
                  experiencesList.items.length > 1 &&
                  index < experiencesList.items.length - 1
                }
                onMoveUp={() => experiencesList.moveItem(index, index - 1)}
                onMoveDown={() => experiencesList.moveItem(index, index + 1)}
                onRemove={() => experiencesList.removeItem(exp.id)}
                onChange={(patch) => experiencesList.updateItem(exp.id, patch)}
              />
            ))}

            <button
              type="button"
              className={styles.addExperienceTile}
              onClick={experiencesList.addItem}
            >
              <div className={styles.addExperienceTileIcon}>+</div>
              <p className={styles.addExperienceTileText}>
                Add work experience
              </p>
            </button>
          </div>
        </div>
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/summary`}
        nextHref={`/cv-builder/${cvId}/education`}
        nextLabel={isSaving ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
