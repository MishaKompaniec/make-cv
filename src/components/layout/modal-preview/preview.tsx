"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";

import { useCv } from "@/app/cv-builder/[id]/provider";
import { Pagination } from "@/components/pdf/pagination/pagination";
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
import { BaseModal } from "@/components/ui/modal/base-modal";
import { usePreviewState } from "@/hooks/usePreviewState";
import { getArray, getSelectedSections } from "@/lib/cv-data";
import type {
  CustomSectionPreviewItem,
  EducationPreviewItem,
  InterestPreviewItem,
  LanguagePreviewItem,
  SkillPreviewItem,
  WorkExperiencePreviewItem,
} from "@/lib/preview-items";

import styles from "./preview.module.scss";

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.BlobProvider),
  { ssr: false },
);

const PdfCanvasPreview = dynamic(
  () =>
    import("@/components/pdf-canvas-preview/pdf-canvas-preview").then(
      (m) => m.PdfCanvasPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={styles.previewModalLoading}>
        <Loader />
      </div>
    ),
  },
);

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

  if (loading) {
    return (
      <div className={styles.previewModalLoading}>
        <Loader />
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className={styles.previewModalLoading}>
        Failed to generate preview.
      </div>
    );
  }

  return (
    <PdfCanvasPreview
      url={url}
      className={styles.previewPdfCanvas}
      pageNumber={pageNumber}
      onNumPagesChange={onNumPagesChange}
    />
  );
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { cv: cvSnapshot, isLoading: isCvLoading } = useCv();

  const {
    pageNumber,
    setPageNumber,
    numPages,
    isGenerating,
    hasBlob,
    resetPages,
    setHasBlobIfChanged,
    setIsGeneratingIfChanged,
    handleNumPagesChange,
  } = usePreviewState();

  useEffect(() => {
    if (!isOpen) return;
    resetPages();
  }, [isOpen, resetPages]);

  const templateId = cvSnapshot?.templateId ?? TEMPLATE_1_ID;
  const templateColors = cvSnapshot?.templateColors ?? {};

  const previewData = useMemo(() => {
    const data = (cvSnapshot?.data ?? {}) as Record<string, unknown>;

    return {
      contactDetails:
        (data["contactDetails"] as Record<string, unknown> | undefined) ?? {},
      summary: (data["summary"] as string | undefined) ?? "",
      workExperience: getArray<WorkExperiencePreviewItem>(
        data,
        "workExperience",
      ),
      education: getArray<EducationPreviewItem>(data, "education"),
      skills: getArray<SkillPreviewItem>(data, "skills"),
      languages: getArray<LanguagePreviewItem>(data, "languages"),
      interests: getArray<InterestPreviewItem>(data, "interests"),
      customSections: getArray<CustomSectionPreviewItem>(
        data,
        "customSections",
      ),
      selectedSections: getSelectedSections(data),
    };
  }, [cvSnapshot?.data]);

  const selectedColor =
    templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

  const PdfDocument =
    templateId === TEMPLATE_2_ID ? TemplatePdf2 : TemplatePdf1;

  const pdfReactDocument = useMemo(
    () => (
      <PdfDocument
        sidebarColor={selectedColor}
        contactDetails={previewData.contactDetails as Record<string, unknown>}
        workExperience={previewData.workExperience}
        education={previewData.education}
        skills={previewData.skills}
        languages={previewData.languages}
        interests={previewData.interests}
        customSections={previewData.customSections}
        selectedSections={previewData.selectedSections}
        summary={previewData.summary}
      />
    ),
    [PdfDocument, previewData, selectedColor],
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Preview"
      descriptionId="preview-modal-description"
      showCloseButton
      variant="fullscreen"
    >
      <div className={styles.previewModalPage}>
        {isCvLoading ? (
          <div className={styles.previewModalLoading}>
            <Loader />
          </div>
        ) : (
          <BlobProvider document={pdfReactDocument}>
            {({ url, loading, error, blob }) => (
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
            )}
          </BlobProvider>
        )}

        <Pagination
          numPages={numPages}
          pageNumber={pageNumber}
          onPageChange={setPageNumber}
          isGenerating={isGenerating}
          hasBlob={hasBlob}
          className={styles.pagination}
          pageButtonClassName={styles.pageButton}
          activeClassName={styles.active}
        />
      </div>
    </BaseModal>
  );
}
