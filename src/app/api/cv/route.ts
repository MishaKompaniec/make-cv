import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

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
      templateId: true,
      templateColors: true,
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
  const templateIdProvided =
    typeof body?.templateId === "string" && Boolean(body.templateId);
  const templateId = templateIdProvided
    ? (body.templateId as string)
    : "template-1-v1";

  const templateColorsRaw = body?.templateColors;
  const templateColors = isPlainObject(templateColorsRaw)
    ? (templateColorsRaw as Prisma.JsonObject)
    : templateIdProvided
      ? {}
      : { [templateId]: "#EFEAE2" };
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
      templateId: true,
      templateColors: true,
      data: true,
    },
  });

  return NextResponse.json({ cv }, { status: 201 });
}
