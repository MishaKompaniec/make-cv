"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Loader } from "@/components/ui/loader/loader";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
  TemplatePdf1,
} from "@/components/pdf/templates/template-1/template-pdf";
import {
  TEMPLATE_2_ID,
  TemplatePdf2,
} from "@/components/pdf/templates/template-2/template-pdf";
import { Button } from "@/components/ui/button/button";
import styles from "./page.module.scss";

type CvApiResponse = {
  cv?: {
    id: string;
    templateId: string;
    templateColors: Record<string, string>;
    data: Record<string, unknown>;
  };
};

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
  const router = useRouter();
  const params = useParams();
  const cvId = params.id as string;

  const [isCvLoading, setIsCvLoading] = useState(true);
  const [cvSnapshot, setCvSnapshot] = useState<CvApiResponse["cv"] | null>(
    null,
  );

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

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsCvLoading(true);
      try {
        const res = await fetch(`/api/cv/${cvId}`, { cache: "no-store" });
        if (!res.ok) return;

        const json = (await res.json()) as CvApiResponse;
        if (cancelled) return;

        setCvSnapshot(
          json.cv
            ? {
                ...json.cv,
                templateId: json.cv.templateId ?? TEMPLATE_1_ID,
                templateColors: json.cv.templateColors ?? {},
                data: json.cv.data ?? {},
              }
            : null,
        );
      } finally {
        if (!cancelled) setIsCvLoading(false);
      }
    };

    if (cvId) {
      void load();
    } else {
      setIsCvLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [cvId]);

  const templateId = cvSnapshot?.templateId ?? TEMPLATE_1_ID;
  const templateColors = cvSnapshot?.templateColors ?? {};
  const data = cvSnapshot?.data ?? {};

  const contactDetails =
    (data["contactDetails"] as Record<string, unknown> | undefined) ?? {};
  const summary = (data["summary"] as string | undefined) ?? "";
  const workExperience =
    (Array.isArray(data["workExperience"]) ? data["workExperience"] : []) ?? [];
  const education =
    (Array.isArray(data["education"]) ? data["education"] : []) ?? [];
  const skills = (Array.isArray(data["skills"]) ? data["skills"] : []) ?? [];
  const languages =
    (Array.isArray(data["languages"]) ? data["languages"] : []) ?? [];
  const interests =
    (Array.isArray(data["interests"]) ? data["interests"] : []) ?? [];
  const customSections =
    (Array.isArray(data["customSections"]) ? data["customSections"] : []) ?? [];
  const selectedSections =
    (data["selectedSections"] as any) ??
    ({ languages: false, interests: false, customSection: false } as const);

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
    (contactDetails as any)?.fullName || "CV",
  );
  const defaultFileName = `${defaultFileNameBase}.pdf`;

  const blobRef = useRef<Blob | null>(null);

  const pdfReactDocument = useMemo(
    () => (
      <PdfDocument
        sidebarColor={selectedColor}
        contactDetails={contactDetails as any}
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
    <div className={styles.pageContainer}>
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
