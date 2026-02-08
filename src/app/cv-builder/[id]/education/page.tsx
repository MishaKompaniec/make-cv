"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useSectionList } from "@/hooks/useSectionList";

import { useCv } from "../provider";
import { EducationCard, type EducationItem } from "./education-card";
import styles from "./page.module.scss";

const stepTitle = "Education";

type EducationErrors = {
  diploma?: string;
  endDate?: string;
};

const toMonthIndex = (d: EducationItem["startDate"]) => {
  if (!d) return null;
  return d.year * 12 + d.month;
};

const validateEducation = (edu: EducationItem): EducationErrors => {
  const errors: EducationErrors = {};

  const diploma = edu.diploma.trim();
  if (!diploma) {
    errors.diploma = "Name of the diploma / study area is required";
  } else if (diploma.length < 2) {
    errors.diploma = "Name of the diploma / study area is too short";
  } else if (diploma.length > 120) {
    errors.diploma = "Name of the diploma / study area is too long";
  }

  const startIdx = toMonthIndex(edu.startDate);
  const endIdx = toMonthIndex(edu.endDate);
  if (startIdx !== null && endIdx !== null) {
    if (endIdx <= startIdx) {
      errors.endDate = "End date must be after start date";
    }
  }

  return errors;
};

export default function EducationPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const [isSaving, setIsSaving] = useState(false);
  const didInitRef = useRef(false);

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
  }, [cv, educationList]);

  const handleNextClick = async () => {
    if (!educationList.validateAll()) return;

    setIsSaving(true);
    try {
      const nextData = {
        ...(((cv?.data ?? {}) as Record<string, unknown>) ?? {}),
        education: educationList.items,
      };

      await patchCv({ data: nextData });
      router.push(`/cv-builder/${cvId}/skills`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 5"
        title={stepTitle}
        description="Add your educational background to showcase your qualifications and knowledge."
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
        nextLabel={isSaving ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
