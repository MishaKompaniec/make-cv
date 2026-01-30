"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { PageHeader } from "@/components/layout/page-header/page-header";
import {
  contactDetailsSchema,
  type ContactDetailsFormData,
} from "@/lib/validations/cv-schema";
import { useCvData } from "@/hooks/useCvData";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

export default function CreateCvPage() {
  const { contactDetails, setContactDetails } = useCvData();

  const didInitRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    mode: "onChange",
    defaultValues: contactDetails,
  });

  // Initialize form values from localStorage once.
  // Avoid resetting on every localStorage write, because it can cancel browser autofill.
  useEffect(() => {
    if (didInitRef.current) return;
    reset(contactDetails);
    didInitRef.current = true;
  }, [contactDetails, reset]);

  // Auto-save on field changes
  useEffect(() => {
    const subscription = watch((data) => {
      setContactDetails(data as ContactDetailsFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setContactDetails]);

  const handleNextClick = handleSubmit((data) => {
    setContactDetails(data);
    window.location.href = "/create-cv/work-experience";
  });

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 1"
        title={stepTitle}
        description="Tell us who you are so we can place your contact details prominently in every template."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form className={styles.form} autoComplete="on">
            <div className={styles.fieldGroup}>
              <Input
                label="Full name"
                placeholder="Jane Doe"
                fullWidth
                required
                autoComplete="name"
                {...register("fullName")}
                error={errors.fullName?.message}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Job title"
                  placeholder="Product Designer"
                  fullWidth
                  required
                  autoComplete="organization-title"
                  {...register("jobTitle")}
                  error={errors.jobTitle?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="City"
                  placeholder="Copenhagen, Denmark"
                  fullWidth
                  required
                  autoComplete="address-level2"
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="(+45) 1234 5678"
                  fullWidth
                  required
                  autoComplete="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="jane@email.com"
                  fullWidth
                  required
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Birthdate"
                  placeholder="DD/MM/YYYY"
                  fullWidth
                  autoComplete="bday"
                  {...register("birthdate")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Postal code"
                  placeholder="1234"
                  fullWidth
                  autoComplete="postal-code"
                  {...register("postalCode")}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="LinkedIn"
                  placeholder="linkedin.com/in/janedoe"
                  fullWidth
                  {...register("linkedIn")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Git"
                  placeholder="github.com/janedoe"
                  fullWidth
                  {...register("git")}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Nationality"
                  placeholder="Danish"
                  fullWidth
                  {...register("nationality")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Work permit"
                  placeholder="EU Citizen"
                  fullWidth
                  {...register("workPermit")}
                />
              </div>
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
