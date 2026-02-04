"use client";

import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useSectionList } from "@/hooks/useSectionList";
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

  const skillsList = useSectionList<SkillItem, SkillErrors>({
    storageKey: "cv-skills",
    validateItem: validateSkill,
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "",
    }),
    debounceMs: 600,
  });

  const handleNextClick = () => {
    if (!skillsList.validateAll()) return;

    router.push("/create-cv/other-sections");
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
        backHref="/create-cv/education"
        nextHref="/create-cv/other-sections"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
