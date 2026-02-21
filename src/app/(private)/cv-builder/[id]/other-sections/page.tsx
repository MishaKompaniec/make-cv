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

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { useLastVisitedStep } from "@/hooks/use-last-visited-step";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";
import { useSectionList } from "@/hooks/useSectionList";
import {
  customSectionItemSchema,
  interestItemSchema,
  languageItemSchema,
} from "@/lib/validations/cv-schema";

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

export default function OtherSectionsPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const { updateLastVisitedStep } = useLastVisitedStep();
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
      const parsed = languageItemSchema.safeParse(item);
      if (parsed.success) return {};

      const out: { name?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key !== "name") continue;
        if (out.name) continue;
        out.name = issue.message;
      }
      return out;
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
      const parsed = customSectionItemSchema.safeParse(item);
      if (parsed.success) return {};

      const out: { title?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key !== "title") continue;
        if (out.title) continue;
        out.title = issue.message;
      }
      return out;
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
      const parsed = interestItemSchema.safeParse(item);
      if (parsed.success) return {};

      const out: { title?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key !== "title") continue;
        if (out.title) continue;
        out.title = issue.message;
      }
      return out;
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

  const handleBackClick = async () => {
    await updateLastVisitedStep("skills");
    router.push(`/cv-builder/${cvId}/skills`);
  };

  const handleNextClick = async () => {
    for (const sec of sections) {
      if (selectedSections[sec.key] && !sec.list.validateAll()) return;
    }
    try {
      await patcher.flush();
      await updateLastVisitedStep("finalize");
      router.push(`/cv-builder/${cvId}/finalize`);
    } finally {
      // patcher manages isSaving via in-flight tracking
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 7"
        title={stepTitle}
        description="Add optional sections to make your CV more complete and tailored to your profile. Include languages you speak, your personal interests, or create a custom section to highlight other relevant experiences, projects, or achievements. These sections help recruiters get a fuller picture of your skills and personality."
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
        onBackClick={handleBackClick}
        onNextClick={handleNextClick}
        nextLabel="Next Step"
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        nextLoading={isSaving}
      />
    </div>
  );
}
