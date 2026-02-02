"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCvData } from "@/hooks/useCvData";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
} from "@/components/pdf/templates/template-1/template-pdf";
import { TemplatePreview1 } from "@/components/pdf/templates/template-1/template-preview";
import { TEMPLATE_2_ID } from "@/components/pdf/templates/template-2/template-pdf";
import { TemplatePreview2 } from "@/components/pdf/templates/template-2/template-preview";
import { TEMPLATE_3_ID } from "@/components/pdf/templates/template-3/template-pdf";
import { TemplatePreview3 } from "@/components/pdf/templates/template-3/template-preview";
import { TEMPLATE_4_ID } from "@/components/pdf/templates/template-4/template-pdf";
import { TemplatePreview4 } from "@/components/pdf/templates/template-4/template-preview";
import { TEMPLATE_5_ID } from "@/components/pdf/templates/template-5/template-pdf";
import { TemplatePreview5 } from "@/components/pdf/templates/template-5/template-preview";
import styles from "./cv-preview.module.scss";

type WorkExperiencePreviewItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  city: string;
  startDate?: { month: number; year: number };
  endDate?: { month: number; year: number };
  description: string;
};

export function CvPreview() {
  const [mounted, setMounted] = useState(false);
  const { contactDetails } = useCvData();
  const [templateId] = useLocalStorage("cv-template-id", TEMPLATE_1_ID);
  const [workExperience] = useLocalStorage<WorkExperiencePreviewItem[]>(
    "cv-work-experience",
    [],
  );
  const [templateColors, setTemplateColors] = useLocalStorage<
    Record<string, string>
  >("cv-template-colors", {});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const legacy = window.localStorage.getItem("cv-template-color");
    if (!legacy) return;

    setTemplateColors((prev) => {
      if (prev?.[TEMPLATE_1_ID]) return prev;
      return { ...prev, [TEMPLATE_1_ID]: legacy };
    });
  }, []);

  const selectedColor =
    templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;
  const sidebarColor = mounted ? selectedColor : TEMPLATE_1_COLORS[0].value;
  const previewContactDetails = mounted ? contactDetails : undefined;
  const previewWorkExperience = mounted ? workExperience : undefined;

  const Preview =
    templateId === TEMPLATE_2_ID
      ? TemplatePreview2
      : templateId === TEMPLATE_3_ID
        ? TemplatePreview3
        : templateId === TEMPLATE_4_ID
          ? TemplatePreview4
          : templateId === TEMPLATE_5_ID
            ? TemplatePreview5
            : TemplatePreview1;

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.previewArea}>
        <Preview
          sidebarColor={sidebarColor}
          mode="data"
          contactDetails={previewContactDetails}
          workExperience={previewWorkExperience}
        />
      </div>
    </div>
  );
}
