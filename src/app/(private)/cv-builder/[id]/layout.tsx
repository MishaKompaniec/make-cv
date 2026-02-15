import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar/sidebar";

import { CvProvider } from "./provider";

export default async function CvBuilderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="main-content__inner">
          <CvProvider cvId={id}>{children}</CvProvider>
        </div>
      </main>
    </div>
  );
}
