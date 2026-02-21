import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import { isCvStepSlug } from "@/lib/cv-steps";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerAuthSession();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id;
}

export default async function CvBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await requireUserId();
  if (!userId) {
    redirect("/auth/signin");
  }

  const cv = await prisma.cv.findFirst({
    where: { id, userId },
  });

  if (!cv) {
    redirect("/dashboard");
  }

  const lastVisitedStep = isCvStepSlug(cv.lastVisitedStep)
    ? cv.lastVisitedStep
    : "choose-template";

  redirect(`/cv-builder/${id}/${lastVisitedStep}`);
}
