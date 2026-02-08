"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";
import {
  TEMPLATE_1_ID,
  TEMPLATE_1_COLORS,
} from "@/components/pdf/templates/template-1/template-pdf";
import { TEMPLATE_2_ID } from "@/components/pdf/templates/template-2/template-pdf";
import styles from "./page.module.scss";

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
  const params = useParams();
  const cvId = params.id as string;
  const [storedSelectedTemplateId, setSelectedTemplateId] = useLocalStorage(
    "cv-template-id",
    TEMPLATE_1_ID,
  );

  const [storedTemplateColors, setTemplateColors] = useLocalStorage<
    Record<string, string>
  >("cv-template-colors", {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedTemplateId = mounted ? storedSelectedTemplateId : TEMPLATE_1_ID;
  const templateColors = mounted ? storedTemplateColors : {};

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
    templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

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
                  selectedTemplateId === id ? ` ${styles.selected}` : ""
                }`}
                onClick={() => setSelectedTemplateId(id)}
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
                          setTemplateColors((prev) => ({
                            ...(prev ?? {}),
                            [id]: color.value,
                          }));
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

      <NavigationFooter nextHref={`/cv-builder/${cvId}/contact-details`} />
    </div>
  );
}
