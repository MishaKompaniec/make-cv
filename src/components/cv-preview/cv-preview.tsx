"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCvData } from "@/hooks/useCvData";
import { TEMPLATE_1_COLORS } from "@/components/pdf/templates/template-1/template-pdf";
import { TemplatePreview1 } from "@/components/pdf/templates/template-1/template-preview";
import styles from "./cv-preview.module.scss";

export function CvPreview() {
  const [mounted, setMounted] = useState(false);
  const { contactDetails } = useCvData();
  const [templateColor] = useLocalStorage(
    "cv-template-color",
    TEMPLATE_1_COLORS[0].value,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarColor = mounted ? templateColor : TEMPLATE_1_COLORS[0].value;
  const previewContactDetails = mounted ? contactDetails : undefined;

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.previewArea}>
        <TemplatePreview1
          sidebarColor={sidebarColor}
          mode="data"
          contactDetails={previewContactDetails}
        />
      </div>
    </div>
  );
}
