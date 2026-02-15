"use client";

import Image from "next/image";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";

import styles from "./main-header.module.scss";

interface MainHeaderProps {
  email: string;
  avatarUrl?: string | null;
  onLogout: () => void;
  logoSrc?: string;
  logoAlt?: string;
  logoFallback?: ReactNode;
}

function getInitial(email?: string) {
  if (!email) return "?";
  const trimmed = email.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

export function MainHeader({
  email,
  avatarUrl,
  onLogout,
  logoSrc,
  logoAlt = "Logo",
  logoFallback = "Logo",
}: MainHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoSlot}>
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={100}
            height={28}
            className={styles.logoImage}
            priority
          />
        ) : (
          <div className={styles.logoPlaceholder}>{logoFallback}</div>
        )}
      </div>

      <div className={styles.rightZone}>
        <span className={styles.email} title={email}>
          {email}
        </span>
        <div className={styles.avatar} aria-label="User avatar">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="User avatar" fill sizes="40px" />
          ) : (
            getInitial(email)
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className={styles.logoutButton}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
