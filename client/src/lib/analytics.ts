// Marketing / conversion tracking scaffolding.
//
// Every integration here is INERT until the matching VITE_* env var is set at
// build time. With no IDs configured, nothing loads and every helper no-ops, so
// the site ships clean and turns tracking on later by adding env vars in Netlify
// and rebuilding. We never read/write cookies or storage ourselves — the
// third-party tags manage their own state once a real ID is present.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

const env = import.meta.env;

export const GA4_ID = (env.VITE_GA4_MEASUREMENT_ID ?? "").trim();
export const GOOGLE_ADS_ID = (env.VITE_GOOGLE_ADS_ID ?? "").trim();
export const GOOGLE_ADS_REVIEW_LABEL = (env.VITE_GOOGLE_ADS_REVIEW_CONVERSION_LABEL ?? "").trim();
export const GOOGLE_ADS_QUESTION_LABEL = (env.VITE_GOOGLE_ADS_QUESTION_CONVERSION_LABEL ?? "").trim();
export const META_PIXEL_ID = (env.VITE_META_PIXEL_ID ?? "").trim();
export const SITE_VERIFICATION = (env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

export const PUBLIC_PHONE_NUMBER = (env.VITE_PUBLIC_PHONE_NUMBER ?? "").trim();
export const CALL_TRACKING_NUMBER = (env.VITE_CALL_TRACKING_NUMBER ?? "").trim();

// The number a visitor should actually dial: prefer a call-tracking DID if set,
// else the public number. Empty when neither is configured.
export const DISPLAY_PHONE_NUMBER = CALL_TRACKING_NUMBER || PUBLIC_PHONE_NUMBER;

const hasGoogle = () => Boolean(GA4_ID || GOOGLE_ADS_ID);

let loaded = false;

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

/**
 * Load the configured tags once, on app start. Safe to call when nothing is
 * configured — it simply does nothing.
 */
export function initAnalytics() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  // Search Console verification meta (also acceptable to add server-side).
  if (SITE_VERIFICATION && !document.querySelector('meta[name="google-site-verification"]')) {
    const m = document.createElement("meta");
    m.name = "google-site-verification";
    m.content = SITE_VERIFICATION;
    document.head.appendChild(m);
  }

  // Google tag (gtag.js) — drives both GA4 and Google Ads.
  if (hasGoogle()) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    // Load gtag.js using whichever ID we have; configure each product.
    const primary = GA4_ID || GOOGLE_ADS_ID;
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primary)}`);
    if (GA4_ID) window.gtag("config", GA4_ID);
    if (GOOGLE_ADS_ID) window.gtag("config", GOOGLE_ADS_ID);
  }

  // Meta (Facebook) Pixel.
  if (META_PIXEL_ID) {
    /* eslint-disable */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode!.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq!("init", META_PIXEL_ID);
    window.fbq!("track", "PageView");
  }
}

/** Fire a GA4 custom event if GA4 is configured. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (GA4_ID && window.gtag) window.gtag("event", name, params);
}

/** Fire a Google Ads conversion if an Ads ID + label are configured. */
export function trackGoogleAdsConversion(label: string, params: Record<string, unknown> = {}) {
  if (GOOGLE_ADS_ID && label && window.gtag) {
    window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}`, ...params });
  }
}

/** Fire a Meta Pixel event if the pixel is configured. */
export function trackMetaEvent(name: string, params: Record<string, unknown> = {}) {
  if (META_PIXEL_ID && window.fbq) window.fbq("track", name, params);
}

/**
 * Conversion: a private-review request was submitted. Fires across all
 * configured platforms; no-ops for any platform without IDs.
 */
export function trackReviewConversion(params: Record<string, unknown> = {}) {
  trackEvent("review_request_submitted", params);
  trackGoogleAdsConversion(GOOGLE_ADS_REVIEW_LABEL, params);
  trackMetaEvent("Lead", { content_name: "private_review", ...params });
}

/**
 * Conversion: a community question was submitted.
 */
export function trackQuestionConversion(params: Record<string, unknown> = {}) {
  trackEvent("community_question_submitted", params);
  trackGoogleAdsConversion(GOOGLE_ADS_QUESTION_LABEL, params);
  trackMetaEvent("SubmitApplication", { content_name: "community_question", ...params });
}

/** A phone CTA was clicked. */
export function trackPhoneClick(location: string) {
  trackEvent("phone_click", { location, phone_number: DISPLAY_PHONE_NUMBER });
  trackMetaEvent("Contact", { location });
}
