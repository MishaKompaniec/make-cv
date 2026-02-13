"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CvCardLayout } from "@/components/cv-card/cv-card-layout";
import { CvCardSkeletonLayout } from "@/components/cv-card-skeleton/cv-card-skeleton";
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
import { Loader } from "@/components/ui/loader/loader";
import { getArray, getSelectedSections } from "@/lib/cv-data";
import type {
  CustomSectionPreviewItem,
  EducationPreviewItem,
  InterestPreviewItem,
  LanguagePreviewItem,
  SkillPreviewItem,
  WorkExperiencePreviewItem,
} from "@/lib/preview-items";

import styles from "./cv-card.module.scss";

const BlobProvider = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.BlobProvider),
  {
    ssr: false,
    loading: () => <CvCardSkeletonLayout />,
  },
);

const PdfCanvasPreview = dynamic(
  () =>
    import("@/components/pdf-canvas-preview/pdf-canvas-preview").then(
      (m) => m.PdfCanvasPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={styles.cvPreviewLoading}>
        <Loader />
      </div>
    ),
  },
);

export type CvListItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string | null;
  templateColors?: Record<string, string> | null;
  data: {
    contactDetails?: {
      fullName?: string;
    };
  };
};

type Props = {
  cv: CvListItem;
  deletingId: string | null;
  duplicatingId: string | null;
  onEdit: (id: string) => void;
  onRequestDelete: (id: string) => void;
  onRequestDuplicate: (id: string) => void;
  onPaywall: (cvId: string) => void;
};

function formatCvDateTime(value: string) {
  const d = new Date(value);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const date = `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  return { date, time };
}

function sanitizeFileNameBase(value: string) {
  const normalized = (value || "").normalize("NFKC");
  const withoutControlChars = normalized.replaceAll(
    /[^\S\r\n\t\p{L}\p{N}._ -]/gu,
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
  const base = withoutTrailingDotOrSpace
    .replaceAll(/[^\u007f\p{L}\p{N} _.-]/gu, "")
    .replaceAll(/\s+/g, "_")
    .replaceAll(/_+/g, "_")
    .replaceAll(/^_+|_+$/g, "");
  const limited = [...base].slice(0, 80).join("");
  return limited || "CV";
}

export function CvCard({
  cv,
  deletingId,
  duplicatingId,
  onEdit,
  onRequestDelete,
  onRequestDuplicate,
  onPaywall,
}: Props) {
  const templateId = cv.templateId ?? TEMPLATE_1_ID;
  const templateColors = cv.templateColors ?? {};

  const previewData = useMemo(() => {
    const data = (cv.data ?? {}) as Record<string, unknown>;

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
  }, [cv.data]);

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

  const displayName = cv.data?.contactDetails?.fullName?.trim() || cv.title;
  const fileNameBase = sanitizeFileNameBase(displayName || "CV");
  const fileName = `${fileNameBase}.pdf`;

  const created = formatCvDateTime(cv.createdAt);
  const updated = formatCvDateTime(cv.updatedAt);

  const isBusy = deletingId === cv.id || duplicatingId === cv.id;
  const [isExporting, setIsExporting] = useState(false);

  return (
    <BlobProvider document={pdfReactDocument}>
      {({ url, loading, error, blob }) => {
        const isPdfReady = !loading && !error && !!url && !!blob;

        if (!isPdfReady) {
          return <CvCardSkeletonLayout />;
        }

        return (
          <CvCardLayout
            preview={
              <div className={styles.cvPreview}>
                <PdfCanvasPreview
                  url={url}
                  className={styles.cvPreviewCanvas}
                  pageNumber={1}
                />
              </div>
            }
            title={<h3>{displayName}</h3>}
            meta={
              <>
                <p className={styles.updated}>
                  created {created.date} to {created.time}
                </p>
                <p className={styles.updated}>
                  last updated {updated.date} to {updated.time}
                </p>
              </>
            }
            actionsLeft={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(cv.id)}
                  disabled={isBusy}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRequestDuplicate(cv.id)}
                  disabled={isBusy}
                >
                  Duplicate
                </Button>
              </>
            }
            actionsRight={
              <Button
                variant="outline"
                size="sm"
                className={styles.deleteButton}
                onClick={() => onRequestDelete(cv.id)}
                disabled={isBusy}
              >
                Delete
              </Button>
            }
            download={
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => {
                  const run = async () => {
                    if (!blob) return;

                    setIsExporting(true);
                    try {
                      const res = await fetch("/api/export/permission", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                      });

                      if (!res.ok) {
                        onPaywall(cv.id);
                        return;
                      }

                      const json = (await res.json()) as {
                        allowed?: boolean;
                      };

                      if (!json.allowed) {
                        onPaywall(cv.id);
                        return;
                      }

                      const objectUrl = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = objectUrl;
                      a.download = fileName;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.setTimeout(
                        () => URL.revokeObjectURL(objectUrl),
                        0,
                      );
                    } finally {
                      setIsExporting(false);
                    }
                  };

                  void run();
                }}
                disabled={!blob || isBusy || isExporting}
              >
                {isExporting ? "Checking..." : "Download PDF"}
              </Button>
            }
          />
        );
      }}
    </BlobProvider>
  );
}
