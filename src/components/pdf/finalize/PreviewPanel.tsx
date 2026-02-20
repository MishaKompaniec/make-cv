"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { Loader } from "@/components/ui/loader/loader";

import styles from "./PreviewPanel.module.scss";

const PdfCanvasPreview = dynamic(
  () =>
    import("@/components/pdf-canvas-preview/pdf-canvas-preview").then(
      (mod) => mod.PdfCanvasPreview,
    ),
  { ssr: false },
);

export function PreviewPanel({
  url,
  loading,
  error,
  blob,
  pageNumber,
  onNumPagesChange,
  onHasBlobChange,
  onIsGeneratingChange,
}: {
  url?: string | null;
  loading: boolean;
  error?: Error | null;
  blob?: Blob | null;
  pageNumber: number;
  onNumPagesChange: (numPages: number) => void;
  onHasBlobChange: (value: boolean) => void;
  onIsGeneratingChange: (value: boolean) => void;
}) {
  useEffect(() => {
    onHasBlobChange(!!blob);
  }, [blob, onHasBlobChange]);

  useEffect(() => {
    onIsGeneratingChange(loading);
  }, [loading, onIsGeneratingChange]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewFrame}>
        {loading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </div>
        ) : error || !url ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            Failed to generate preview.
          </div>
        ) : (
          <PdfCanvasPreview
            url={url}
            className={styles.previewCanvas}
            pageNumber={pageNumber}
            onNumPagesChange={onNumPagesChange}
          />
        )}
      </div>
    </div>
  );
}
