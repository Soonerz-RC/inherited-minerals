// Collect marketing attribution from the current URL so it can ride along with
// form submissions. We do NOT persist anything (no cookies/storage) — values are
// read live from the URL at submit time. With hash routing, UTM params may sit
// in the document query string (?utm_source=…#/sell) or inside the hash
// (#/sell?utm_source=…); we check both.

export interface Attribution {
  source_page: string;
  landing_page: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function paramsFromHash(): URLSearchParams {
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  return new URLSearchParams(qIndex >= 0 ? hash.slice(qIndex + 1) : "");
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") {
    return { source_page: "", landing_page: "", referrer: "" };
  }

  const search = new URLSearchParams(window.location.search);
  const hashParams = paramsFromHash();
  const pick = (key: string) => search.get(key) ?? hashParams.get(key) ?? undefined;

  // The in-app route (hash path without its own query string).
  const rawHash = (window.location.hash || "#/").replace(/^#/, "");
  const sourcePage = rawHash.split("?")[0] || "/";

  const attribution: Attribution = {
    source_page: sourcePage,
    landing_page: window.location.href,
    referrer: document.referrer || "",
  };

  for (const key of UTM_KEYS) {
    const value = pick(key);
    if (value) attribution[key] = value;
  }

  return attribution;
}
