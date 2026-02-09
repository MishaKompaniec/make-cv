export type BasePreviewItem = {
  id: string;
  description: string;
  title?: string;
  startDate?: { month: number; year: number };
  endDate?: { month: number; year: number };
};

export type WorkExperiencePreviewItem = BasePreviewItem & {
  jobTitle: string;
  companyName: string;
  city: string;
};

export type EducationPreviewItem = BasePreviewItem & {
  diploma: string;
  schoolName: string;
  schoolLocation: string;
};

export type SkillPreviewItem = {
  id: string;
  title: string;
};

export type LanguagePreviewItem = {
  id: string;
  name: string;
  level: string;
};

export type InterestPreviewItem = {
  id: string;
  title: string;
};

export type CustomSectionPreviewItem = BasePreviewItem & {
  title: string;
};
