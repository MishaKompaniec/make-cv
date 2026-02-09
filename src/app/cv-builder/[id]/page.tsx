"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
} from "@/components/pdf/templates/template-1/template-pdf";
import { TEMPLATE_2_ID } from "@/components/pdf/templates/template-2/template-pdf";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";

import styles from "./page.module.scss";
import { useCv } from "./provider";

const TemplatePreview1 = dynamic(() =>
  import("@/components/pdf/templates/template-1/template-preview").then(
    (mod) => ({ default: mod.TemplatePreview1 }),
  ),
);
const TemplatePreview2 = dynamic(() =>
  import("@/components/pdf/templates/template-2/template-preview").then(
    (mod) => ({ default: mod.TemplatePreview2 }),
  ),
);

const stepTitle = "Choose template";

export default function ChooseTemplatePage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [templateColors, setTemplateColors] = useState<Record<
    string,
    string
  > | null>(null);

  const effectiveTemplateId =
    selectedTemplateId ?? cv?.templateId ?? TEMPLATE_1_ID;
  const effectiveTemplateColors = templateColors ?? cv?.templateColors ?? {};
  const isInitialized = Boolean(cv);

  const patcher = useKeyedDebouncedCallback<
    "templateId" | "templateColors",
    unknown
  >(async (key, value) => {
    if (!cvId) return;
    if (key === "templateId") {
      await patchCv({ templateId: value as string });
      return;
    }

    await patchCv({ templateColors: value as Record<string, string> });
  });

  const templates = [
    { id: TEMPLATE_1_ID, Preview: TemplatePreview1 },
    { id: TEMPLATE_2_ID, Preview: TemplatePreview2 },
  ];

  const colorClassByName: Record<
    (typeof TEMPLATE_1_COLORS)[number]["name"],
    string
  > = {
    beige: styles["color--beige"],
    "light-blue": styles["color--light-blue"],
    "light-gray": styles["color--light-gray"],
    "light-green": styles["color--light-green"],
    "light-purple": styles["color--light-purple"],
  };

  const getTemplateColor = (templateId: string) =>
    effectiveTemplateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

  const handleNextClick = async () => {
    if (!cvId) return;
    await patcher.flush();
    router.push(`/cv-builder/${cvId}/contact-details`);
  };

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Choose a template to start building your CV."
        hidePreviewButton
      />

      <div className={styles.content}>
        <div className={styles.templateGrid}>
          {templates.map(({ id, Preview }) => {
            const cardColor = getTemplateColor(id);

            return (
              <div
                key={id}
                className={`${styles.templateCard}${
                  effectiveTemplateId === id ? ` ${styles.selected}` : ""
                }`}
                onClick={() => {
                  setSelectedTemplateId(id);
                  patcher.schedule("templateId", id);
                }}
              >
                <div className={styles.templatePreview}>
                  <Preview sidebarColor={cardColor} />
                </div>

                <div className={styles.colorPicker}>
                  {TEMPLATE_1_COLORS.map((color) => {
                    const colorClass = colorClassByName[color.name];
                    return (
                      <button
                        key={color.name}
                        className={`${styles.colorOption}${
                          colorClass ? ` ${colorClass}` : ""
                        }${
                          cardColor === color.value ? ` ${styles.selected}` : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTemplateColors((prev) => {
                            const nextColors = {
                              ...(prev ?? {}),
                              [id]: color.value,
                            };
                            patcher.schedule("templateColors", nextColors);
                            return nextColors;
                          });
                        }}
                        aria-label={`Select ${color.name} color`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NavigationFooter
        nextLabel={patcher.isInFlight ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !isInitialized || patcher.isInFlight}
        onNextClick={handleNextClick}
        nextHref={`/cv-builder/${cvId}/contact-details`}
      />
    </div>
  );
}
