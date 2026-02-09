"use client";

import { useCallback, useState } from "react";

export function usePreviewState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(true);
  const [hasBlob, setHasBlob] = useState(false);

  const resetPages = useCallback(() => {
    setPageNumber(1);
    setNumPages(1);
  }, []);

  const setHasBlobIfChanged = useCallback((next: boolean) => {
    setHasBlob((prev) => (prev === next ? prev : next));
  }, []);

  const setIsGeneratingIfChanged = useCallback((next: boolean) => {
    setIsGenerating((prev) => (prev === next ? prev : next));
  }, []);

  const handleNumPagesChange = useCallback((next: number) => {
    if (!Number.isFinite(next) || next <= 0) return;

    setNumPages((prev) => (prev === next ? prev : next));
    setPageNumber((prev) => {
      const clamped = Math.min(Math.max(prev, 1), next);
      return prev === clamped ? prev : clamped;
    });
  }, []);

  return {
    pageNumber,
    setPageNumber,
    numPages,
    setNumPages,
    isGenerating,
    setIsGenerating,
    hasBlob,
    setHasBlob,
    resetPages,
    setHasBlobIfChanged,
    setIsGeneratingIfChanged,
    handleNumPagesChange,
  };
}
