export function getArray<T>(data: Record<string, unknown>, key: string): T[] {
  const value = data[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

export type SelectedSectionsPreview = {
  languages: boolean;
  interests: boolean;
  customSection: boolean;
};

export const DEFAULT_SELECTED_SECTIONS: SelectedSectionsPreview = {
  languages: false,
  interests: false,
  customSection: false,
};

export function getSelectedSections(
  data: Record<string, unknown>,
  key = "selectedSections",
  defaults: SelectedSectionsPreview = DEFAULT_SELECTED_SECTIONS,
): SelectedSectionsPreview {
  const value = data[key];
  if (!value || typeof value !== "object") return defaults;

  const v = value as Partial<SelectedSectionsPreview>;
  return {
    languages: typeof v.languages === "boolean" ? v.languages : defaults.languages,
    interests:
      typeof v.interests === "boolean" ? v.interests : defaults.interests,
    customSection:
      typeof v.customSection === "boolean"
        ? v.customSection
        : defaults.customSection,
  };
}
