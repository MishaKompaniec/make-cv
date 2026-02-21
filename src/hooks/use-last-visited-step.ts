import { useCallback } from "react";

import { useCv } from "@/app/(private)/cv-builder/[id]/provider";
import { type CvStepSlug } from "@/lib/cv-steps";

export function useLastVisitedStep() {
  const { cvId, patchCv } = useCv();

  const updateLastVisitedStep = useCallback(
    async (step: CvStepSlug) => {
      if (!cvId) return;
      await patchCv({ lastVisitedStep: step });
    },
    [cvId, patchCv],
  );

  return { updateLastVisitedStep };
}
