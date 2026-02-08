import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const session = await getServerAuthSession();
  const email = session?.user?.email;

  if (!email) {
    return {
      userId: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user?.id) {
    return {
      userId: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId: user.id, response: null };
}

export async function GET() {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const cvs = await prisma.cv.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      data: true,
    },
  });

  return NextResponse.json({ cvs });
}

export async function POST(request: Request) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const title =
    typeof body?.title === "string" && body.title.trim()
      ? body.title.trim()
      : "Untitled CV";
  const templateId =
    typeof body?.templateId === "string" && body.templateId
      ? body.templateId
      : "template-1";
  const templateColors = body?.templateColors ?? {};
  const data = body?.data ?? {};

  const cv = await prisma.cv.create({
    data: {
      userId,
      title,
      templateId,
      templateColors,
      data,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ cv }, { status: 201 });
}
