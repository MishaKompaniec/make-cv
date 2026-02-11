"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CvCard, type CvListItem } from "@/components/cv-card/cv-card";
import { CvGridSkeleton } from "@/components/cv-card-skeleton/cv-card-skeleton";
import { Button } from "@/components/ui/button/button";
import { BaseModal } from "@/components/ui/modal/base-modal";

import styles from "./page.module.scss";

export default function Home() {
  const router = useRouter();

  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [confirmDuplicateId, setConfirmDuplicateId] = useState<string | null>(
    null,
  );

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

  const handleDuplicateCv = (id: string) => {
    const run = async () => {
      if (!id) return;
      const source = cvs.find((cv) => cv.id === id);
      if (!source) return;

      setDuplicatingId(id);
      try {
        const titleBase =
          typeof source.title === "string" && source.title.trim()
            ? source.title.trim()
            : "Untitled CV";

        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${titleBase} (Copy)`,
            templateId: source.templateId,
            templateColors: source.templateColors,
            data: source.data,
          }),
        });

        if (!res.ok) return;

        const json = (await res.json()) as { cv?: CvListItem };
        if (!json.cv?.id) return;

        setCvs((prev) => [json.cv as CvListItem, ...prev]);
      } finally {
        setDuplicatingId((prev) => (prev === id ? null : prev));
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

  const cvToDelete = useMemo(
    () => cvs.find((cv) => cv.id === confirmDeleteId) ?? null,
    [cvs, confirmDeleteId],
  );

  const cvToDuplicate = useMemo(
    () => cvs.find((cv) => cv.id === confirmDuplicateId) ?? null,
    [cvs, confirmDuplicateId],
  );

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <button
          onClick={handleCreateCv}
          className={styles.createCard}
          disabled={isCreating}
        >
          <div className={styles.plusIcon}>+</div>
          <p>{isCreating ? "Creating..." : "Create CV"}</p>
        </button>

        {isLoading ? (
          <CvGridSkeleton count={2} />
        ) : (
          cvs.map((cv) => (
            <CvCard
              key={cv.id}
              cv={cv}
              deletingId={deletingId}
              duplicatingId={duplicatingId}
              onEdit={(id) => router.push(`/cv-builder/${id}`)}
              onRequestDelete={(id) => setConfirmDeleteId(id)}
              onRequestDuplicate={(id) => setConfirmDuplicateId(id)}
            />
          ))
        )}
      </div>

      <BaseModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete CV"
        showCloseButton
        className={styles.confirmDeleteModal}
      >
        <div className={styles.confirmDeleteBody}>
          <div className={styles.confirmDeleteTitle}>Delete this CV?</div>
          <div className={styles.confirmDeleteText}>
            {cvToDelete
              ? `You are about to delete “${
                  cvToDelete.data?.contactDetails?.fullName?.trim() ||
                  cvToDelete.title
                }”. This action can’t be undone.`
              : "This action can’t be undone."}
          </div>

          <div className={styles.confirmDeleteActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmDeleteId(null)}
              disabled={!!deletingId}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={styles.confirmDeleteButton}
              onClick={() => {
                if (!confirmDeleteId) return;
                handleDeleteCv(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
              disabled={!confirmDeleteId || !!deletingId}
            >
              {deletingId && deletingId === confirmDeleteId
                ? "Deleting..."
                : "Delete"}
            </Button>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        isOpen={!!confirmDuplicateId}
        onClose={() => setConfirmDuplicateId(null)}
        title="Duplicate CV"
        showCloseButton
        className={styles.confirmDeleteModal}
      >
        <div className={styles.confirmDeleteBody}>
          <div className={styles.confirmDeleteTitle}>Duplicate this CV?</div>
          <div className={styles.confirmDeleteText}>
            {cvToDuplicate
              ? `You are about to create a copy of “${
                  cvToDuplicate.data?.contactDetails?.fullName?.trim() ||
                  cvToDuplicate.title
                }”. This will not affect your original CV.`
              : "This will not affect your original CV."}
          </div>

          <div className={styles.confirmDeleteActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmDuplicateId(null)}
              disabled={!!duplicatingId}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (!confirmDuplicateId) return;
                handleDuplicateCv(confirmDuplicateId);
                setConfirmDuplicateId(null);
              }}
              disabled={!confirmDuplicateId || !!duplicatingId}
            >
              {duplicatingId && duplicatingId === confirmDuplicateId
                ? "Duplicating..."
                : "Duplicate"}
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
