-- Supabase schema for InheritedMineralRights.com lead capture.
--
-- Run this in the Supabase SQL editor (or via the CLI) for the project whose
-- URL + service-role key you set as SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in
-- Netlify. The Netlify Functions write to these tables using the service-role
-- key (server-side only), so Row Level Security stays ON with no public policies.

-- ---------------------------------------------------------------------------
-- Private review / sell-inquiry requests (from the Sell page + landing CTAs)
-- ---------------------------------------------------------------------------
create table if not exists public.review_requests (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  name             text not null,
  email            text not null,
  state            text not null,
  county           text,
  producing_status text not null check (producing_status in ('producing','not_producing','not_sure')),
  documents        text[] not null default '{}',
  notes            text,
  -- Marketing attribution
  source_page      text,
  landing_page     text,
  referrer         text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  utm_term         text,
  -- Consent flag (reserved; set true when a consent checkbox is added)
  consent          boolean not null default false
);

create index if not exists review_requests_created_at_idx
  on public.review_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- Community questions (from the Community Q&A intake form)
-- ---------------------------------------------------------------------------
create table if not exists public.community_questions (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  title         text not null,
  body          text not null,
  category      text not null,
  state         text,
  display_name  text,
  source_page   text,
  landing_page  text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text
);

create index if not exists community_questions_created_at_idx
  on public.community_questions (created_at desc);

-- ---------------------------------------------------------------------------
-- Assistant interactions (optional log of on-site assistant Q&A)
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_interactions (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  message       text not null,
  reply         text,
  source_page   text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text
);

create index if not exists assistant_interactions_created_at_idx
  on public.assistant_interactions (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: enable on all tables. The service-role key used by the
-- Netlify Functions bypasses RLS, so no public policies are added here. Do NOT
-- expose the anon key with insert/select policies unless you intend public access.
-- ---------------------------------------------------------------------------
alter table public.review_requests       enable row level security;
alter table public.community_questions   enable row level security;
alter table public.assistant_interactions enable row level security;
