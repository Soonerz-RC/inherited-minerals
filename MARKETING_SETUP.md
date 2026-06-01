# Marketing & Conversion Setup

This document describes the marketing, tracking, lead-storage, and SEO
infrastructure added for production readiness, and exactly which environment
variables turn each piece on.

**Everything is inert until configured.** With no env vars set, no tracking
scripts load, no conversions fire, and the phone CTA is hidden. The site
deploys and works exactly as before until you add the IDs below.

**Lead capture default: Netlify Forms.** Out of the box, the private review and
community question forms submit to **Netlify Forms**, which is the current
durable storage for leads — no database or env vars required. Submissions show
up in the Netlify dashboard immediately. See
[Lead capture](#3-lead-capture-netlify-forms-default) below for where to view
them, how to turn on email notifications, and how to migrate to a database
(Neon/Supabase) later.

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

## 3. Lead capture (Netlify Forms — default)

The two lead forms submit to **Netlify Forms** by default. This is the current
durable storage for leads: every submission is stored by Netlify and visible in
the dashboard, with no database, no env vars, and no secrets to manage.

| Netlify Forms name | Source form |
| --- | --- |
| `private-review-request` | Private review form (`/#/sell`) |
| `community-question` | Community Q&A form (`/#/community`) |

Each submission includes the form's own fields plus the attribution fields
(`source_page`, `landing_page`, `referrer`, `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content`, `utm_term`). The review form also records an
explicit `consent` agreement.

### How it works

- Hidden static stub forms live in `client/index.html` so Netlify's build-time
  bot can detect the forms and their fields. **These must stay in sync with the
  live forms' field names** — if you add a field, add it to both the React form
  and the matching stub in `index.html`.
- The live React forms submit via an AJAX POST to `/` with a URL-encoded body
  and a `form-name` field (Netlify's recommended SPA pattern). Implementation:
  `client/src/lib/leads.ts`.
- A `bot-field` honeypot is included for basic spam filtering.
- User flow is unchanged: on success the app redirects to
  `/#/thank-you/review` or `/#/thank-you/question`, where the conversion events
  fire.

### Where to view submissions

In Netlify: **Site → Forms**. Select `private-review-request` or
`community-question` to see entries, export them as CSV, or manage spam.

> Forms are only registered when Netlify post-processes a **production build**
> of the static site (it scans `dist/public/index.html`). The first deploy
> after adding/renaming a form is what registers it. Forms do not appear from
> local `vite` dev.

### Email notifications (in Netlify, no code)

**Site → Forms → Form notifications → Add notification → Email notification.**
Set the recipient inbox and (optionally) restrict it to a specific form. New
submissions are then emailed automatically. (You can also add Slack or outgoing
webhook notifications here.) This is independent of the optional Resend path in
[section 4](#4-email-notifications-resend), which only applies when you move to
the API/database backend.

### Later: migrate to a database (Neon/Supabase)

The Netlify Functions for a database-backed path are kept in `netlify/functions`
and are ready to use. To switch:

1. Stand up the database (Supabase today; the same REST pattern adapts to Neon).
   For Supabase, run `docs/supabase-schema.sql` to create `review_requests`,
   `community_questions`, and `assistant_interactions` (each with `created_at`,
   `source_page`, UTM columns, referrer/landing_page, and a `consent` flag on
   `review_requests`).
2. Add the backend env vars in Netlify (see [section 3a](#3a-database-backend-optional-env-vars)).
3. Set `VITE_LEAD_BACKEND=api` in Netlify and redeploy. The forms then POST JSON
   to `/api/review-requests` and `/api/questions` instead of Netlify Forms.

---

## 3a. Database backend (optional env vars)

Only relevant once `VITE_LEAD_BACKEND=api`. Leave unset while on Netlify Forms.

| Env var | Purpose |
| --- | --- |
| `VITE_LEAD_BACKEND` | `netlify-forms` (default) or `api`. `api` routes submissions to the Netlify Functions / database path. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Service-role** key (server-only). Used by Netlify Functions to insert leads. |

When `VITE_LEAD_BACKEND=api` and Supabase is configured, the functions
(`netlify/functions/review-requests.mjs` and `questions.mjs`) write to Supabase
via its REST API and respond with `persistence: "supabase"`. If the insert fails
or the vars are missing, they fall back to an in-memory store and respond with
`persistence: "memory"` — the user always gets a success confirmation.

> Row Level Security is enabled with no public policies. The service-role key
> bypasses RLS server-side; the anon key has no access. Keep the service-role
> key out of any client code.

---

## 4. Email notifications (Resend — optional, API backend only)

> On the default Netlify Forms backend, configure notifications directly in
> Netlify instead (see [Email notifications](#email-notifications-in-netlify-no-code)).
> The Resend path below only fires when `VITE_LEAD_BACKEND=api`.

| Env var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. |
| `LEAD_NOTIFY_EMAIL` | Inbox that receives new-lead notifications. |
| `LEAD_FROM_EMAIL` | Optional verified sender (defaults to Resend's onboarding sender). |

When the API backend is active and both `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL`
are set, each new review request and community question triggers an email via
Resend's REST API (no SDK dependency). A failed email never fails the
submission. No-ops when unset.

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
