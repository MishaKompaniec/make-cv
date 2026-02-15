"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Logo } from "@/components/ui/logo/logo";

import { CreateFlowSidebar } from "./CreateFlowSidebar/create-flow-sidebar";
import styles from "./sidebar.module.scss";

export function Sidebar() {
  const { id } = useParams();
  const cvId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    document.body.classList.add("create-flow");
    return () => document.body.classList.remove("create-flow");
  }, []);

  if (!cvId) return null;

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.header}>
        <Logo />
      </Link>

      <CreateFlowSidebar cvId={cvId} />
    </aside>
  );
}
