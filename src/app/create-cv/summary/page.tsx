"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea/textarea";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import { useCvData } from "@/hooks/useCvData";
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
  const { summary, setSummary } = useCvData();

  const didInitRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    mode: "onChange",
    defaultValues: { professionalSummary: summary || "" },
  });

  // Initialize form values from localStorage once.
  useEffect(() => {
    if (didInitRef.current) return;
    reset({ professionalSummary: summary || "" });
    didInitRef.current = true;
  }, [summary, reset]);

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((data) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        setSummary(data.professionalSummary || "");
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, setSummary]);

  const flushSave = () => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setSummary(getValues().professionalSummary);
  };

  const registerWithFlush = (name: keyof SummaryFormData) => {
    const field = register(name);
    return {
      ...field,
      onBlur: (e: FocusEvent<HTMLTextAreaElement>) => {
        field.onBlur(e);
        flushSave();
      },
    };
  };

  const handleNextClick = handleSubmit((data) => {
    setSummary(data.professionalSummary);
    router.push("/create-cv/work-experience");
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
        showBack={true}
        backHref="/create-cv/contact-details"
        nextText="Next"
        nextHref="/create-cv/work-experience"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
