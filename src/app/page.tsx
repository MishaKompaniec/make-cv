"use client";

import { Button } from "@/components/ui/button/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";

type CvListItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  data: {
    contactDetails?: {
      fullName?: string;
    };
  };
};

export default function Home() {
  const router = useRouter();

  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/cv", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setCvs([]);
          return;
        }

        const json = (await res.json()) as { cvs?: CvListItem[] };
        if (!cancelled) setCvs(json.cvs ?? []);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateCv = () => {
    const run = async () => {
      setIsCreating(true);
      try {
        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!res.ok) return;
        const json = (await res.json()) as { cv?: { id: string } };
        const id = json.cv?.id;
        if (!id) return;

        router.push(`/cv-builder/${id}`);
      } finally {
        setIsCreating(false);
      }
    };

    void run();
  };

  const handleDeleteCv = (id: string) => {
    const run = async () => {
      if (!id) return;
      setDeletingId(id);
      try {
        const res = await fetch(`/api/cv/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) return;

        setCvs((prev) => prev.filter((cv) => cv.id !== id));
      } finally {
        setDeletingId((prev) => (prev === id ? null : prev));
      }
    };

    void run();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My CV</h1>

      <div className={styles.grid}>
        <button
          onClick={handleCreateCv}
          className={styles.createCard}
          disabled={isCreating}
        >
          <div className={styles.plusIcon}>+</div>
          <p>{isCreating ? "Creating..." : "Create CV"}</p>
        </button>

        {isLoading
          ? null
          : cvs.map((cv) => {
              const displayName =
                cv.data?.contactDetails?.fullName?.trim() || cv.title;
              return (
                <div key={cv.id} className={styles.cvCard}>
                  <div className={styles.cvPreview}>
                    <div className={styles.previewHeader}></div>
                    <div className={styles.previewContent}>
                      <div className={styles.previewLine}></div>
                      <div
                        className={`${styles.previewLine} ${styles.short}`}
                      ></div>
                      <div className={styles.previewLine}></div>
                    </div>
                  </div>
                  <div className={styles.cvInfo}>
                    <h3>{displayName}</h3>
                    <p className={styles.updated}>
                      Updated {new Date(cv.updatedAt).toLocaleString()}
                    </p>
                    <div className={styles.actions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/cv-builder/${cv.id}`)}
                        disabled={deletingId === cv.id}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCv(cv.id)}
                        disabled={deletingId === cv.id}
                      >
                        {deletingId === cv.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
