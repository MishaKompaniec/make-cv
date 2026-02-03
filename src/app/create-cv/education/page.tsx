"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useLocalStorage } from "@/hooks/useLocalStorage";
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
  const [storedEducation, setStoredEducation] = useLocalStorage<
    EducationItem[]
  >("cv-education", []);

  const [education, setEducation] = useState<EducationItem[]>([]);
  const [educationErrors, setEducationErrors] = useState<
    Record<string, EducationErrors>
  >({});
  const didInitRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateRef = useRef(false);

  // Initialize once from localStorage.
  useEffect(() => {
    if (didInitRef.current) return;
    setEducation(storedEducation);
    didInitRef.current = true;
  }, [storedEducation]);

  // Auto-save on changes (preserve order).
  useEffect(() => {
    if (!didInitRef.current) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setStoredEducation(education);
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [education, setStoredEducation]);

  const handleAddEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        diploma: "",
        schoolName: "",
        schoolLocation: "",
        startDate: undefined,
        endDate: undefined,
        description: "",
      },
    ]);
  };

  const updateEducation = (
    id: string,
    patch: Partial<Omit<EducationItem, "id">>,
  ) => {
    setEducation((prev) => {
      const current = prev.find((e) => e.id === id);
      if (!current) return prev;

      const updated = { ...current, ...patch } as EducationItem;
      const nextEducation = prev.map((item) =>
        item.id === id ? updated : item,
      );

      setEducationErrors((prevErrs) => {
        if (!prevErrs[id]) return prevErrs;
        const nextErrs = { ...prevErrs };
        const errs = validateEducation(updated);
        if (Object.keys(errs).length === 0) {
          delete nextErrs[id];
        } else {
          nextErrs[id] = errs;
        }
        return nextErrs;
      });

      return nextEducation;
    });
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((item) => item.id !== id));
    setEducationErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveEducation = (fromIndex: number, toIndex: number) => {
    setEducation((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const positions: Record<string, DOMRect> = {};
      for (const item of prev) {
        const el = cardRefs.current[item.id];
        if (el) positions[item.id] = el.getBoundingClientRect();
      }
      prevPositionsRef.current = positions;
      shouldAnimateRef.current = true;

      const next = [...prev];
      const tmp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = tmp;
      return next;
    });
  };

  useLayoutEffect(() => {
    if (!shouldAnimateRef.current) return;
    shouldAnimateRef.current = false;

    const prevPositions = prevPositionsRef.current;
    const animations: Array<() => void> = [];

    for (const item of education) {
      const el = cardRefs.current[item.id];
      const prevRect = prevPositions[item.id];
      if (!el || !prevRect) continue;

      const nextRect = el.getBoundingClientRect();
      const dx = prevRect.left - nextRect.left;
      const dy = prevRect.top - nextRect.top;
      if (dx === 0 && dy === 0) continue;

      animations.push(() => {
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.transition = "transform 0s";
        requestAnimationFrame(() => {
          el.style.transition = "transform 200ms ease";
          el.style.transform = "translate(0px, 0px)";
        });

        const cleanup = () => {
          el.removeEventListener("transitionend", cleanup);
          el.style.transition = "";
          el.style.transform = "";
        };
        el.addEventListener("transitionend", cleanup);
      });
    }

    for (const run of animations) run();
  }, [education]);

  const handleNextClick = () => {
    const nextErrors: Record<string, EducationErrors> = {};
    for (const item of education) {
      const errs = validateEducation(item);
      if (Object.keys(errs).length > 0) {
        nextErrors[item.id] = errs;
      }
    }

    setEducationErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    router.push("/create-cv/skills");
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
            {education.map((item, index) => (
              <EducationCard
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                education={item}
                errors={educationErrors[item.id]}
                canMoveUp={education.length > 1 && index > 0}
                canMoveDown={
                  education.length > 1 && index < education.length - 1
                }
                onMoveUp={() => moveEducation(index, index - 1)}
                onMoveDown={() => moveEducation(index, index + 1)}
                onRemove={() => removeEducation(item.id)}
                onChange={(patch) => updateEducation(item.id, patch)}
              />
            ))}

            <button
              type="button"
              className={styles.addExperienceTile}
              onClick={handleAddEducation}
            >
              <div className={styles.addExperienceTileIcon}>+</div>
              <p className={styles.addExperienceTileText}>Add education</p>
            </button>
          </div>
        </div>
      </section>

      <NavigationFooter
        backHref="/create-cv/work-experience"
        nextHref="/create-cv/skills"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
