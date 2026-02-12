"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button/button";

import styles from "./account-sidebar.module.scss";

export function AccountSidebar({ pathname }: { pathname: string }) {
  const { data: session, status } = useSession();

  return (
    <>
      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}
        >
          My CV
        </Link>
      </nav>

      <div className={styles.account}>
        {status === "authenticated" ? (
          <>
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt="User avatar"
                width={50}
                height={50}
                className={styles.avatar}
              />
            )}
            <div className={styles.email}>
              {session.user?.email ?? "Account"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/welcome" })}
            >
              Sign out
            </Button>
          </>
        ) : (
          <Button variant="outline" size="md" onClick={() => signIn("google")}>
            Sign in
          </Button>
        )}
      </div>
    </>
  );
}
