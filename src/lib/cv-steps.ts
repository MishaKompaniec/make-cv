export const CV_STEP_SLUGS = [
  "choose-template",
  "contact-details",
  "summary",
  "work-experience",
  "education",
  "skills",
  "other-sections",
  "finalize",
] as const;

export type CvStepSlug = (typeof CV_STEP_SLUGS)[number];

export function isCvStepSlug(value: unknown): value is CvStepSlug {
  return (
    typeof value === "string" &&
    (CV_STEP_SLUGS as readonly string[]).includes(value)
  );
}
