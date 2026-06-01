# Inherited Mineral Rights — v1 Prototype Handoff

A polished, production-quality marketing site + interactive prototype for
**InheritedMineralRights.com**, built on the fullstack webapp template
(Express + Vite + React + Tailwind + shadcn/ui + Drizzle/SQLite).

## Key paths

- **Project root:** `/home/user/workspace/inherited-mineral-rights`
- **Frontend pages:** `client/src/pages/` (`Home`, `StartHere`, `Ask`, `Community`, `Sell`, `not-found`)
- **Shared layout/brand components:** `client/src/components/` (`SiteLayout.tsx` = header/footer/shell/disclaimer, `Logo.tsx` = inline SVG mark + wordmark)
- **Shared content (edit copy here):** `client/src/lib/content.ts` — situations, the 5 steps, Q&A categories, sample questions, "how we do business", doc options.
- **Routing:** `client/src/App.tsx` (wouter hash router — `/`, `/start-here`, `/ask`, `/community`, `/sell`)
- **Brand palette & fonts:** `client/src/index.css` (HSL design tokens, light + dark)
- **Data model:** `shared/schema.ts`
- **Backend storage (SQLite):** `server/storage.ts`
- **Backend routes + AI stub:** `server/routes.ts`
- **Logo (user's temporary JPG):** `attached_assets/logo.jpg`
- **Generated imagery:** `attached_assets/hero-landscape.png`, `attached_assets/documents-still-life.png`
- **Favicon:** `client/public/favicon.svg`

## How to run

```bash
cd /home/user/workspace/inherited-mineral-rights
npm install          # if deps not present
npm run dev          # dev: Express + Vite on http://localhost:5000
# production:
npm run build        # outputs dist/public (frontend) + dist/index.cjs (server)
NODE_ENV=production node dist/index.cjs   # serves on port 5000
```

Deploy: built static lives in `dist/public`. Deployed via
`deploy_website(project_path=".../dist/public", site_name="Inherited Mineral Rights", entry_point="index.html")`.
The production Express server on port 5000 backs the deployed site's `/api/*`
calls through the deploy proxy. **Re-run `npm run build` and the production
server before re-deploying after any change.**

## What was built (v1 scope — all complete)

1. **Homepage** — hero (image + tagline "Understand what you inherited before you sign"), situation cards, first-five-steps, AI assistant teaser, community Q&A teaser, selling/value section, trust/disclaimer, final CTA.
2. **Start Here** guide — full step-by-step heir workflow + "common mistakes" + disclaimer.
3. **Ask the Assistant** — realistic chat UI with starter prompts, typing indicator, prominent "preview / not advice" disclaimer. Wired to a working backend stub.
4. **Community Q&A** — categories with counts, sample popular questions, intake form (posts to DB), and a live "Recently posted here" feed.
5. **Sell / Value private review** — full form: name, email, state (dropdown), county, producing/not-producing/not-sure radios, document checkboxes, notes. Submits to DB + shows success state.
6. **SEO** — unique `<title>`, meta description, Open Graph tags (`client/index.html`), semantic headings throughout.
7. **Responsive** — verified desktop (1280px) and mobile (375px) via Playwright, incl. mobile nav.
8. **Real content** — no lorem ipsum anywhere.

## What is real vs. stubbed

- **REAL & persistent (SQLite `data.db`):**
  - `POST /api/review-requests` + `GET /api/review-requests` (sell inquiries)
  - `POST /api/questions` + `GET /api/questions` (community questions)
  - Tables auto-created on boot in `server/storage.ts`.
- **STUBBED (safe, no external keys):**
  - `POST /api/assistant` — returns **canned educational responses** via simple
    intent matching in `server/routes.ts` → `generateAssistantReply()`. It never
    gives legal/tax/financial advice and always returns a disclaimer.
  - **To wire a real LLM later:** replace the body of `generateAssistantReply()`
    with an LLM call, keep the `AssistantResponse` shape, and keep prepending
    `ASSISTANT_DISCLAIMER`. See `skills/website-building/shared/20-llm-api.md`.

## Next-step notes / TODOs

- **Logo:** currently the user's JPG is in `attached_assets/logo.jpg`; the site
  uses a hand-built **inline SVG re-creation** (`Logo.tsx`) so it scales crisply
  and adapts to dark mode. Swap in a final logo by editing `Logo.tsx` or
  importing the raster.
- **Supabase migration:** the template ships with `@supabase/supabase-js`. To
  evolve into the multi-user Q&A/forum, migrate `server/storage.ts` from SQLite
  to Supabase/Postgres (see `skills/website-building/webapp/references/supabase.md`).
  Schema in `shared/schema.ts` is already structured for it.
- **Auth:** `users` table + passport deps are present but unused in v1; wire up
  when the community needs accounts.
- **Email/notifications:** sell-review submissions currently only persist to DB —
  add an email/Slack notification on `POST /api/review-requests` for real intake.
- **Dark mode** tokens are defined but no toggle is shown; add a ThemeProvider if desired.
- **Form anti-spam / consent:** add a privacy consent checkbox + rate limiting before going live.
- **Image weight:** the two hero PNGs are ~3MB each; compress/convert to WebP before production launch.

## Brand reference

- Palette: deep mineral green `#1F4A3D` (primary), warm sandstone `#F6F1E8`,
  cream `#FFFDF8`, oilfield bronze `#B56B2A` (accent — `bg-bronze`/`text-bronze`),
  charcoal `#26241F`, muted clay `#7A6F62`, border tan `#D8CCBA`.
- Type: **Source Serif 4** (headings) + **DM Sans** (body), loaded via Google Fonts CDN.
- Voice: plain-English, protective, trustworthy, non-pushy, grounded.
