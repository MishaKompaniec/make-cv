import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar/sidebar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="create-flow-container">{children}</div>
      </main>
    </div>
  );
}
