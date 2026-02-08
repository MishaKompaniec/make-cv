"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TEMPLATE_1_ID } from "@/components/pdf/templates/template-1/template-pdf";

type CvSnapshot = {
  id: string;
  title?: string;
  templateId: string;
  templateColors: Record<string, string>;
  data: Record<string, unknown>;
};

type CvApiResponse = {
  cv?: {
    id: string;
    title?: string;
    templateId?: string | null;
    templateColors?: Record<string, string> | null;
    data?: Record<string, unknown> | null;
  };
};

type PatchPayload = {
  title?: string;
  templateId?: string;
  templateColors?: Record<string, string>;
  data?: Record<string, unknown>;
};

type CvContextValue = {
  cvId: string;
  cv: CvSnapshot | null;
  isLoading: boolean;
  refreshCv: () => Promise<void>;
  patchCv: (payload: PatchPayload) => Promise<CvSnapshot | null>;
};

const CvContext = createContext<CvContextValue | null>(null);

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) {
    throw new Error("useCv must be used within CvProvider");
  }
  return ctx;
}

function normalizeCv(
  cv: CvApiResponse["cv"] | undefined | null,
): CvSnapshot | null {
  if (!cv) return null;
  return {
    id: cv.id,
    title: cv.title,
    templateId: cv.templateId ?? TEMPLATE_1_ID,
    templateColors: cv.templateColors ?? {},
    data: cv.data ?? {},
  };
}

export function CvProvider({
  cvId,
  children,
}: {
  cvId: string;
  children: ReactNode;
}) {
  const [cv, setCv] = useState<CvSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshInFlightRef = useRef<Promise<void> | null>(null);

  const refreshCv = useCallback(async () => {
    if (!cvId) return;

    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    const promise = (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cv/${cvId}`, { cache: "no-store" });
        if (!res.ok) {
          setCv(null);
          return;
        }

        const json = (await res.json()) as CvApiResponse;
        setCv(normalizeCv(json.cv));
      } catch (e) {
        setCv(null);
      } finally {
        setIsLoading(false);
      }
    })();

    refreshInFlightRef.current = promise;
    try {
      await promise;
    } finally {
      if (refreshInFlightRef.current === promise) {
        refreshInFlightRef.current = null;
      }
    }
  }, [cvId]);

  useEffect(() => {
    void refreshCv();
  }, [refreshCv]);

  const patchCv = useCallback(
    async (payload: PatchPayload) => {
      if (!cvId) return null;

      const res = await fetch(`/api/cv/${cvId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return null;
      }

      const json = (await res.json()) as CvApiResponse;
      const next = normalizeCv(json.cv);
      setCv(next);
      return next;
    },
    [cvId],
  );

  const value = useMemo<CvContextValue>(
    () => ({
      cvId,
      cv,
      isLoading,
      refreshCv,
      patchCv,
    }),
    [cvId, cv, isLoading, refreshCv, patchCv],
  );

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
}
