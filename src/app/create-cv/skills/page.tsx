"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SkillsCard, type SkillItem } from "./skills-card";
import { SkillTag } from "./components/skill-tag";
import styles from "./page.module.scss";

const stepTitle = "Skills";

type SkillErrors = {
  title?: string;
};

const validateSkill = (skill: SkillItem): SkillErrors => {
  const errors: SkillErrors = {};

  const title = skill.title.trim();
  if (!title) {
    errors.title = "Skill title is required";
  } else if (title.length > 25) {
    errors.title = "Skill title is too long";
  }

  return errors;
};

const PREDEFINED_SKILLS = [
  "JavaScript",
  "Git",
  "REST API",
  "TypeScript",
  "Test Strategy",
  "Automation Testing",
  "Bug Tracking",
  "Test Documentation",
  "User Acceptance",
  "Performance Optimization",
  "State Management",
  "Quality Assurance",
];

export default function SkillsPage() {
  const router = useRouter();
  const [storedSkills, setStoredSkills] = useLocalStorage<SkillItem[]>(
    "cv-skills",
    [],
  );

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [skillErrors, setSkillErrors] = useState<Record<string, SkillErrors>>(
    {},
  );
  const didInitRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateRef = useRef(false);

  // Initialize once from localStorage.
  useEffect(() => {
    if (didInitRef.current) return;
    setSkills(storedSkills);
    didInitRef.current = true;
  }, [storedSkills]);

  // Auto-save on changes (preserve order).
  useEffect(() => {
    if (!didInitRef.current) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setStoredSkills(skills);
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [skills, setStoredSkills]);

  const handleAddSkill = () => {
    setSkills((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: "",
      },
    ]);
  };

  const updateSkill = (id: string, patch: Partial<Omit<SkillItem, "id">>) => {
    setSkills((prev) => {
      const current = prev.find((s) => s.id === id);
      if (!current) return prev;

      const updated = { ...current, ...patch } as SkillItem;
      const nextSkills = prev.map((s) => (s.id === id ? updated : s));

      setSkillErrors((prevErrs) => {
        if (!prevErrs[id]) return prevErrs;
        const nextErrs = { ...prevErrs };
        const errs = validateSkill(updated);
        if (Object.keys(errs).length === 0) {
          delete nextErrs[id];
        } else {
          nextErrs[id] = errs;
        }
        return nextErrs;
      });

      return nextSkills;
    });
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setSkillErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveSkill = (fromIndex: number, toIndex: number) => {
    setSkills((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;

      const positions: Record<string, DOMRect> = {};
      for (const skill of prev) {
        const el = cardRefs.current[skill.id];
        if (el) positions[skill.id] = el.getBoundingClientRect();
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

    for (const skill of skills) {
      const el = cardRefs.current[skill.id];
      const prevRect = prevPositions[skill.id];
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
  }, [skills]);

  const handleNextClick = () => {
    const nextErrors: Record<string, SkillErrors> = {};
    for (const skill of skills) {
      const errs = validateSkill(skill);
      if (Object.keys(errs).length > 0) {
        nextErrors[skill.id] = errs;
      }
    }

    setSkillErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    router.push("/create-cv/other-sections");
  };

  const handleTagClick = (tag: string) => {
    const existingSkill = skills.find((skill) => skill.title.trim() === tag);

    if (existingSkill) {
      // Remove skill if it exists
      removeSkill(existingSkill.id);
    } else {
      // Add new skill to the end of the list
      const newSkill: SkillItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: tag,
      };
      setSkills((prev) => [...prev, newSkill]);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 6"
        title={stepTitle}
        description="Highlight your key skills and competencies that make you stand out to employers."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          {/* Predefined skills tags */}
          <div className={styles.tagsSection}>
            <div className={styles.tagsContainer}>
              {PREDEFINED_SKILLS.map((tag) => {
                const isActive = skills.some(
                  (skill) => skill.title.trim() === tag,
                );
                return (
                  <SkillTag
                    key={tag}
                    label={tag}
                    isActive={isActive}
                    onClick={() => handleTagClick(tag)}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.form}>
            {skills.map((skill, index) => (
              <SkillsCard
                key={skill.id}
                ref={(el) => {
                  cardRefs.current[skill.id] = el;
                }}
                skill={skill}
                errors={skillErrors[skill.id]}
                canMoveUp={skills.length > 1 && index > 0}
                canMoveDown={skills.length > 1 && index < skills.length - 1}
                onMoveUp={() => moveSkill(index, index - 1)}
                onMoveDown={() => moveSkill(index, index + 1)}
                onRemove={() => removeSkill(skill.id)}
                onChange={(patch) => updateSkill(skill.id, patch)}
              />
            ))}

            <button
              type="button"
              className={styles.addSkillTile}
              onClick={handleAddSkill}
            >
              <div className={styles.addSkillTileIcon}>+</div>
              <p className={styles.addSkillTileText}>Add skill</p>
            </button>
          </div>
        </div>
      </section>

      <NavigationFooter
        backHref="/create-cv/education"
        nextHref="/create-cv/other-sections"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
