"use client";

import { useRouter } from "next/navigation";
import {
  type ElementType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";
import { useSectionList } from "@/hooks/useSectionList";

import { useCv } from "../provider";
import {
  CustomSectionCard,
  type CustomSectionItem,
} from "./custom-section-card";
import { type InterestItem, InterestsCard } from "./interests-card";
import { type LanguageItem, LanguagesCard } from "./languages-card";
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
  const didInitRef = useRef(false);
  const autosaveStateRef = useRef({
    selectedSections: { skip: true, lastSnapshot: "" },
    languages: { skip: true, lastSnapshot: "" },
    interests: { skip: true, lastSnapshot: "" },
    customSections: { skip: true, lastSnapshot: "" },
  });

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
    autosaveStateRef.current.selectedSections.skip = true;
    autosaveStateRef.current.languages.skip = true;
    autosaveStateRef.current.interests.skip = true;
    autosaveStateRef.current.customSections.skip = true;
  }, [cv, customSectionsList, interestsList, languagesList]);

  const patcher = useKeyedDebouncedCallback<
    "selectedSections" | "languages" | "interests" | "customSections",
    unknown
  >(async (key, value) => {
    if (!cvId) return;

    if (key === "selectedSections") {
      await patchCv({
        data: {
          selectedSections: value,
        },
      });
      return;
    }

    if (key === "languages") {
      await patchCv({
        data: {
          languages: value,
        },
      });
      return;
    }

    if (key === "interests") {
      await patchCv({
        data: {
          interests: value,
        },
      });
      return;
    }

    await patchCv({
      data: {
        customSections: value,
      },
    });
  });

  const isSaving = patcher.getIsInFlight();

  const schedulePatch = useCallback(
    (key: keyof typeof autosaveStateRef.current, value: unknown) => {
      if (!didInitRef.current) return;
      if (!cvId) return;

      const state = autosaveStateRef.current[key];
      const snapshot = JSON.stringify(value);

      if (state.skip) {
        state.skip = false;
        state.lastSnapshot = snapshot;
        return;
      }

      if (snapshot === state.lastSnapshot) return;
      state.lastSnapshot = snapshot;

      patcher.schedule(key, value);
    },
    [cvId, patcher],
  );

  useEffect(() => {
    if (!didInitRef.current) return;
    if (selectedSections) schedulePatch("selectedSections", selectedSections);
    if (languagesList.items.length)
      schedulePatch("languages", languagesList.items);
    if (interestsList.items.length)
      schedulePatch("interests", interestsList.items);
    if (customSectionsList.items.length)
      schedulePatch("customSections", customSectionsList.items);
  }, [
    customSectionsList.items,
    interestsList.items,
    languagesList.items,
    schedulePatch,
    selectedSections,
  ]);

  const toggleSection = (key: keyof SelectedSections) => {
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = useMemo(
    () => [
      {
        key: "languages" as const,
        title: "Languages",
        list: languagesList,
        Component: LanguagesCard,
        addLabel: "Add language",
        getItemProps: (language: LanguageItem) => ({ language }),
      },
      {
        key: "interests" as const,
        title: "Interests",
        list: interestsList,
        Component: InterestsCard,
        addLabel: "Add interest",
        getItemProps: (interest: InterestItem) => ({ interest }),
      },
      {
        key: "customSection" as const,
        title: "Custom section",
        list: customSectionsList,
        Component: CustomSectionCard,
        addLabel: "Add custom section",
        getItemProps: (section: CustomSectionItem) => ({ section }),
      },
    ],
    [customSectionsList, interestsList, languagesList],
  );

  const handleNextClick = async () => {
    for (const sec of sections) {
      if (selectedSections[sec.key] && !sec.list.validateAll()) return;
    }
    try {
      await patcher.flush();
      router.push(`/cv-builder/${cvId}/finalize`);
    } finally {
      // patcher manages isSaving via in-flight tracking
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
          {sections.map((sec) => (
            <button
              key={sec.key}
              type="button"
              className={`${styles.sectionToggle} ${selectedSections[sec.key] ? styles.sectionToggleActive : ""}`}
              onClick={() => toggleSection(sec.key)}
            >
              <Checkbox
                checked={selectedSections[sec.key]}
                onChange={() => toggleSection(sec.key)}
              />
              <span className={styles.sectionToggleText}>{sec.title}</span>
            </button>
          ))}
        </div>

        {sections.map((sec) => {
          if (!selectedSections[sec.key]) return null;

          const Component = sec.Component as ElementType;
          const onChange = (id: string, patch: unknown) => {
            if (sec.key === "languages") {
              languagesList.updateItem(
                id,
                patch as Partial<Omit<LanguageItem, "id">>,
              );
              return;
            }
            if (sec.key === "interests") {
              interestsList.updateItem(
                id,
                patch as Partial<Omit<InterestItem, "id">>,
              );
              return;
            }
            customSectionsList.updateItem(
              id,
              patch as Partial<Omit<CustomSectionItem, "id">>,
            );
          };

          return (
            <div key={sec.key} className={styles.sectionCard}>
              <div className={styles.sectionCardTitle}>{sec.title}</div>
              <div className={styles.itemsList}>
                {sec.list.items.map((item, index) => (
                  <Component
                    key={item.id}
                    ref={sec.list.setCardRef(item.id)}
                    {...sec.getItemProps(item as never)}
                    errors={sec.list.errors[item.id]}
                    canMoveUp={sec.list.items.length > 1 && index > 0}
                    canMoveDown={
                      sec.list.items.length > 1 &&
                      index < sec.list.items.length - 1
                    }
                    onMoveUp={() => sec.list.moveItem(index, index - 1)}
                    onMoveDown={() => sec.list.moveItem(index, index + 1)}
                    onRemove={() => sec.list.removeItem(item.id)}
                    onChange={(patch: unknown) => onChange(item.id, patch)}
                  />
                ))}

                <button
                  type="button"
                  className={styles.addItemTile}
                  onClick={sec.list.addItem}
                >
                  <div className={styles.addItemTileIcon}>+</div>
                  <p className={styles.addItemTileText}>{sec.addLabel}</p>
                </button>
              </div>
            </div>
          );
        })}
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
