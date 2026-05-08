-- Migration: create_waitlist
-- Stores early-access signups. Accessed only via service_role (API Route).
-- Anon users cannot read or write directly — all writes go through the API.

create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null unique,
  profile     text        not null,
  volume      text,
  created_at  timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.waitlist enable row level security;

-- Block all direct client access — reads and writes go through service_role only
create policy "waitlist: no anon access"
  on public.waitlist
  for all
  to anon
  using (false);

create policy "waitlist: no authenticated direct access"
  on public.waitlist
  for all
  to authenticated
  using (false);
