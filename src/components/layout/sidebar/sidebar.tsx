"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.scss";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        Makemycv
      </Link>

      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}
        >
          My CV
        </Link>
      </nav>

      <div className={styles.account}>Account</div>
    </aside>
  );
}
