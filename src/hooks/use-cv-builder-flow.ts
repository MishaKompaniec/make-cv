import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { CV_STEPS } from "@/domain/cv-builder/steps";

export type CvBuilderStep = {
  key: string;
  title: string;
  slug: string;
  path: string;
};

type CvBuilderFlow = {
  steps: CvBuilderStep[];
  currentIndex: number;
  currentStep: CvBuilderStep | null;
  totalSteps: number;
  currentStepNumber: number;
  previousPath: string;
};

export function useCvBuilderFlow(cvId?: string): CvBuilderFlow {
  const pathname = usePathname();

  const steps: CvBuilderStep[] = useMemo(() => {
    if (!cvId) return [];
    return CV_STEPS.map((step) => ({
      ...step,
      path: `/cv-builder/${cvId}/${step.slug}`,
    }));
  }, [cvId]);

  const currentSlug = useMemo(() => {
    if (!cvId) return "";
    const segments = pathname.split("/").filter(Boolean);
    const idIndex = segments.indexOf(cvId);
    return idIndex >= 0 ? (segments[idIndex + 1] ?? "") : "";
  }, [pathname, cvId]);

  const currentIndex = useMemo(() => {
    const found = steps.findIndex((step) => step.slug === currentSlug);
    return found >= 0 ? found : 0;
  }, [steps, currentSlug]);

  const previousPath = useMemo(() => {
    if (currentIndex > 0) {
      return steps[currentIndex - 1]?.path ?? "/";
    }
    return "/";
  }, [steps, currentIndex]);

  return {
    steps,
    currentIndex,
    currentStep: steps[currentIndex] ?? null,
    totalSteps: steps.length,
    currentStepNumber: currentIndex + 1,
    previousPath,
  };
}
