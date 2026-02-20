"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { PaywallModal } from "@/components/modals/PaywallModal";
import { PreviewPanel } from "@/components/pdf/finalize/PreviewPanel";
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
import { usePreviewState } from "@/hooks/usePreviewState";
import { getArray, getSelectedSections } from "@/lib/cv-data";
import { downloadPdf } from "@/lib/download-pdf";
import type {
  CustomSectionPreviewItem,
  EducationPreviewItem,
  InterestPreviewItem,
  LanguagePreviewItem,
  SkillPreviewItem,
  WorkExperiencePreviewItem,
} from "@/lib/preview-items";

import { useCv } from "../provider";
import styles from "./page.module.scss";

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.BlobProvider),
  { ssr: false },
);

const stepTitle = "Finalize";

export default function FinalizePage() {
  const { cvId, cv: cvSnapshot, isLoading: isCvLoading } = useCv();

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [checkoutPlanInFlight, setCheckoutPlanInFlight] = useState<
    "day" | "week" | "lifetime" | null
  >(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    pageNumber,
    setPageNumber,
    numPages,
    isGenerating,
    hasBlob,
    setHasBlobIfChanged,
    setIsGeneratingIfChanged,
    handleNumPagesChange,
  } = usePreviewState();

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
    ((previewData.contactDetails as Record<string, unknown>)
      ?.fullName as string) || "CV",
  );
  const defaultFileName = `${defaultFileNameBase}.pdf`;

  const blobRef = useRef<Blob | null>(null);

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

  const startCheckout = useCallback((plan: "day" | "week" | "lifetime") => {
    const run = async () => {
      setCheckoutPlanInFlight(plan);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        const data = (await res.json()) as { url?: string };
        if (!data.url) return;
        window.location.href = data.url;
      } finally {
        setCheckoutPlanInFlight(null);
      }
    };

    void run();
  }, []);

  const triggerPaywall = useCallback(() => {
    setIsPaywallOpen(true);
  }, []);

  const handleDownload = useCallback(() => {
    if (isExporting) return;

    const run = async () => {
      setIsExporting(true);
      try {
        await downloadPdf({
          cvId,
          fileName: defaultFileName,
          triggerPaywall,
        });
      } finally {
        setIsExporting(false);
      }
    };

    void run();
  }, [cvId, defaultFileName, isExporting, triggerPaywall]);

  return (
    <div key={cvId} className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 8"
        title={stepTitle}
        description="Review all the information and appearance of your CV. You can return to any step at any time to edit your details. You can also download your CV directly from this step. Don’t worry about losing your data — everything has been automatically saved. Feel free to leave the page; your CV will always be accessible on the main page in your list of CVs."
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
                </>
              );
            }}
          </BlobProvider>
        )}
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/other-sections`}
        nextLabel="Download CV"
        nextDisabled={isCvLoading || isGenerating || !hasBlob || isExporting}
        nextLoading={isGenerating || isExporting}
        onNextClick={handleDownload}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        checkoutPlanInFlight={checkoutPlanInFlight}
        onStartCheckout={startCheckout}
      />
    </div>
  );
}
