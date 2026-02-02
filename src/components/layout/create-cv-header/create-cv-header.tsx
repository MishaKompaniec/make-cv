"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button/button";
import { Loader } from "@/components/ui/loader/loader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCvData } from "@/hooks/useCvData";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
  TemplatePdf1,
} from "@/components/pdf/templates/template-1/template-pdf";
import {
  TEMPLATE_2_ID,
  TemplatePdf2,
} from "@/components/pdf/templates/template-2/template-pdf";

import styles from "./create-cv-header.module.scss";

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

type WorkExperiencePreviewItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  city: string;
  startDate?: { month: number; year: number };
  endDate?: { month: number; year: number };
  description: string;
};

interface CreateCvHeaderProps {
  stepNumber: string;
  title: string;
  description: string;
  hidePreviewButton?: boolean;
}

export function CreateCvHeader({
  stepNumber,
  title,
  description,
  hidePreviewButton,
}: CreateCvHeaderProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { contactDetails } = useCvData();
  const [templateId] = useLocalStorage("cv-template-id", TEMPLATE_1_ID);
  const [templateColors] = useLocalStorage<Record<string, string>>(
    "cv-template-colors",
    {},
  );
  const [workExperience] = useLocalStorage<WorkExperiencePreviewItem[]>(
    "cv-work-experience",
    [],
  );

  const selectedColor =
    templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

  const PdfDocument =
    templateId === TEMPLATE_2_ID ? TemplatePdf2 : TemplatePdf1;

  useEffect(() => {
    if (!isPreviewOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPreviewOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPreviewOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.flexContainer}>
        <h1>{title}</h1>
        <div className={styles.stepBadge}>{stepNumber}</div>
      </div>
      <p className={styles.description}>{description}</p>

      <div>
        {!hidePreviewButton && (
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsPreviewOpen(true)}
          >
            Preview CV
          </Button>
        )}
      </div>

      {isPreviewOpen && (
        <div
          className={styles.previewModalOverlay}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className={styles.previewModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.previewModalClose}
              aria-label="Close"
              onClick={() => setIsPreviewOpen(false)}
            />
            <div className={styles.previewModalPage}>
              <BlobProvider
                document={
                  <PdfDocument
                    sidebarColor={selectedColor}
                    contactDetails={contactDetails}
                    workExperience={workExperience}
                  />
                }
              >
                {({ url, loading, error }) => {
                  const renderStatus = (text: string) => (
                    <div className={styles.previewModalLoading}>{text}</div>
                  );

                  if (loading) {
                    return (
                      <div className={styles.previewModalLoading}>
                        <Loader />
                      </div>
                    );
                  }

                  if (error || !url) {
                    return renderStatus("Failed to generate preview.");
                  }

                  return (
                    <PdfCanvasPreview
                      url={url}
                      className={styles.previewPdfCanvas}
                    />
                  );
                }}
              </BlobProvider>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
