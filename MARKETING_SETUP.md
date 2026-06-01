# Marketing & Conversion Setup

This document describes the marketing, tracking, lead-storage, and SEO
infrastructure added for production readiness, and exactly which environment
variables turn each piece on.

**Everything is inert until configured.** With no env vars set, no tracking
scripts load, no conversions fire, the phone CTA is hidden, and form
submissions fall back to an in-memory store that reports `persistence: "memory"`.
The site deploys and works exactly as before until you add the IDs below.

> The app uses **hash routing**. Point ad campaigns at the hash URLs listed in
> the [Ad URLs](#ad-urls-for-campaigns) section.

---

## Where to add environment variables

- **Netlify:** Site settings → Environment variables. Add the keys, then
  trigger a redeploy (client `VITE_*` vars are inlined at build time, so a new
  build is required for them to take effect).
- **Local dev:** copy `.env.example` to `.env` and fill in values.

`VITE_*` variables are **client-side** (compiled into the bundle). Everything
without the `VITE_` prefix is **server-side** (read by Netlify Functions at
runtime) and never reaches the browser.

---

## 1. Tracking & analytics

| Env var | Purpose |
| --- | --- |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 (`G-XXXXXXXXXX`). Enables GA4 page views + custom events. |
| `VITE_GOOGLE_ADS_ID` | Google Ads account (`AW-XXXXXXXXXX`). Required for Ads conversions. |
| `VITE_GOOGLE_ADS_REVIEW_CONVERSION_LABEL` | Conversion label fired on a private-review submission. |
| `VITE_GOOGLE_ADS_QUESTION_CONVERSION_LABEL` | Conversion label fired on a community-question submission. |
| `VITE_META_PIXEL_ID` | Meta (Facebook) Pixel ID. Enables Pixel page views + Lead events. |
| `VITE_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token (injected as a meta tag). |

Implementation lives in `client/src/lib/analytics.ts`:

- `initAnalytics()` (called once in `client/src/main.tsx`) loads only the tags
  that have IDs.
- Route changes fire a `page_view` (GA4) and `PageView` (Meta) — see
  `client/src/App.tsx`.
- Conversions fire on the **thank-you pages**, so they only count a real
  completed submission:
  - `/thank-you/review` → `trackReviewConversion()`
  - `/thank-you/question` → `trackQuestionConversion()`

Each helper no-ops for any platform whose IDs are absent.

### Google Ads conversion labels

In Google Ads, create a conversion action and copy its "Conversion label" (the
string after the `/` in the `send_to` value `AW-XXXXXXXXXX/AbC-D_efGh`). Put the
account part in `VITE_GOOGLE_ADS_ID` and the label part in the matching
`..._CONVERSION_LABEL` var.

---

## 2. Phone / call tracking

| Env var | Purpose |
| --- | --- |
| `VITE_PUBLIC_PHONE_NUMBER` | Business phone number shown in click-to-call CTAs. |
| `VITE_CALL_TRACKING_NUMBER` | Optional. When set, this number is displayed/dialed instead (for a call-tracking provider DID). |

The `PhoneCTA` component (`client/src/components/PhoneCTA.tsx`) renders nothing
unless a number is configured, and tags every click as a `phone_click` event
(GA4) and `Contact` (Meta). It appears on the landing pages and the review
thank-you page.

---

## 3. Durable form storage (Supabase)

| Env var | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Service-role** key (server-only). Used by Netlify Functions to insert leads. |

1. Create a Supabase project.
2. Run `docs/supabase-schema.sql` in the Supabase SQL editor. It creates
   `review_requests`, `community_questions`, and `assistant_interactions`, each
   with `created_at`, `source_page`, UTM columns, referrer/landing_page, and a
   `consent` flag on `review_requests`.
3. Add the two env vars in Netlify and redeploy.

When configured, the functions (`netlify/functions/review-requests.mjs` and
`questions.mjs`) write to Supabase via its REST API and respond with
`persistence: "supabase"`. If the insert fails or the vars are missing, they
fall back to the in-memory store and respond with `persistence: "memory"` — the
user always gets a success confirmation.

> Row Level Security is enabled with no public policies. The service-role key
> bypasses RLS server-side; the anon key has no access. Keep the service-role
> key out of any client code.

---

## 4. Email notifications (Resend)

| Env var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. |
| `LEAD_NOTIFY_EMAIL` | Inbox that receives new-lead notifications. |
| `LEAD_FROM_EMAIL` | Optional verified sender (defaults to Resend's onboarding sender). |

When both `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` are set, each new review
request and community question triggers an email via Resend's REST API (no SDK
dependency). A failed email never fails the submission. No-ops when unset.

---

## 5. Attribution capture

`client/src/lib/attribution.ts` reads UTM params, referrer, landing page, and
the in-app source page **live from the URL at submit time** (no cookies or
storage). These ride along with every form POST and are persisted to the
attribution columns. Landing-page CTAs forward UTM params through the hash
router via `client/src/lib/cta.ts`.

Captured fields: `source_page`, `landing_page`, `referrer`, `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

---

## 6. SEO

- `client/public/robots.txt` and `client/public/sitemap.xml` are copied to the
  site root on build. **Update the domain** in both if it changes from
  `https://www.inheritedmineralrights.com`.
- Per-page `<title>` and meta description are set with the `usePageMeta` hook
  (`client/src/hooks/use-page-meta.ts`).
- Search Console verification: set `VITE_GOOGLE_SITE_VERIFICATION` (meta tag) or
  upload Google's HTML verification file to `client/public/`.

---

## Ad URLs (for campaigns)

Because of hash routing, use these exact URLs (swap in the real domain):

| Intent | URL |
| --- | --- |
| I inherited mineral rights | `https://www.inheritedmineralrights.com/#/inherited-mineral-rights` |
| I got an offer | `https://www.inheritedmineralrights.com/#/got-an-offer` |
| Value my minerals | `https://www.inheritedmineralrights.com/#/value-my-minerals` (alias `/#/value`) |

Append UTM params in the query string before the hash so they're captured, e.g.:

```
https://www.inheritedmineralrights.com/?utm_source=google&utm_medium=cpc&utm_campaign=inherited#/inherited-mineral-rights
```

(UTM params inside the hash, e.g. `#/inherited-mineral-rights?utm_source=…`, are
also read.)

---

## Legal / compliance

Privacy Policy (`/#/privacy`), Terms of Use (`/#/terms`), and Disclaimer
(`/#/disclaimer`) are linked in the footer and near the forms. They contain
**placeholders** for company legal name, contact email, mailing address,
governing state, and effective dates — fill these in before launch. Source:
`client/src/pages/legal/`.
