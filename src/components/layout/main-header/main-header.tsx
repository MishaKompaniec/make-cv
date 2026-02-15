"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";

import styles from "./main-header.module.scss";

interface MainHeaderProps {
  email: string;
  avatarUrl?: string | null;
  onLogout: () => void;
}

function getInitial(email?: string) {
  if (!email) return "?";
  const trimmed = email.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

export function MainHeader({ email, avatarUrl, onLogout }: MainHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logoSlot}>
        <Logo />
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
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
