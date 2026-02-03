"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/input";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { CreateCvHeader } from "@/components/layout/create-cv-header/create-cv-header";
import {
  contactDetailsSchema,
  type ContactDetailsFormData,
} from "@/lib/validations/cv-schema";
import { useCvData } from "@/hooks/useCvData";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

export default function ContactDetailsPage() {
  const router = useRouter();
  const { contactDetails, setContactDetails } = useCvData();

  const didInitRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
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
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        setContactDetails(data as ContactDetailsFormData);
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, setContactDetails]);

  const flushSave = () => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setContactDetails(getValues());
  };

  const registerWithFlush = (name: keyof ContactDetailsFormData) => {
    const field = register(name);
    return {
      ...field,
      onBlur: (e: FocusEvent<HTMLInputElement>) => {
        field.onBlur(e);
        flushSave();
      },
    };
  };

  const handleNextClick = handleSubmit((data) => {
    setContactDetails(data);
    router.push("/create-cv/summary");
  });

  return (
    <div className={styles.pageContainer}>
      <CreateCvHeader
        stepNumber="Step 2"
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
                {...registerWithFlush("fullName")}
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
                  {...registerWithFlush("jobTitle")}
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
                  {...registerWithFlush("city")}
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
                  {...registerWithFlush("phone")}
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
                  {...registerWithFlush("email")}
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
                  {...registerWithFlush("birthdate")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Postal code"
                  placeholder="1234"
                  fullWidth
                  autoComplete="postal-code"
                  {...registerWithFlush("postalCode")}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="LinkedIn"
                  placeholder="linkedin.com/in/janedoe"
                  fullWidth
                  {...registerWithFlush("linkedIn")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Git"
                  placeholder="github.com/janedoe"
                  fullWidth
                  {...registerWithFlush("git")}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Nationality"
                  placeholder="Danish"
                  fullWidth
                  {...registerWithFlush("nationality")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Work permit"
                  placeholder="EU Citizen"
                  fullWidth
                  {...registerWithFlush("workPermit")}
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      <NavigationFooter
        showBack={true}
        backHref="/create-cv"
        nextText="Next"
        nextHref="/create-cv/summary"
        onNextClick={handleNextClick}
      />
    </div>
  );
}
