import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserAccess = {
  exportAccessUntil: Date | null;
  hasLifetimeAccess: boolean;
};

function hasPaidExportAccess(user: UserAccess): boolean {
  if (user.hasLifetimeAccess) return true;

  if (user.exportAccessUntil && user.exportAccessUntil.getTime() > Date.now()) {
    return true;
  }

  return false;
}

export async function POST() {
  const session = await getServerAuthSession();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      exportAccessUntil: true,
      hasLifetimeAccess: true,
      freePdfDownloadUsed: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1️⃣ Платный доступ
  if (hasPaidExportAccess(user)) {
    return NextResponse.json({
      allowed: true,
      reason: "paid",
    });
  }

  // 2️⃣ Бесплатная попытка
  if (!user.freePdfDownloadUsed) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        freePdfDownloadUsed: true,
      },
    });

    return NextResponse.json({
      allowed: true,
      reason: "free",
    });
  }

  // 3️⃣ Paywall
  return NextResponse.json({
    allowed: false,
    reason: "paywall",
  });
}
