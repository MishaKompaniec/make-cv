"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { LanguagesCard, type LanguageItem } from "./languages-card";
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

export default function OtherSectionsPage() {
  const router = useRouter();
  const [storedLanguages, setStoredLanguages] = useLocalStorage<LanguageItem[]>(
    "cv-languages",
    [],
  );
  const [storedSelectedSections, setStoredSelectedSections] =
    useLocalStorage<SelectedSections>(
      "cv-selected-sections",
      DEFAULT_SELECTED_SECTIONS,
    );

  const [selectedSections, setSelectedSections] = useState<SelectedSections>(
    DEFAULT_SELECTED_SECTIONS,
  );

  const didInitRef = useRef(false);
  const sectionsDidInitRef = useRef(false);
  const sectionsDebounceTimerRef = useRef<number | null>(null);

  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [languageErrors, setLanguageErrors] = useState<
    Record<string, { name?: string }>
  >({});
  const debounceTimerRef = useRef<number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateRef = useRef(false);

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

  useEffect(() => {
    if (didInitRef.current) return;
    setLanguages(storedLanguages);
    didInitRef.current = true;
  }, [storedLanguages]);

  useEffect(() => {
    if (!didInitRef.current) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      setStoredLanguages(languages);
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [languages, setStoredLanguages]);

  const validateLanguage = (item: LanguageItem) => {
    const errors: { name?: string } = {};
    const name = item.name.trim();
    if (!name) errors.name = "Language name is required";
    return errors;
  };

  const addLanguage = () => {
    setLanguages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: "",
        level: "A1",
      },
    ]);
  };

  const updateLanguage = (
    id: string,
    patch: Partial<Omit<LanguageItem, "id">>,
  ) => {
    setLanguages((prev) => {
      const current = prev.find((l) => l.id === id);
      if (!current) return prev;

      const updated = { ...current, ...patch } as LanguageItem;
      const nextLanguages = prev.map((l) => (l.id === id ? updated : l));

      setLanguageErrors((prevErrs) => {
        if (!prevErrs[id]) return prevErrs;
        const nextErrs = { ...prevErrs };
        const errs = validateLanguage(updated);
        if (Object.keys(errs).length === 0) {
          delete nextErrs[id];
        } else {
          nextErrs[id] = errs;
        }
        return nextErrs;
      });

      return nextLanguages;
    });
  };

  const removeLanguage = (id: string) => {
    setLanguages((prev) => prev.filter((l) => l.id !== id));
    setLanguageErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const moveLanguage = (fromIndex: number, toIndex: number) => {
    setLanguages((prev) => {
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

    for (const item of languages) {
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
  }, [languages]);

  const toggleSection = (key: keyof SelectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNextClick = () => {
    // Validate Languages if enabled
    if (selectedSections.languages) {
      const nextErrors: Record<string, { name?: string }> = {};
      for (const language of languages) {
        const errs = validateLanguage(language);
        if (Object.keys(errs).length > 0) {
          nextErrors[language.id] = errs;
        }
      }

      setLanguageErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
    }

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
              {languages.map((language, index) => (
                <LanguagesCard
                  key={language.id}
                  ref={(el) => {
                    cardRefs.current[language.id] = el;
                  }}
                  language={language}
                  errors={languageErrors[language.id]}
                  canMoveUp={languages.length > 1 && index > 0}
                  canMoveDown={
                    languages.length > 1 && index < languages.length - 1
                  }
                  onMoveUp={() => moveLanguage(index, index - 1)}
                  onMoveDown={() => moveLanguage(index, index + 1)}
                  onRemove={() => removeLanguage(language.id)}
                  onChange={(patch) => updateLanguage(language.id, patch)}
                />
              ))}

              <button
                type="button"
                className={styles.addItemTile}
                onClick={addLanguage}
              >
                <div className={styles.addItemTileIcon}>+</div>
                <p className={styles.addItemTileText}>Add language</p>
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
