"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea/textarea";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/modal-preview/create-cv-header";
import { useCv } from "../provider";
import { z } from "zod";
import styles from "./page.module.scss";

const stepTitle = "Add your professional summary";

const summarySchema = z.object({
  professionalSummary: z
    .string()
    .min(1, "Professional summary is required")
    .min(50, "Summary should be at least 50 characters long")
    .max(500, "Summary should not exceed 500 characters"),
});

type SummaryFormData = z.infer<typeof summarySchema>;

export default function SummaryPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();
  const [isSaving, setIsSaving] = useState(false);

  const didInitRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    mode: "onChange",
    defaultValues: { professionalSummary: "" },
  });

  useEffect(() => {
    if (!cv) return;
    if (didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;
    const summaryFromApi = data["summary"];
    const initialSummary =
      typeof summaryFromApi === "string" ? summaryFromApi : "";

    reset({ professionalSummary: initialSummary });
    didInitRef.current = true;
  }, [cv, reset]);

  const registerWithFlush = (name: keyof SummaryFormData) => {
    const field = register(name);
    return {
      ...field,
      onBlur: (e: FocusEvent<HTMLTextAreaElement>) => {
        field.onBlur(e);
      },
    };
  };

  const handleNextClick = handleSubmit(async (data) => {
    if (!cvId) return;

    setIsSaving(true);
    try {
      const nextData = {
        ...(((cv?.data ?? {}) as Record<string, unknown>) ?? {}),
        summary: data.professionalSummary,
      };

      await patchCv({ data: nextData });
      router.push(`/cv-builder/${cvId}/work-experience`);
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 3"
        title={stepTitle}
        description="Show how your background matches the job you want."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form className={styles.form} autoComplete="on">
            <div className={styles.fieldGroup}>
              <Textarea
                label="Professional summary"
                placeholder="Write a compelling summary that highlights your key skills, experiences, and career goals. Focus on what makes you unique and how your background aligns with your target position."
                fullWidth
                required
                rows={6}
                {...registerWithFlush("professionalSummary")}
                error={errors.professionalSummary?.message}
              />
            </div>
          </form>
        </div>
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}/contact-details`}
        nextHref={`/cv-builder/${cvId}/work-experience`}
        nextLabel={isSaving ? "Saving..." : "Next Step"}
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
