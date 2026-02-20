"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";

import styles from "./page.module.scss";

export default function WelcomePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Logo />
        </div>
        <header className={styles.header}>
          <h1 className={styles.title}>Create a professional CV in minutes</h1>
          <p className={styles.subtitle}>
            Choose a template, fill in your details, and export a polished
            resume. You can even download one PDF for free.
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.icon} aria-hidden="true">
                1
              </div>
              <div>
                <p className={styles.featureTitle}>Pick a template</p>
                <p className={styles.featureText}>
                  Start with a modern layout and customize it as you go.
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.icon} aria-hidden="true">
                2
              </div>
              <div>
                <p className={styles.featureTitle}>Fill in your experience</p>
                <p className={styles.featureText}>
                  Guided steps make it easy to add work, education, and skills.
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.icon} aria-hidden="true">
                3
              </div>
              <div>
                <p className={styles.featureTitle}>Download your CV</p>
                <p className={styles.featureText}>
                  Export a clean PDF and share it with recruiters.
                </p>
              </div>
            </div>
          </div>

          <aside className={styles.cta}>
            <div className={styles.freePdf}>1 free PDF download</div>
            <p className={styles.ctaTitle}>Ready to build your CV?</p>
            <p className={styles.ctaText}>
              Sign in to create your CVs and keep everything saved in your
              account.
            </p>

            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Sign in
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
