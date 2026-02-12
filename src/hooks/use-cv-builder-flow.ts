import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { CV_STEPS } from "@/domain/cv-builder/steps";

export type CvBuilderStep = {
  key: string;
  title: string;
  slug: string;
  path: string;
};

export function useCvBuilderFlow(cvId: string) {
  const pathname = usePathname();

  const steps: CvBuilderStep[] = useMemo(
    () =>
      CV_STEPS.map((step) => ({
        ...step,
        path: step.slug
          ? `/cv-builder/${cvId}/${step.slug}`
          : `/cv-builder/${cvId}`,
      })),
    [cvId],
  );

  const currentSlug = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[2] ?? "";
  }, [pathname]);

  const currentIndex = useMemo(() => {
    const foundIndex = steps.findIndex((step) => step.slug === currentSlug);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [steps, currentSlug]);

  const previousPath = useMemo(() => {
    return currentIndex > 0 ? steps[currentIndex - 1].path : "/";
  }, [steps, currentIndex]);

  return {
    steps,
    currentIndex,
    currentStep: steps[currentIndex],
    totalSteps: steps.length,
    currentStepNumber: currentIndex + 1,
    previousPath,
  };
}
