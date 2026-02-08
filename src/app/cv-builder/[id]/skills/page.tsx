"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { useSectionList } from "@/hooks/useSectionList";
import { useCv } from "../provider";
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
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const [isSaving, setIsSaving] = useState(false);
  const didInitRef = useRef(false);

  const skillsList = useSectionList<SkillItem, SkillErrors>({
    storageKey: "cv-skills",
    validateItem: validateSkill,
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "",
    }),
    debounceMs: 600,
  });

  useEffect(() => {
    if (!cv) return;
    if (didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;
    const skillsFromApi = data["skills"];
    const initialItems = Array.isArray(skillsFromApi)
      ? (skillsFromApi as SkillItem[])
      : [];

    skillsList.setItems(initialItems);
    didInitRef.current = true;
  }, [cv, skillsList]);

  const handleNextClick = async () => {
    if (!skillsList.validateAll()) return;

    setIsSaving(true);
    try {
      const nextData = {
        ...(((cv?.data ?? {}) as Record<string, unknown>) ?? {}),
        skills: skillsList.items,
      };

      await patchCv({ data: nextData });
      router.push(`/cv-builder/${cvId}/other-sections`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagClick = (tag: string) => {
    const existingSkill = skillsList.items.find(
      (skill) => skill.title.trim() === tag,
    );

    if (existingSkill) {
      // Remove skill if it exists
      skillsList.removeItem(existingSkill.id);
    } else {
      // Add new skill to the end of the list
      const newSkill: SkillItem = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: tag,
      };
      skillsList.setItems((prev) => [...prev, newSkill]);
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
                const isActive = skillsList.items.some(
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
            {skillsList.items.map((skill, index) => (
              <SkillsCard
                key={skill.id}
                ref={skillsList.setCardRef(skill.id)}
                skill={skill}
                errors={skillsList.errors[skill.id]}
                canMoveUp={skillsList.items.length > 1 && index > 0}
                canMoveDown={
                  skillsList.items.length > 1 &&
                  index < skillsList.items.length - 1
                }
                onMoveUp={() => skillsList.moveItem(index, index - 1)}
                onMoveDown={() => skillsList.moveItem(index, index + 1)}
                onRemove={() => skillsList.removeItem(skill.id)}
                onChange={(patch) => skillsList.updateItem(skill.id, patch)}
              />
            ))}

            <button
              type="button"
              className={styles.addSkillTile}
              onClick={skillsList.addItem}
            >
              <div className={styles.addSkillTileIcon}>+</div>
              <p className={styles.addSkillTileText}>Add skill</p>
            </button>
          </div>
        </div>
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/education`}
        nextHref={`/cv-builder/${cvId}/other-sections`}
        nextLabel={isSaving ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
