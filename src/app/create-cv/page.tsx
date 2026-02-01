"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header/page-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";
import {
  TEMPLATE_1_ID,
  TEMPLATE_1_COLORS,
} from "@/components/pdf/templates/template-1/template-pdf";
import { TEMPLATE_2_ID } from "@/components/pdf/templates/template-2/template-pdf";
import { TEMPLATE_3_ID } from "@/components/pdf/templates/template-3/template-pdf";
import { TEMPLATE_4_ID } from "@/components/pdf/templates/template-4/template-pdf";
import { TEMPLATE_5_ID } from "@/components/pdf/templates/template-5/template-pdf";
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
const TemplatePreview3 = dynamic(() =>
  import("@/components/pdf/templates/template-3/template-preview").then(
    (mod) => ({ default: mod.TemplatePreview3 }),
  ),
);
const TemplatePreview4 = dynamic(() =>
  import("@/components/pdf/templates/template-4/template-preview").then(
    (mod) => ({ default: mod.TemplatePreview4 }),
  ),
);
const TemplatePreview5 = dynamic(() =>
  import("@/components/pdf/templates/template-5/template-preview").then(
    (mod) => ({ default: mod.TemplatePreview5 }),
  ),
);

const stepTitle = "Choose template";

export default function ChooseTemplatePage() {
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

  useEffect(() => {
    const legacy = window.localStorage.getItem("cv-template-color");
    if (!legacy) return;

    setTemplateColors((prev) => {
      if (prev?.[TEMPLATE_1_ID]) return prev;
      return { ...prev, [TEMPLATE_1_ID]: legacy };
    });
  }, []);

  const templates = [
    { id: TEMPLATE_1_ID, Preview: TemplatePreview1 },
    { id: TEMPLATE_2_ID, Preview: TemplatePreview2 },
    { id: TEMPLATE_3_ID, Preview: TemplatePreview3 },
    { id: TEMPLATE_4_ID, Preview: TemplatePreview4 },
    { id: TEMPLATE_5_ID, Preview: TemplatePreview5 },
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
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Choose a template to start building your CV."
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
                  <Preview sidebarColor={cardColor} mode="placeholder" />
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

      <NavigationFooter
        showBack={false}
        nextText="Next"
        nextHref="/create-cv/contact-details"
      />
    </div>
  );
}
