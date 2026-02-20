"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button/button";

export default function CheckoutButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  async function buy(plan: "day" | "week" | "lifetime") {
    setLoading(plan);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { url?: string };
      if (!data.url) return;

      window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <Button onClick={() => buy("day")} loading={loading === "day"}>
        24h — €2.99
      </Button>
      <Button onClick={() => buy("week")} loading={loading === "week"}>
        7 days — €5.99
      </Button>
      <Button onClick={() => buy("lifetime")} loading={loading === "lifetime"}>
        Lifetime — €9.99
      </Button>
    </div>
  );
}
