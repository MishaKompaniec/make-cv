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
      if (!didInitRef.current) return;
      if (!cvId) return;
      patcher.schedule("summary", value);
    },
    [cvId, patcher],
  );

  const registerWithFlush = (name: keyof SummaryFormData) => {
    const field = register(name);
    return {
      ...field,
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
        field.onChange(e);
        schedulePatch(e.target.value);
      },
      onBlur: (e: FocusEvent<HTMLTextAreaElement>) => {
        field.onBlur(e);
      },
    };
  };

  const handleNextClick = handleSubmit(async () => {
    if (!cvId) return;
    try {
      await patcher.flush();
      router.push(`/cv-builder/${cvId}/work-experience`);
    } finally {
      // patcher manages isSaving via in-flight tracking
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
