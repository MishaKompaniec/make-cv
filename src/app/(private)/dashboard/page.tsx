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

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [checkoutPlanInFlight, setCheckoutPlanInFlight] = useState<
    "day" | "week" | "lifetime" | null
  >(null);

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

  const openPaywall = (cvId: string) => {
    void cvId;
    setIsPaywallOpen(true);
  };

  const startCheckout = (plan: "day" | "week" | "lifetime") => {
    const run = async () => {
      setCheckoutPlanInFlight(plan);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });

        const data = (await res.json()) as { url?: string };
        if (!data.url) return;
        window.location.href = data.url;
      } finally {
        setCheckoutPlanInFlight(null);
      }
    };

    void run();
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.grid}>
          <CvGridSkeleton count={2} />
        </div>
      ) : cvs.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <div aria-hidden>
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="6"
                  y="6"
                  width="60"
                  height="60"
                  rx="12"
                  fill="#f5f2f2ff"
                />
                <rect
                  x="16"
                  y="16"
                  width="40"
                  height="8"
                  rx="2"
                  fill="#daf0e0"
                />
                <rect
                  x="16"
                  y="28"
                  width="28"
                  height="6"
                  rx="2"
                  fill="#2f855a"
                />
                <rect
                  x="16"
                  y="38"
                  width="24"
                  height="6"
                  rx="2"
                  fill="#bcdbc5ff"
                />
                <rect
                  x="16"
                  y="48"
                  width="32"
                  height="6"
                  rx="2"
                  fill="#daf0e0"
                />
                <circle
                  cx="52"
                  cy="42"
                  r="7"
                  stroke="#2f855a"
                  strokeWidth="2.5"
                />
                <path
                  d="M52 38v4l2.5 2.5"
                  stroke="#2f855a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className={styles.emptyTitle}>Create your first CV</h2>
            <p className={styles.emptyText}>
              Start by creating a new CV, then customize sections, colors, and
              download when ready.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateCv}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create CV"}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          <button
            onClick={handleCreateCv}
            className={styles.createCard}
            disabled={isCreating}
          >
            <div className={styles.plusIcon}>+</div>
            <p>{isCreating ? "Creating..." : "Create CV"}</p>
          </button>

          {cvs.map((cv) => (
            <CvCard
              key={cv.id}
              cv={cv}
              deletingId={deletingId}
              duplicatingId={duplicatingId}
              onEdit={(id) => router.push(`/cv-builder/${id}`)}
              onRequestDelete={(id) => setConfirmDeleteId(id)}
              onRequestDuplicate={(id) => setConfirmDuplicateId(id)}
              onPaywall={(id) => openPaywall(id)}
            />
          ))}
        </div>
      )}

      <BaseModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete CV"
        descriptionId="delete-cv-modal-description"
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
        descriptionId="duplicate-cv-modal-description"
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

      <BaseModal
        isOpen={isPaywallOpen}
        onClose={() => {
          setIsPaywallOpen(false);
        }}
        title="Download PDF"
        descriptionId="download-paywall-modal-description"
        showCloseButton
        className={styles.confirmDeleteModal}
      >
        <div className={styles.confirmDeleteBody}>
          <div className={styles.confirmDeleteTitle}>
            Choose a plan to continue
          </div>
          <div className={styles.confirmDeleteText}>
            To continue downloading PDFs, please select a plan.
          </div>

          <div className={styles.confirmDeleteActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startCheckout("day")}
              disabled={!!checkoutPlanInFlight}
            >
              {checkoutPlanInFlight === "day"
                ? "Redirecting..."
                : "24h — $2.99"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => startCheckout("week")}
              disabled={!!checkoutPlanInFlight}
            >
              {checkoutPlanInFlight === "week"
                ? "Redirecting..."
                : "7 days — $5.99"}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => startCheckout("lifetime")}
              disabled={!!checkoutPlanInFlight}
            >
              {checkoutPlanInFlight === "lifetime"
                ? "Redirecting..."
                : "Lifetime — $9.99"}
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
