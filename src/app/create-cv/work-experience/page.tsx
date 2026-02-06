"use client";

import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { useSectionList } from "@/hooks/useSectionList";
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

  const handleNextClick = () => {
    if (!experiencesList.validateAll()) return;

    router.push("/create-cv/education");
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 4"
        title={stepTitle}
        description="Add your work experience to show employers your career progression and achievements."
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
        backHref="/create-cv/summary"
        nextHref="/create-cv/education"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
