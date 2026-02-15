"use client";

import { Button } from "@/components/ui/button/button";
import { BaseModal } from "@/components/ui/modal/base-modal";

import styles from "./PaywallModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  checkoutPlanInFlight: "day" | "week" | "lifetime" | null;
  onStartCheckout: (plan: "day" | "week" | "lifetime") => void;
};

export function PaywallModal({
  isOpen,
  onClose,
  checkoutPlanInFlight,
  onStartCheckout,
}: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Download PDF"
      descriptionId="download-paywall-modal-description"
      showCloseButton
      className={styles.modal}
    >
      <div className={styles.body}>
        <div className={styles.heading}>Choose a plan to continue</div>
        <div className={styles.text}>
          To continue downloading PDFs, please select a plan.
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartCheckout("day")}
            disabled={!!checkoutPlanInFlight}
          >
            {checkoutPlanInFlight === "day" ? "Redirecting..." : "24h — $2.99"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onStartCheckout("week")}
            disabled={!!checkoutPlanInFlight}
          >
            {checkoutPlanInFlight === "week" ? "Redirecting..." : "7 days — $5.99"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onStartCheckout("lifetime")}
            disabled={!!checkoutPlanInFlight}
          >
            {checkoutPlanInFlight === "lifetime"
              ? "Redirecting..."
              : "Lifetime — $9.99"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
