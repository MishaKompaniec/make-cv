"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSectionList } from "@/hooks/useSectionList";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { LanguagesCard, type LanguageItem } from "./languages-card";
import { InterestsCard, type InterestItem } from "./interests-card";
import styles from "./page.module.scss";

const stepTitle = "Other sections";

type SelectedSections = {
  languages: boolean;
  interests: boolean;
  references: boolean;
  customSection: boolean;
};

const DEFAULT_SELECTED_SECTIONS: SelectedSections = {
  languages: false,
  interests: false,
  references: false,
  customSection: false,
};

const MAX_TEXT_LENGTH = 25;

export default function OtherSectionsPage() {
  const router = useRouter();
  const [storedSelectedSections, setStoredSelectedSections] =
    useLocalStorage<SelectedSections>(
      "cv-selected-sections",
      DEFAULT_SELECTED_SECTIONS,
    );

  const [selectedSections, setSelectedSections] = useState<SelectedSections>(
    DEFAULT_SELECTED_SECTIONS,
  );

  const sectionsDidInitRef = useRef(false);
  const sectionsDebounceTimerRef = useRef<number | null>(null);

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

  // Initialize selectedSections once from localStorage.
  useEffect(() => {
    if (sectionsDidInitRef.current) return;
    setSelectedSections(storedSelectedSections);
    sectionsDidInitRef.current = true;
  }, [storedSelectedSections]);

  // Persist selectedSections to localStorage (debounced).
  useEffect(() => {
    if (!sectionsDidInitRef.current) return;

    if (sectionsDebounceTimerRef.current) {
      window.clearTimeout(sectionsDebounceTimerRef.current);
    }

    sectionsDebounceTimerRef.current = window.setTimeout(() => {
      setStoredSelectedSections(selectedSections);
    }, 250);

    return () => {
      if (sectionsDebounceTimerRef.current) {
        window.clearTimeout(sectionsDebounceTimerRef.current);
      }
    };
  }, [selectedSections, setStoredSelectedSections]);

  const toggleSection = (key: keyof SelectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextClick = () => {
    if (selectedSections.languages && !languagesList.validateAll()) return;
    if (selectedSections.interests && !interestsList.validateAll()) return;

    router.push("/create-cv/finalize");
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
            className={`${styles.sectionToggle} ${selectedSections.references ? styles.sectionToggleActive : ""}`}
            onClick={() => toggleSection("references")}
          >
            <Checkbox
              checked={selectedSections.references}
              onChange={() => toggleSection("references")}
            />
            <span className={styles.sectionToggleText}>References</span>
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
      </section>

      <NavigationFooter
        backHref="/create-cv/skills"
        nextHref="/create-cv/finalize"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
