import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true });
  }

  const payload = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ received: true });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const email =
    session.metadata?.userEmail ??
    session.customer_email ??
    session.customer_details?.email ??
    null;

  const plan = session.metadata?.plan ?? null;

  if (!email || !plan) {
    return NextResponse.json({ received: true });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ received: true });
  }

  // База для продления (чтобы не затирать старую подписку)
  const now = new Date();

  const base =
    user.exportAccessUntil && user.exportAccessUntil > now
      ? user.exportAccessUntil
      : now;

  const update: {
    exportAccessUntil?: Date;
    hasLifetimeAccess?: boolean;
  } = {};

  if (plan === "day") {
    update.exportAccessUntil = new Date(base.getTime() + 24 * 60 * 60 * 1000);
  }

  if (plan === "week") {
    update.exportAccessUntil = new Date(
      base.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
  }

  if (plan === "lifetime") {
    update.hasLifetimeAccess = true;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ received: true });
  }

  await prisma.user.update({
    where: { email },
    data: update,
  });

  return NextResponse.json({ received: true });
}
