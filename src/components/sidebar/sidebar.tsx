"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";

import { AccountSidebar } from "./AccountSidebar/account-sidebar";
import { CreateFlowSidebar } from "./CreateFlowSidebar/create-flow-sidebar";
import { Logo } from "./Logo";
import styles from "./sidebar.module.scss";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const cvId = params.id as string | undefined;
  const isCreateFlow = pathname.startsWith("/cv-builder/") && !!cvId;

  useEffect(() => {
    document.body.classList.toggle("create-flow", isCreateFlow);
    return () => {
      document.body.classList.remove("create-flow");
    };
  }, [isCreateFlow]);

  return (
    <aside key={pathname} className={styles.sidebar}>
      <Link href="/" className={styles.header}>
        <Logo />
      </Link>

      {isCreateFlow && cvId ? (
        <CreateFlowSidebar cvId={cvId} />
      ) : (
        <AccountSidebar pathname={pathname} />
      )}
    </aside>
  );
}
