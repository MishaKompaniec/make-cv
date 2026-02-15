"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CvListItem } from "@/components/cv-card/cv-card";

type UseCvsResult = {
  cvs: CvListItem[];
  isLoading: boolean;
  isCreating: boolean;
  deletingId: string | null;
  duplicatingId: string | null;
  createCv: () => Promise<string | null>;
  deleteCv: (id: string) => Promise<void>;
  duplicateCv: (id: string) => Promise<void>;
};

export function useCvs(): UseCvsResult {
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/cv", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setCvs([]);
          return;
        }

        const json = (await res.json()) as { cvs?: CvListItem[] };
        if (!cancelled) setCvs(json.cvs ?? []);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const createCv = useCallback(async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) return null;
      const json = (await res.json()) as { cv?: { id: string } };
      return json.cv?.id ?? null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const deleteCv = useCallback(async (id: string) => {
    if (!id) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/cv/${id}`, { method: "DELETE" });
      if (!res.ok) return;

      setCvs((prev) => prev.filter((cv) => cv.id !== id));
    } finally {
      setDeletingId((prev) => (prev === id ? null : prev));
    }
  }, []);

  const duplicateCv = useCallback(
    async (id: string) => {
      if (!id) return;
      const source = cvs.find((cv) => cv.id === id);
      if (!source) return;

      setDuplicatingId(id);
      try {
        const titleBase =
          typeof source.title === "string" && source.title.trim()
            ? source.title.trim()
            : "Untitled CV";

        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${titleBase} (Copy)`,
            templateId: source.templateId,
            templateColors: source.templateColors,
            data: source.data,
          }),
        });

        if (!res.ok) return;

        const json = (await res.json()) as { cv?: CvListItem };
        if (!json.cv?.id) return;

        setCvs((prev) => [json.cv as CvListItem, ...prev]);
      } finally {
        setDuplicatingId((prev) => (prev === id ? null : prev));
      }
    },
    [cvs],
  );

  return useMemo(
    () => ({
      cvs,
      isLoading,
      isCreating,
      deletingId,
      duplicatingId,
      createCv,
      deleteCv,
      duplicateCv,
    }),
    [
      cvs,
      isLoading,
      isCreating,
      deletingId,
      duplicatingId,
      createCv,
      deleteCv,
      duplicateCv,
    ],
  );
}
