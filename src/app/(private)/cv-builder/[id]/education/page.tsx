"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";
import { useSectionList } from "@/hooks/useSectionList";
import { educationItemSchema } from "@/lib/validations/cv-schema";

import { useCv } from "../provider";
import { EducationCard, type EducationItem } from "./education-card";
import styles from "./page.module.scss";

const stepTitle = "Education";

type EducationErrors = {
  diploma?: string;
  schoolName?: string;
  schoolLocation?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

const validateEducation = (edu: EducationItem): EducationErrors => {
  const parsed = educationItemSchema.safeParse(edu);
  if (parsed.success) return {};

  const out: EducationErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    if (key in out) continue;
    (out as Record<string, string>)[key] = issue.message;
  }
  return out;
};

export default function EducationPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const didInitRef = useRef(false);
  const skipAutosaveRef = useRef(true);
  const lastScheduledSnapshotRef = useRef<string>("");

  const educationList = useSectionList<EducationItem, EducationErrors>({
    storageKey: "cv-education",
    validateItem: validateEducation,
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      diploma: "",
      schoolName: "",
      schoolLocation: "",
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
    const educationFromApi = data["education"];
    const initialItems = Array.isArray(educationFromApi)
      ? (educationFromApi as EducationItem[])
      : [];

    educationList.setItems(initialItems);
    didInitRef.current = true;
    skipAutosaveRef.current = true;
  }, [cv, educationList]);

  const patcher = useKeyedDebouncedCallback<"education", EducationItem[]>(
    async (_key, value) => {
      if (!cvId) return;
      await patchCv({
        data: {
          education: value,
        },
      });
    },
  );

  const isSaving = patcher.getIsInFlight();

  const schedulePatch = useCallback(() => {
    if (!didInitRef.current) return;
    if (!cvId) return;

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    const snapshot = JSON.stringify(educationList.items);
    if (snapshot === lastScheduledSnapshotRef.current) return;
    lastScheduledSnapshotRef.current = snapshot;

    patcher.schedule("education", educationList.items);
  }, [cvId, educationList.items, patcher]);

  useEffect(() => {
    schedulePatch();
  }, [schedulePatch]);

  const handleNextClick = async () => {
    if (!educationList.validateAll()) return;
    try {
      await patcher.flush();
      router.push(`/cv-builder/${cvId}/skills`);
    } finally {
      // patcher manages isSaving via in-flight tracking
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 5"
        title={stepTitle}
        description="Add your educational background to highlight your qualifications, degrees, and relevant coursework. Include institution names, study periods, and any notable achievements to show your knowledge and readiness for your target role."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.form}>
            {educationList.items.map((item, index) => (
              <EducationCard
                key={item.id}
                ref={educationList.setCardRef(item.id)}
                education={item}
                errors={educationList.errors[item.id]}
                canMoveUp={educationList.items.length > 1 && index > 0}
                canMoveDown={
                  educationList.items.length > 1 &&
                  index < educationList.items.length - 1
                }
                onMoveUp={() => educationList.moveItem(index, index - 1)}
                onMoveDown={() => educationList.moveItem(index, index + 1)}
                onRemove={() => educationList.removeItem(item.id)}
                onChange={(patch) => educationList.updateItem(item.id, patch)}
              />
            ))}

            <button
              type="button"
              className={styles.addExperienceTile}
              onClick={educationList.addItem}
            >
              <div className={styles.addExperienceTileIcon}>+</div>
              <p className={styles.addExperienceTileText}>Add education</p>
            </button>
          </div>
        </div>
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/work-experience`}
        nextHref={`/cv-builder/${cvId}/skills`}
        nextLabel="Next Step"
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        nextLoading={isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
