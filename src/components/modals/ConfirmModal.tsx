"use client";

import { Button } from "@/components/ui/button/button";
import { BaseModal } from "@/components/ui/modal/base-modal";

import styles from "./ConfirmModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  descriptionId: string;
  heading: string;
  text: string;
  confirmLabel: string;
  confirmVariant: "primary" | "outline";
  onConfirm: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  confirmLoadingLabel?: string;
  isConfirmLoading?: boolean;
};

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  descriptionId,
  heading,
  text,
  confirmLabel,
  confirmVariant,
  onConfirm,
  confirmDisabled,
  cancelDisabled,
  confirmLoadingLabel,
  isConfirmLoading,
}: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      descriptionId={descriptionId}
      showCloseButton
      className={styles.modal}
    >
      <div className={styles.body}>
        <div className={styles.heading}>{heading}</div>
        <div className={styles.text}>{text}</div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={!!cancelDisabled}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            className={confirmVariant === "outline" ? styles.danger : undefined}
            onClick={onConfirm}
            disabled={!!confirmDisabled}
          >
            {isConfirmLoading ? confirmLoadingLabel ?? confirmLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
