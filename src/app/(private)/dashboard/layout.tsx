"use client";

import { signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";

import { MainHeader } from "@/components/layout/main-header/main-header";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="dashboard-layout">
      <MainHeader
        email={session?.user?.email ?? ""}
        avatarUrl={session?.user?.image}
        logoFallback="CV"
        onLogout={() => signOut({ callbackUrl: "/welcome" })}
      />

      <main>{children}</main>
    </div>
  );
}
