"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
  TemplatePdf1,
} from "@/components/pdf/templates/template-1/template-pdf";
import {
  TEMPLATE_2_ID,
  TemplatePdf2,
} from "@/components/pdf/templates/template-2/template-pdf";
import { Loader } from "@/components/ui/loader/loader";

import { useCv } from "../provider";
import styles from "./page.module.scss";

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.BlobProvider),
  { ssr: false },
);

const PdfCanvasPreview = dynamic(
  () =>
    import("@/components/pdf-canvas-preview/pdf-canvas-preview").then(
      (m) => m.PdfCanvasPreview,
    ),
  { ssr: false },
);

const stepTitle = "Finalize";

function PreviewPanel({
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

export default function FinalizePage() {
  const { cvId, cv: cvSnapshot, isLoading: isCvLoading } = useCv();

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const [isGenerating, setIsGenerating] = useState(true);
  const [hasBlob, setHasBlob] = useState(false);

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

  const templateId = cvSnapshot?.templateId ?? TEMPLATE_1_ID;
  const templateColors = cvSnapshot?.templateColors ?? {};
  const data = useMemo(() => cvSnapshot?.data ?? {}, [cvSnapshot?.data]);

  const contactDetails = useMemo(
    () => (data["contactDetails"] as Record<string, unknown> | undefined) ?? {},
    [data],
  );
  const summary = useMemo(
    () => (data["summary"] as string | undefined) ?? "",
    [data],
  );
  const workExperience = useMemo(
    () =>
      (Array.isArray(data["workExperience"]) ? data["workExperience"] : []) ??
      [],
    [data],
  );
  const education = useMemo(
    () => (Array.isArray(data["education"]) ? data["education"] : []) ?? [],
    [data],
  );
  const skills = useMemo(
    () => (Array.isArray(data["skills"]) ? data["skills"] : []) ?? [],
    [data],
  );
  const languages = useMemo(
    () => (Array.isArray(data["languages"]) ? data["languages"] : []) ?? [],
    [data],
  );
  const interests = useMemo(
    () => (Array.isArray(data["interests"]) ? data["interests"] : []) ?? [],
    [data],
  );
  const customSections = useMemo(
    () =>
      (Array.isArray(data["customSections"]) ? data["customSections"] : []) ??
      [],
    [data],
  );
  const selectedSections = useMemo(
    () =>
      (data["selectedSections"] as
        | { languages: boolean; interests: boolean; customSection: boolean }
        | undefined) ?? {
        languages: false,
        interests: false,
        customSection: false,
      },
    [data],
  );

  const selectedColor =
    templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

  const PdfDocument =
    templateId === TEMPLATE_2_ID ? TemplatePdf2 : TemplatePdf1;

  const sanitizeFileNameBase = (value: string) => {
    const normalized = (value || "").normalize("NFKC");
    const withoutControlChars = normalized.replaceAll(
      /[\u0000-\u001F\u007F]/g,
      "",
    );
    const withoutForbiddenWindowsChars = withoutControlChars.replaceAll(
      /[\\/:*?\"<>|]/g,
      "",
    );
    const collapsedWhitespace = withoutForbiddenWindowsChars
      .replaceAll(/\s+/g, " ")
      .trim();
    const withoutTrailingDotOrSpace = collapsedWhitespace.replaceAll(
      /[\s.]+$/g,
      "",
    );

    const keepLettersDigitsSpacesUnderscoreDash =
      withoutTrailingDotOrSpace.replaceAll(/[^\p{L}\p{N} _-]/gu, "");

    const base = keepLettersDigitsSpacesUnderscoreDash
      .replaceAll(/\s+/g, "_")
      .replaceAll(/_+/g, "_")
      .replaceAll(/^_+|_+$/g, "");

    const limited = [...base].slice(0, 80).join("");
    return limited || "CV";
  };

  const defaultFileNameBase = sanitizeFileNameBase(
    ((contactDetails as Record<string, unknown>)?.fullName as string) || "CV",
  );
  const defaultFileName = `${defaultFileNameBase}.pdf`;

  const blobRef = useRef<Blob | null>(null);

  const pdfReactDocument = useMemo(
    () => (
      <PdfDocument
        sidebarColor={selectedColor}
        contactDetails={contactDetails as Record<string, unknown>}
        workExperience={workExperience}
        education={education}
        skills={skills}
        languages={languages}
        interests={interests}
        customSections={customSections}
        selectedSections={selectedSections}
        summary={summary}
      />
    ),
    [
      PdfDocument,
      selectedColor,
      contactDetails,
      workExperience,
      education,
      skills,
      languages,
      interests,
      customSections,
      selectedSections,
      summary,
    ],
  );

  const handleDownload = () => {
    const blob = blobRef.current;
    if (!blob) return;

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = defaultFileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 0);
  };

  return (
    <div key={cvId} className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 8"
        title={stepTitle}
        description="Review your CV and make final adjustments before downloading or sharing."
        hidePreviewButton
      />

      <section className={styles.wrapper}>
        {isCvLoading ? (
          <div
            style={{
              width: "100%",
              minHeight: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader />
          </div>
        ) : (
          <BlobProvider document={pdfReactDocument}>
            {({ url, blob, loading, error }) => {
              blobRef.current = blob ?? null;

              return (
                <>
                  <PreviewPanel
                    url={url}
                    blob={blob}
                    loading={loading}
                    error={error}
                    pageNumber={pageNumber}
                    onNumPagesChange={handleNumPagesChange}
                    onHasBlobChange={setHasBlobIfChanged}
                    onIsGeneratingChange={setIsGeneratingIfChanged}
                  />

                  {numPages > 1 ? (
                    <div className={styles.pagination}>
                      {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            className={`${styles.pageButton} ${
                              pageNumber === pageNum ? styles.active : ""
                            }`}
                            onClick={() => setPageNumber(pageNum)}
                            disabled={isGenerating || !hasBlob}
                          >
                            {pageNum}
                          </button>
                        ),
                      )}
                    </div>
                  ) : null}
                </>
              );
            }}
          </BlobProvider>
        )}
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/other-sections`}
        nextLabel={isGenerating ? "Generating..." : "Download CV"}
        nextDisabled={isCvLoading || isGenerating || !hasBlob}
        onNextClick={handleDownload}
      />
    </div>
  );
}
