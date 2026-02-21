"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useLastVisitedStep } from "@/hooks/use-last-visited-step";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";

import { useCv } from "../provider";
import styles from "./page.module.scss";

const stepTitle = "Summary";

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
  const { updateLastVisitedStep } = useLastVisitedStep();
  const didInitRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    mode: "onChange",
    defaultValues: { professionalSummary: "" },
  });

  useEffect(() => {
    if (!cv || didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;
    const summaryFromApi = data["summary"];
    const initialSummary =
      typeof summaryFromApi === "string" ? summaryFromApi : "";

    reset({ professionalSummary: initialSummary });
    didInitRef.current = true;
  }, [cv, reset]);

  const patcher = useKeyedDebouncedCallback<"summary", string>(
    async (_key, value) => {
      if (!cvId) return;
      await patchCv({
        data: {
          summary: value,
        },
      });
    },
  );
  const isSaving = patcher.getIsInFlight();

  const schedulePatch = useCallback(
    (value: string) => {
      if (!didInitRef.current || !cvId) return;

      patcher.schedule("summary", value);
    },
    [cvId, patcher],
  );

  const registerWithFlush = (name: keyof SummaryFormData) => {
    const field = register(name);

    return {
      ...field,
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
        const rawValue = e.target.value; // сохраняем всё что вводит пользователь
        setValue(name, rawValue, { shouldDirty: true, shouldValidate: true });
        schedulePatch(rawValue); // нормализация только для отправки
      },
      onBlur: (e: FocusEvent<HTMLTextAreaElement>) => field.onBlur(e),
    };
  };

  const handleBackClick = async () => {
    await updateLastVisitedStep("contact-details");
    router.push(`/cv-builder/${cvId}/contact-details`);
  };

  const handleNextClick = handleSubmit(async () => {
    if (!cvId) return;
    try {
      await patcher.flush();
      await updateLastVisitedStep("work-experience");
      router.push(`/cv-builder/${cvId}/work-experience`);
    } finally {
    }
  });

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 3"
        title={stepTitle}
        description="Write a concise professional summary (3–5 sentences) that highlights your key skills, experiences, and career goals. Focus on what makes you unique and relevant to the position you’re applying for. Avoid generic statements and emphasize measurable achievements or specific strengths."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form className={styles.form} autoComplete="on">
            <div className={styles.fieldGroup}>
              <Textarea
                label="Professional summary"
                placeholder="Highlight what makes you unique and relevant for your target position."
                fullWidth
                required
                rows={6}
                maxLength={500}
                {...registerWithFlush("professionalSummary")}
                value={watch("professionalSummary")}
                error={errors.professionalSummary?.message}
              />
            </div>
          </form>
        </div>
      </section>

      <NavigationFooter
        onBackClick={handleBackClick}
        onNextClick={handleNextClick}
        nextLabel="Next Step"
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        nextLoading={isSaving}
      />
    </div>
  );
}
