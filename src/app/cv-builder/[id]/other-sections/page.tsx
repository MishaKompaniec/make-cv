"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { useSectionList } from "@/hooks/useSectionList";

import { useCv } from "../provider";
import {
  CustomSectionCard,
  type CustomSectionItem,
} from "./custom-section-card";
import { type InterestItem,InterestsCard } from "./interests-card";
import { type LanguageItem,LanguagesCard } from "./languages-card";
import styles from "./page.module.scss";

const stepTitle = "Other sections";

type SelectedSections = {
  languages: boolean;
  interests: boolean;
  customSection: boolean;
};

const DEFAULT_SELECTED_SECTIONS: SelectedSections = {
  languages: false,
  interests: false,
  customSection: false,
};

const MAX_TEXT_LENGTH = 25;

export default function OtherSectionsPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const [isSaving, setIsSaving] = useState(false);
  const didInitRef = useRef(false);

  const [selectedSections, setSelectedSections] = useState<SelectedSections>(
    DEFAULT_SELECTED_SECTIONS,
  );

  const languagesList = useSectionList<LanguageItem, { name?: string }>({
    storageKey: "cv-languages",
    validateItem: (item) => {
      const errors: { name?: string } = {};
      const name = item.name.trim();
      if (!name) errors.name = "Language name is required";
      else if (name.length > MAX_TEXT_LENGTH)
        errors.name = "Language name is too long";
      return errors;
    },
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: "",
      level: "A1",
    }),
  });

  const customSectionsList = useSectionList<
    CustomSectionItem,
    { title?: string }
  >({
    storageKey: "cv-custom-sections",
    validateItem: (item) => {
      const errors: { title?: string } = {};
      const title = item.title.trim();
      if (!title) errors.title = "Section title is required";
      return errors;
    },
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "",
      description: "",
    }),
  });

  const interestsList = useSectionList<InterestItem, { title?: string }>({
    storageKey: "cv-interests",
    validateItem: (item) => {
      const errors: { title?: string } = {};
      const title = item.title.trim();
      if (!title) errors.title = "Interest is required";
      else if (title.length > MAX_TEXT_LENGTH)
        errors.title = "Interest is too long";
      return errors;
    },
    createItem: () => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "",
    }),
  });

  useEffect(() => {
    if (!cv) return;
    if (didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;

    const selectedFromApi = data["selectedSections"] as
      | Partial<SelectedSections>
      | undefined;
    setSelectedSections({
      ...DEFAULT_SELECTED_SECTIONS,
      ...(selectedFromApi ?? {}),
    });

    const languagesFromApi = data["languages"];
    if (Array.isArray(languagesFromApi)) {
      languagesList.setItems(languagesFromApi as LanguageItem[]);
    }

    const interestsFromApi = data["interests"];
    if (Array.isArray(interestsFromApi)) {
      interestsList.setItems(interestsFromApi as InterestItem[]);
    }

    const customSectionsFromApi = data["customSections"];
    if (Array.isArray(customSectionsFromApi)) {
      customSectionsList.setItems(customSectionsFromApi as CustomSectionItem[]);
    }

    didInitRef.current = true;
  }, [cv, customSectionsList, interestsList, languagesList]);

  const toggleSection = (key: keyof SelectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextClick = async () => {
    if (selectedSections.languages && !languagesList.validateAll()) return;
    if (selectedSections.interests && !interestsList.validateAll()) return;
    if (selectedSections.customSection && !customSectionsList.validateAll())
      return;

    setIsSaving(true);
    try {
      const nextData = {
        ...(((cv?.data ?? {}) as Record<string, unknown>) ?? {}),
        selectedSections,
        languages: languagesList.items,
        interests: interestsList.items,
        customSections: customSectionsList.items,
      };

      await patchCv({ data: nextData });
      router.push(`/cv-builder/${cvId}/finalize`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 7"
        title={stepTitle}
        description="Add additional sections to make your CV more comprehensive and personalized."
      />

      <section className={styles.wrapper}>
        <div className={styles.sectionsGrid}>
          <button
            type="button"
            className={`${styles.sectionToggle} ${selectedSections.languages ? styles.sectionToggleActive : ""}`}
            onClick={() => toggleSection("languages")}
          >
            <Checkbox
              checked={selectedSections.languages}
              onChange={() => toggleSection("languages")}
            />
            <span className={styles.sectionToggleText}>Languages</span>
          </button>

          <button
            type="button"
            className={`${styles.sectionToggle} ${selectedSections.interests ? styles.sectionToggleActive : ""}`}
            onClick={() => toggleSection("interests")}
          >
            <Checkbox
              checked={selectedSections.interests}
              onChange={() => toggleSection("interests")}
            />
            <span className={styles.sectionToggleText}>Interests</span>
          </button>

          <button
            type="button"
            className={`${styles.sectionToggle} ${selectedSections.customSection ? styles.sectionToggleActive : ""}`}
            onClick={() => toggleSection("customSection")}
          >
            <Checkbox
              checked={selectedSections.customSection}
              onChange={() => toggleSection("customSection")}
            />
            <span className={styles.sectionToggleText}>Custom section</span>
          </button>
        </div>

        {selectedSections.languages ? (
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>Languages</div>

            <div className={styles.itemsList}>
              {languagesList.items.map((language, index) => (
                <LanguagesCard
                  key={language.id}
                  ref={languagesList.setCardRef(language.id)}
                  language={language}
                  errors={languagesList.errors[language.id]}
                  canMoveUp={languagesList.items.length > 1 && index > 0}
                  canMoveDown={
                    languagesList.items.length > 1 &&
                    index < languagesList.items.length - 1
                  }
                  onMoveUp={() => languagesList.moveItem(index, index - 1)}
                  onMoveDown={() => languagesList.moveItem(index, index + 1)}
                  onRemove={() => languagesList.removeItem(language.id)}
                  onChange={(patch) =>
                    languagesList.updateItem(language.id, patch)
                  }
                />
              ))}
              <button
                type="button"
                className={styles.addItemTile}
                onClick={languagesList.addItem}
              >
                <div className={styles.addItemTileIcon}>+</div>
                <p className={styles.addItemTileText}>Add language</p>
              </button>
            </div>
          </div>
        ) : null}

        {selectedSections.interests ? (
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>Interests</div>

            <div className={styles.itemsList}>
              {interestsList.items.map((interest, index) => (
                <InterestsCard
                  key={interest.id}
                  ref={interestsList.setCardRef(interest.id)}
                  interest={interest}
                  errors={interestsList.errors[interest.id]}
                  canMoveUp={interestsList.items.length > 1 && index > 0}
                  canMoveDown={
                    interestsList.items.length > 1 &&
                    index < interestsList.items.length - 1
                  }
                  onMoveUp={() => interestsList.moveItem(index, index - 1)}
                  onMoveDown={() => interestsList.moveItem(index, index + 1)}
                  onRemove={() => interestsList.removeItem(interest.id)}
                  onChange={(patch) =>
                    interestsList.updateItem(interest.id, patch)
                  }
                />
              ))}

              <button
                type="button"
                className={styles.addItemTile}
                onClick={interestsList.addItem}
              >
                <div className={styles.addItemTileIcon}>+</div>
                <p className={styles.addItemTileText}>Add interest</p>
              </button>
            </div>
          </div>
        ) : null}

        {selectedSections.customSection ? (
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>Custom section</div>

            <div className={styles.itemsList}>
              {customSectionsList.items.map((section, index) => (
                <CustomSectionCard
                  key={section.id}
                  ref={customSectionsList.setCardRef(section.id)}
                  section={section}
                  errors={customSectionsList.errors[section.id]}
                  canMoveUp={customSectionsList.items.length > 1 && index > 0}
                  canMoveDown={
                    customSectionsList.items.length > 1 &&
                    index < customSectionsList.items.length - 1
                  }
                  onMoveUp={() => customSectionsList.moveItem(index, index - 1)}
                  onMoveDown={() =>
                    customSectionsList.moveItem(index, index + 1)
                  }
                  onRemove={() => customSectionsList.removeItem(section.id)}
                  onChange={(patch) =>
                    customSectionsList.updateItem(section.id, patch)
                  }
                />
              ))}

              <button
                type="button"
                className={styles.addItemTile}
                onClick={customSectionsList.addItem}
              >
                <div className={styles.addItemTileIcon}>+</div>
                <p className={styles.addItemTileText}>Add custom section</p>
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/skills`}
        nextHref={`/cv-builder/${cvId}/finalize`}
        nextLabel={isSaving ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
