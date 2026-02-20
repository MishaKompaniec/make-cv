"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CvGrid } from "@/components/cv-grid/CvGrid";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { PaymentErrorModal } from "@/components/modals/PaymentErrorModal";
import { PaywallModal } from "@/components/modals/PaywallModal";
import { useCvs } from "@/hooks/use-cvs";
import {
  CHECKOUT_QUERY_PARAM,
  getCheckoutQueryType,
} from "@/lib/checkout-query";

import styles from "./page.module.scss";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    cvs,
    isLoading,
    isCreating,
    deletingId,
    duplicatingId,
    createCv,
    deleteCv,
    duplicateCv,
  } = useCvs();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDuplicateId, setConfirmDuplicateId] = useState<string | null>(
    null,
  );

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [checkoutPlanInFlight, setCheckoutPlanInFlight] = useState<
    "day" | "week" | "lifetime" | null
  >(null);

  const checkoutErrorType = useMemo(() => {
    return getCheckoutQueryType(searchParams);
  }, [searchParams]);

  const [isPaymentErrorOpen, setIsPaymentErrorOpen] = useState(false);

  useEffect(() => {
    setIsPaymentErrorOpen(!!checkoutErrorType);
  }, [checkoutErrorType]);

  const closePaymentErrorModal = useCallback(() => {
    setIsPaymentErrorOpen(false);

    if (!checkoutErrorType) return;

    // Analytics: log payment error modal close
    console.warn("[Analytics] Payment error modal closed", {
      type: checkoutErrorType,
      timestamp: new Date().toISOString(),
    });
    // TODO: Replace with actual analytics service (e.g., amplitude, mixpanel)

    const next = new URLSearchParams(searchParams.toString());
    next.delete(CHECKOUT_QUERY_PARAM);
    const suffix = next.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, {
      scroll: false,
    });
  }, [checkoutErrorType, pathname, router, searchParams]);

  const handleCreateCv = useCallback(() => {
    const run = async () => {
      const id = await createCv();
      if (!id) return;

      router.push(`/cv-builder/${id}`);
    };

    void run();
  }, [createCv, router]);

  const cvToDelete = useMemo(
    () => cvs.find((cv) => cv.id === confirmDeleteId) ?? null,
    [cvs, confirmDeleteId],
  );

  const cvToDuplicate = useMemo(
    () => cvs.find((cv) => cv.id === confirmDuplicateId) ?? null,
    [cvs, confirmDuplicateId],
  );

  const openPaywall = useCallback((cvId: string) => {
    void cvId;
    setIsPaywallOpen(true);
  }, []);

  const startCheckout = useCallback((plan: "day" | "week" | "lifetime") => {
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
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/cv-builder/${id}`);
    },
    [router],
  );

  const handleRequestDelete = useCallback((id: string) => {
    setConfirmDeleteId(id);
  }, []);

  const handleRequestDuplicate = useCallback((id: string) => {
    setConfirmDuplicateId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!confirmDeleteId) return;
    void deleteCv(confirmDeleteId);
    setConfirmDeleteId(null);
  }, [confirmDeleteId, deleteCv]);

  const confirmDuplicate = useCallback(() => {
    if (!confirmDuplicateId) return;
    void duplicateCv(confirmDuplicateId);
    setConfirmDuplicateId(null);
  }, [confirmDuplicateId, duplicateCv]);

  return (
    <div className={styles.container}>
      {cvs.length === 0 && !isLoading ? (
        <EmptyState isCreating={isCreating} onCreate={handleCreateCv} />
      ) : (
        <CvGrid
          cvs={cvs}
          isLoading={isLoading}
          isCreating={isCreating}
          deletingId={deletingId}
          duplicatingId={duplicatingId}
          onCreate={handleCreateCv}
          onEdit={handleEdit}
          onRequestDelete={handleRequestDelete}
          onRequestDuplicate={handleRequestDuplicate}
          onPaywall={openPaywall}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete CV"
        descriptionId="delete-cv-modal-description"
        heading="Delete this CV?"
        text={
          cvToDelete
            ? `You are about to delete “${
                cvToDelete.data?.contactDetails?.fullName?.trim() ||
                cvToDelete.title
              }”. This action can’t be undone.`
            : "This action can’t be undone."
        }
        confirmLabel="Delete"
        confirmLoadingLabel="Deleting..."
        confirmVariant="outline"
        onConfirm={confirmDelete}
        confirmDisabled={!confirmDeleteId || !!deletingId}
        cancelDisabled={!!deletingId}
        isConfirmLoading={!!deletingId && deletingId === confirmDeleteId}
      />

      <ConfirmModal
        isOpen={!!confirmDuplicateId}
        onClose={() => setConfirmDuplicateId(null)}
        title="Duplicate CV"
        descriptionId="duplicate-cv-modal-description"
        heading="Duplicate this CV?"
        text={
          cvToDuplicate
            ? `You are about to create a copy of “${
                cvToDuplicate.data?.contactDetails?.fullName?.trim() ||
                cvToDuplicate.title
              }”. This will not affect your original CV.`
            : "This will not affect your original CV."
        }
        confirmLabel="Duplicate"
        confirmLoadingLabel="Duplicating..."
        confirmVariant="primary"
        onConfirm={confirmDuplicate}
        confirmDisabled={!confirmDuplicateId || !!duplicatingId}
        cancelDisabled={!!duplicatingId}
        isConfirmLoading={
          !!duplicatingId && duplicatingId === confirmDuplicateId
        }
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        checkoutPlanInFlight={checkoutPlanInFlight}
        onStartCheckout={startCheckout}
      />

      {checkoutErrorType && (
        <PaymentErrorModal
          isOpen={isPaymentErrorOpen}
          onClose={closePaymentErrorModal}
          type={checkoutErrorType}
        />
      )}
    </div>
  );
}
