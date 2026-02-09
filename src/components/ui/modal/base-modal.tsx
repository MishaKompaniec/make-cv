"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

import styles from "./base-modal.module.scss";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  title?: string;
  className?: string;
  variant?: "center" | "fullscreen";
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  title,
  className,
  variant = "center",
}: BaseModalProps) {
  const contentClassName =
    variant === "fullscreen"
      ? styles.modalContentFullscreen
      : styles.modalContent;
  const closeClassName =
    variant === "fullscreen"
      ? styles.modalCloseFullscreen
      : styles.modalCloseInside;
  const bodyClassName =
    variant === "fullscreen" ? styles.modalBodyFullscreen : styles.modalBody;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        {variant === "fullscreen" && showCloseButton && (
          <Dialog.Close asChild>
            <button
              type="button"
              className={styles.modalCloseFullscreen}
              aria-label="Close"
            />
          </Dialog.Close>
        )}
        <Dialog.Content className={`${contentClassName} ${className ?? ""}`}>
          {title && (
            <Dialog.Title className={styles.srOnly}>{title}</Dialog.Title>
          )}
          <div className={bodyClassName}>
            {variant === "center" && showCloseButton && (
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={closeClassName}
                  aria-label="Close"
                />
              </Dialog.Close>
            )}
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
