import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerAuthSession } from "@/auth";

export const runtime = "nodejs";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_URL is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});

const PRICES = {
  day: process.env.PRICE_DAY!,
  week: process.env.PRICE_WEEK!,
  lifetime: process.env.PRICE_LIFETIME!,
} as const;

type Plan = keyof typeof PRICES;

function isPlan(value: unknown): value is Plan {
  return value === "day" || value === "week" || value === "lifetime";
}

export async function POST(req: Request) {
  /* 1️⃣ Auth */
  const session = await getServerAuthSession();

  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* 2️⃣ Body */
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !isPlan((body as any).plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const plan = (body as any).plan as Plan;
  const priceId = PRICES[plan];

  /* 3️⃣ Stripe Checkout */
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    customer_email: email,

    success_url: `${process.env.NEXT_PUBLIC_URL}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}`,

    metadata: {
      plan,
      userEmail: email,
    },
  });

  /* 4️⃣ Response */
  return NextResponse.json({
    url: checkout.url,
  });
}
