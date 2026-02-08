"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { useSectionList } from "@/hooks/useSectionList";
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
  const params = useParams();
  const cvId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvData, setCvData] = useState<Record<string, unknown>>({});
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
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/cv/${cvId}`, { cache: "no-store" });
        if (!res.ok) return;

        const json = (await res.json()) as {
          cv?: { data?: Record<string, unknown> | null };
        };

        const cv = json.cv;
        if (!cv || cancelled) return;

        const nextData = (cv.data ?? {}) as Record<string, unknown>;
        setCvData(nextData);

        const educationFromApi = nextData["education"];
        const initialItems = Array.isArray(educationFromApi)
          ? (educationFromApi as EducationItem[])
          : [];

        if (didInitRef.current) return;
        educationList.setItems(initialItems);
        didInitRef.current = true;
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (cvId) {
      void load();
    } else {
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [cvId]);

  const handleNextClick = async () => {
    if (!educationList.validateAll()) return;

    setIsSaving(true);
    try {
      const nextData = {
        ...(cvData ?? {}),
        education: educationList.items,
      };

      const res = await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: nextData }),
      });

      if (!res.ok) return;

      setCvData(nextData);
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
        nextDisabled={isLoading || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
