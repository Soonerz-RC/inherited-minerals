// Build in-app CTA links that carry UTM/attribution forward through the hash
// router. Given a target route and a campaign name, we append the current UTM
// params (read live from the URL) plus a default utm_content so each landing
// page's CTA is attributable without persisting anything.

import { getAttribution } from "./attribution";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/**
 * Returns a hash-router href like "/sell?utm_source=…" that forwards any UTM
 * params present on the current URL. `fallbackContent` seeds utm_content when
 * the URL doesn't already carry one (useful to label which landing CTA fired).
 */
export function ctaHref(route: string, fallbackContent?: string): string {
  if (typeof window === "undefined") return route;
  const attribution = getAttribution();
  const params = new URLSearchParams();

  for (const key of UTM_KEYS) {
    const value = attribution[key];
    if (value) params.set(key, value);
  }
  if (fallbackContent && !params.get("utm_content")) {
    params.set("utm_content", fallbackContent);
  }

  const qs = params.toString();
  return qs ? `${route}?${qs}` : route;
}
