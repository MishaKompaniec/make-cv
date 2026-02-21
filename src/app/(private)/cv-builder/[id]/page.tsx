import { redirect } from "next/navigation";

export default async function CvBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/cv-builder/${id}/choose-template`);
}
