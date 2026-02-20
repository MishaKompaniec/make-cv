"use client";

import { useEffect,useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const buttonSize = isMobile ? "sm" : "lg";

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

        <div className={styles.plans}>
          <div className={styles.plan}>
            <div className={styles.planContent}>
              <div className={styles.planHeader}>
                <div className={styles.planTitle}>24 Hours</div>
                <div className={styles.planPrice}>€2.99</div>
              </div>

              <div className={styles.planDescription}>
                Perfect for immediate needs. Download unlimited PDFs for 24
                hours.
              </div>

              <ul className={styles.planFeatures}>
                <li>Unlimited PDF downloads</li>
                <li>All templates available</li>
                <li>24 hour access</li>
              </ul>
            </div>

            <Button
              variant="outline"
              size={buttonSize}
              onClick={() => onStartCheckout("day")}
              disabled={!!checkoutPlanInFlight}
              fullWidth
            >
              {checkoutPlanInFlight === "day"
                ? "Redirecting..."
                : "Choose Plan"}
            </Button>
          </div>

          <div className={styles.plan}>
            <div className={styles.planContent}>
              <div className={styles.planHeader}>
                <div className={styles.planTitle}>7 Days</div>
                <div className={styles.planPrice}>€5.99</div>
              </div>

              <div className={styles.planDescription}>
                Great for job seekers. Take your time perfecting your CV over a
                week.
              </div>

              <ul className={styles.planFeatures}>
                <li>Unlimited PDF downloads</li>
                <li>All templates available</li>
                <li>7 days access</li>
                <li>Multiple CV versions</li>
              </ul>
            </div>

            <Button
              variant="outline"
              size={buttonSize}
              onClick={() => onStartCheckout("week")}
              disabled={!!checkoutPlanInFlight}
              fullWidth
            >
              {checkoutPlanInFlight === "week"
                ? "Redirecting..."
                : "Choose Plan"}
            </Button>
          </div>

          <div className={styles.plan}>
            <div className={styles.popularBadge}>Most Popular</div>
            <div className={styles.planContent}>
              <div className={styles.planHeader}>
                <div className={styles.planTitle}>Lifetime</div>
                <div className={styles.planPrice}>€9.99</div>
              </div>

              <div className={styles.planDescription}>
                Best value for professionals. Lifetime access to all features.
              </div>

              <ul className={styles.planFeatures}>
                <li>Unlimited PDF downloads</li>
                <li>All templates available</li>
                <li>Lifetime access</li>
                <li>Future updates included</li>
                <li>Priority support</li>
              </ul>
            </div>

            <Button
              variant="primary"
              size={buttonSize}
              onClick={() => onStartCheckout("lifetime")}
              disabled={!!checkoutPlanInFlight}
              fullWidth
            >
              {checkoutPlanInFlight === "lifetime"
                ? "Redirecting..."
                : "Choose Plan"}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
