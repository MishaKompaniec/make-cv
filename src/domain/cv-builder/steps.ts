export type CvStepSlug =
  | "choose-template"
  | "contact-details"
  | "summary"
  | "work-experience"
  | "education"
  | "skills"
  | "other-sections"
  | "finalize";

export type CvStepConfig = {
  key: string;
  title: string;
  slug: CvStepSlug;
};

export const CV_STEPS: readonly CvStepConfig[] = [
  { key: "template", title: "Choose template", slug: "choose-template" },
  { key: "contact", title: "Contact details", slug: "contact-details" },
  { key: "summary", title: "Summary", slug: "summary" },
  { key: "work", title: "Work experience", slug: "work-experience" },
  { key: "education", title: "Education", slug: "education" },
  { key: "skills", title: "Skills", slug: "skills" },
  { key: "other", title: "Other sections", slug: "other-sections" },
  { key: "final", title: "Finalize", slug: "finalize" },
] as const;
