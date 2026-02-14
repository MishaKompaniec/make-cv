"use client";

export default function CheckoutButtons() {
  async function buy(plan: "day" | "week" | "lifetime") {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = (await res.json()) as { url?: string };
    if (!data.url) return;

    window.location.href = data.url;
  }

  return (
    <div>
      <button onClick={() => buy("day")}>24h — $2.99</button>
      <button onClick={() => buy("week")}>7 days — $5.99</button>
      <button onClick={() => buy("lifetime")}>Lifetime — $9.99</button>
    </div>
  );
}
