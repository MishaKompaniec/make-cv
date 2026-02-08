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

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const { id } = await ctx.params;

  const cv = await prisma.cv.findFirst({
    where: { id, userId },
  });

  if (!cv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ cv });
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const { id } = await ctx.params;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const existing = await prisma.cv.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body?.title === "string") data.title = body.title;
  if (body?.data !== undefined) data.data = body.data;
  if (typeof body?.templateId === "string") data.templateId = body.templateId;
  if (body?.templateColors !== undefined)
    data.templateColors = body.templateColors;

  const cv = await prisma.cv.update({
    where: { id },
    data,
  });

  return NextResponse.json({ cv });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { userId, response } = await requireUserId();
  if (response) return response;

  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.cv.findFirst({
    where: { id, userId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cv.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
