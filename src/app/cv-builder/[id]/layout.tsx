import type { ReactNode } from "react";
import { CvProvider } from "./provider";

export default async function CvBuilderLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CvProvider cvId={id}>{children}</CvProvider>;
}
