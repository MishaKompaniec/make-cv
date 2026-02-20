export type CheckoutQueryType = "failed" | "expired";

export const CHECKOUT_QUERY_PARAM = "checkout" as const;

export function isCheckoutQueryType(value: unknown): value is CheckoutQueryType {
  return value === "failed" || value === "expired";
}

export function getCheckoutQueryType(searchParams: URLSearchParams): CheckoutQueryType | null {
  const value = searchParams.get(CHECKOUT_QUERY_PARAM);
  return isCheckoutQueryType(value) ? value : null;
}

export function buildCheckoutUrl(baseUrl: string, type: CheckoutQueryType): string {
  const url = new URL(baseUrl);
  url.searchParams.set(CHECKOUT_QUERY_PARAM, type);
  return url.toString();
}
