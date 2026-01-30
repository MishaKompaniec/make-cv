"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { PageHeader } from "@/components/layout/page-header/page-header";
import {
  contactDetailsSchema,
  type ContactDetailsFormData,
} from "@/lib/validations/cv-schema";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

export default function CreateCvPage() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ContactDetailsFormData) => {
    console.log("Form data:", data);
    // Here you would save the data and navigate to next step
    window.location.href = "/create-cv/work-experience";
  };

  const handleNextClick = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Tell us who you are so we can place your contact details prominently in every template."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <label className={styles.fieldGroup}>
              <span className={styles.label}>Full name *</span>
              <Input
                placeholder="Jane Doe"
                fullWidth
                {...register("fullName")}
                error={errors.fullName?.message}
              />
            </label>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Job title *</span>
                <Input
                  placeholder="Product Designer"
                  fullWidth
                  {...register("jobTitle")}
                  error={errors.jobTitle?.message}
                />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>City *</span>
                <Input
                  placeholder="Copenhagen, Denmark"
                  fullWidth
                  {...register("city")}
                  error={errors.city?.message}
                />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Phone number *</span>
                <Input
                  type="tel"
                  placeholder="(+45) 1234 5678"
                  fullWidth
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Email *</span>
                <Input
                  type="email"
                  placeholder="jane@email.com"
                  fullWidth
                  {...register("email")}
                  error={errors.email?.message}
                />
              </label>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Birthdate</span>
                <Input type="date" fullWidth {...register("birthdate")} />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Postal code</span>
                <Input
                  placeholder="1234"
                  fullWidth
                  {...register("postalCode")}
                />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>LinkedIn</span>
                <Input
                  placeholder="linkedin.com/in/janedoe"
                  fullWidth
                  {...register("linkedIn")}
                />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Git</span>
                <Input
                  placeholder="github.com/janedoe"
                  fullWidth
                  {...register("git")}
                />
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.fieldGroup}>
                <span className={styles.label}>Nationality</span>
                <Input
                  placeholder="Danish"
                  fullWidth
                  {...register("nationality")}
                />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.label}>Work permit</span>
                <Input
                  placeholder="EU Citizen"
                  fullWidth
                  {...register("workPermit")}
                />
              </label>
            </div>
          </form>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>CV Preview</div>
          <div className={styles.previewContent}>
            Your CV preview will appear here as you fill in the details
          </div>
        </div>
      </section>

      <NavigationFooter
        showBack={false}
        nextHref="/create-cv/work-experience"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
