"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/button";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { CvPreview } from "@/components/cv-preview/cv-preview";
import {
  WorkExperienceCard,
  type ExperienceItem,
} from "./work-experience-card";
import styles from "./page.module.scss";

const stepTitle = "Work experience";

type ExperienceErrors = {
  jobTitle?: string;
  companyName?: string;
  startDate?: string;
  endDate?: string;
};

const toMonthIndex = (d: ExperienceItem["startDate"]) => {
  if (!d) return null;
  return d.year * 12 + d.month;
};

const validateExperience = (exp: ExperienceItem): ExperienceErrors => {
  const errors: ExperienceErrors = {};

  const jobTitle = exp.jobTitle.trim();
  if (!jobTitle) {
    errors.jobTitle = "Job title is required";
  } else if (jobTitle.length < 2) {
    errors.jobTitle = "Job title is too short";
  } else if (jobTitle.length > 60) {
    errors.jobTitle = "Job title is too long";
  }

  const companyName = exp.companyName.trim();
  if (!companyName) {
    errors.companyName = "Company name is required";
  } else if (companyName.length < 2) {
    errors.companyName = "Company name is too short";
  } else if (companyName.length > 80) {
    errors.companyName = "Company name is too long";
  }

  if (!exp.startDate) {
    errors.startDate = "Start date is required";
  }

  const startIdx = toMonthIndex(exp.startDate);
  const endIdx = toMonthIndex(exp.endDate);
  if (startIdx !== null && endIdx !== null) {
    if (endIdx <= startIdx) {
      errors.endDate = "End date must be after start date";
    }
  }

  return errors;
};

export default function WorkExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [experienceErrors, setExperienceErrors] = useState<
    Record<string, ExperienceErrors>
  >({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateRef = useRef(false);

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        jobTitle: "",
        companyName: "",
        city: "",
        startDate: undefined,
        endDate: undefined,
        description: "",
      },
    ]);
  };

  const updateExperience = (
    id: string,
    patch: Partial<Omit<ExperienceItem, "id">>,
  ) => {
    setExperiences((prev) => {
      const current = prev.find((e) => e.id === id);
      if (!current) return prev;

      const updated = { ...current, ...patch } as ExperienceItem;
      const nextExperiences = prev.map((exp) =>
        exp.id === id ? updated : exp,
      );

      setExperienceErrors((prevErrs) => {
        if (!prevErrs[id]) return prevErrs;
        const nextErrs = { ...prevErrs };
        const errs = validateExperience(updated);
        if (Object.keys(errs).length === 0) {
          delete nextErrs[id];
        } else {
          nextErrs[id] = errs;
        }
        return nextErrs;
      });

      return nextExperiences;
    });
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    setExperienceErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveExperience = (fromIndex: number, toIndex: number) => {
    setExperiences((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const positions: Record<string, DOMRect> = {};
      for (const exp of prev) {
        const el = cardRefs.current[exp.id];
        if (el) positions[exp.id] = el.getBoundingClientRect();
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

    for (const exp of experiences) {
      const el = cardRefs.current[exp.id];
      const prevRect = prevPositions[exp.id];
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
  }, [experiences]);

  const handleNextClick = () => {
    const nextErrors: Record<string, ExperienceErrors> = {};
    for (const exp of experiences) {
      const errs = validateExperience(exp);
      if (Object.keys(errs).length > 0) {
        nextErrors[exp.id] = errs;
      }
    }

    setExperienceErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    router.push("/create-cv/education");
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 3"
        title={stepTitle}
        description="Add your work experience to show employers your career progression and achievements."
      />

      <div className={styles.addExperienceRow}>
        <Button type="button" onClick={handleAddExperience}>
          Add work experience
        </Button>
      </div>

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.form}>
            {experiences.map((exp, index) => (
              <WorkExperienceCard
                key={exp.id}
                ref={(el) => {
                  cardRefs.current[exp.id] = el;
                }}
                experience={exp}
                errors={experienceErrors[exp.id]}
                canMoveUp={experiences.length > 1 && index > 0}
                canMoveDown={
                  experiences.length > 1 && index < experiences.length - 1
                }
                onMoveUp={() => moveExperience(index, index - 1)}
                onMoveDown={() => moveExperience(index, index + 1)}
                onRemove={() => removeExperience(exp.id)}
                onChange={(patch) => updateExperience(exp.id, patch)}
              />
            ))}
          </div>
        </div>

        <div className={styles.preview}>
          <CvPreview />
        </div>
      </section>

      <NavigationFooter
        backHref="/create-cv/contact-details"
        nextHref="/create-cv/education"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
