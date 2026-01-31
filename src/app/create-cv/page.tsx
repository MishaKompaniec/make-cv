"use client";

import { PageHeader } from "@/components/layout/page-header/page-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  TEMPLATE_1_ID,
  TEMPLATE_1_COLORS,
} from "@/components/pdf/templates/template-1/template-pdf";
import { TemplatePreview1 } from "@/components/pdf/templates/template-1/template-preview";
import styles from "./page.module.scss";

const stepTitle = "Choose template";

export default function ChooseTemplatePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useLocalStorage(
    "cv-template-id",
    TEMPLATE_1_ID,
  );
  const [selectedColor, setSelectedColor] = useLocalStorage(
    "cv-template-color",
    TEMPLATE_1_COLORS[0].value,
  );

  const handleNextClick = () => {
    window.location.href = "/create-cv/contact-details";
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Choose a template to start building your CV."
      />

      <div className={styles.content}>
        <div className={styles.templateGrid}>
          <div
            className={`${styles.templateCard}${
              selectedTemplateId === TEMPLATE_1_ID ? ` ${styles.selected}` : ""
            }`}
            onClick={() => setSelectedTemplateId(TEMPLATE_1_ID)}
          >
            <div className={styles.templatePreview}>
              <TemplatePreview1
                sidebarColor={selectedColor}
                mode="placeholder"
              />
            </div>

            <div className={styles.colorPicker}>
              {TEMPLATE_1_COLORS.map((color) => (
                <button
                  key={color.name}
                  className={`${styles.colorOption}${
                    styles[`color--${color.name}`]
                      ? ` ${styles[`color--${color.name}`]}`
                      : ""
                  }${
                    selectedColor === color.value ? ` ${styles.selected}` : ""
                  }`}
                  onClick={() => setSelectedColor(color.value)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <NavigationFooter
        showBack={false}
        nextText="Next"
        nextHref="/create-cv/contact-details"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
