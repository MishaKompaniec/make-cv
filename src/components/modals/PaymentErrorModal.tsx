"use client";

import { Button } from "@/components/ui/button/button";
import { BaseModal } from "@/components/ui/modal/base-modal";
import { type CheckoutQueryType } from "@/lib/checkout-query";

import styles from "./PaymentErrorModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: CheckoutQueryType;
};

const COPY: Record<
  CheckoutQueryType,
  { title: string; heading: string; text: string }
> = {
  failed: {
    title: "Payment failed",
    heading: "We couldn’t process your payment",
    text: "Your card was declined or the payment could not be completed. Please try again or use another payment method.",
  },
  expired: {
    title: "Checkout expired",
    heading: "This checkout session has expired",
    text: "For security reasons, the checkout session is no longer valid. Please start the payment again.",
  },
};

export function PaymentErrorModal({ isOpen, onClose, type }: Props) {
  const copy = COPY[type];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.title}
      descriptionId="payment-error-modal-description"
      showCloseButton
      className={styles.modal}
    >
      <div className={styles.body}>
        <div className={styles.heading}>{copy.heading}</div>
        <div className={styles.text}>{copy.text}</div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            className={styles.ok}
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
