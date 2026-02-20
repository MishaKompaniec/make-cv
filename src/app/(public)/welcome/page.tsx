"use client";

import { signIn } from "next-auth/react";
import { memo } from "react";

import { Button } from "@/components/ui/button/button";

import styles from "./page.module.scss";

const FEATURES = [
  {
    icon: "1",
    title: "Pick a template",
    text: "Start with a modern layout and customize it as you go.",
  },
  {
    icon: "2",
    title: "Fill in your experience",
    text: "Guided steps make it easy to add work, education, and skills.",
  },
  {
    icon: "3",
    title: "Download your CV",
    text: "Export a clean PDF and share it with recruiters.",
  },
] as const;

const Features = memo(function Features() {
  return (
    <div className={styles.features}>
      {FEATURES.map((feature) => (
        <div key={feature.icon} className={styles.feature}>
          <div className={styles.icon} aria-hidden="true">
            {feature.icon}
          </div>
          <div>
            <p className={styles.featureTitle}>{feature.title}</p>
            <p className={styles.featureText}>{feature.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

const CallToAction = memo(function CallToAction() {
  return (
    <aside className={styles.cta}>
      <div className={styles.freePdf}>1 free PDF download</div>
      <p className={styles.ctaTitle}>Ready to build your CV?</p>
      <p className={styles.ctaText}>
        Sign in to create your CVs and keep everything saved in your account.
      </p>

      <Button
        variant="primary"
        size="xl"
        fullWidth
        aria-label="Sign in with Google"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign in
      </Button>
    </aside>
  );
});

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 134 43"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0"
              y="3"
              width="35"
              height="45"
              rx="4"
              ry="4"
              fill="#2f855a"
            />
            <polygon points="24,3 35,14 24,14" fill="#276749" />
            <text
              x="17"
              y="28"
              fill="#ffffff"
              fontWeight="700"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              CV
            </text>
            <text
              x="42"
              y="29"
              fill="#2f855a"
              fontWeight="800"
              fontSize="53"
              dominantBaseline="middle"
            >
              Lab
            </text>
          </svg>
        </div>
        <header className={styles.header}>
          <h1 className={styles.title}>Create a professional CV in minutes</h1>
          <p className={styles.subtitle}>
            Choose a template, fill in your details, and export a polished
            resume. You can even download one PDF for free.
          </p>
        </header>

        <div className={styles.grid}>
          <Features />
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
