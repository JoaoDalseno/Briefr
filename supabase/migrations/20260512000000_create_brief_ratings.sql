-- Migration: create_brief_ratings
-- Stores per-brief ratings (1-5 stars + optional comment) from authenticated users.
-- Goal: build a quality-labeled dataset of (form_data, generated_content) pairs
-- that the AI can later consult as few-shot examples when generating new briefs.

create table if not exists public.brief_ratings (
  id          uuid        primary key default gen_random_uuid(),
  brief_id    uuid        not null references public.briefs (id) on delete cascade,
  user_id     uuid        not null references public.profiles (id) on delete cascade,

  -- 1 (poor) → 5 (excellent)
  rating      smallint    not null check (rating between 1 and 5),

  -- Optional free-text feedback (what worked, what could improve)
  comment     text        check (char_length(comment) <= 500),

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- One rating per user per brief (upsert-friendly)
  unique (brief_id, user_id)
);

create trigger brief_ratings_updated_at
  before update on public.brief_ratings
  for each row execute procedure public.handle_updated_at();

-- Index for fetching ratings of a specific brief efficiently
create index brief_ratings_brief_id_idx
  on public.brief_ratings (brief_id);

-- Index for the AI consultation query: fetch high-rated briefs with content
create index brief_ratings_rating_idx
  on public.brief_ratings (rating desc, created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.brief_ratings enable row level security;

-- No anonymous access
create policy "brief_ratings: no anonymous access"
  on public.brief_ratings
  for all
  to anon
  using (false);

-- Users can read only their own ratings
create policy "brief_ratings: users read own"
  on public.brief_ratings
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert ratings only for their own briefs
-- (join with briefs to confirm ownership)
create policy "brief_ratings: users insert own briefs"
  on public.brief_ratings
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.briefs
      where id = brief_id and user_id = auth.uid()
    )
  );

-- Users can update only their own ratings
create policy "brief_ratings: users update own"
  on public.brief_ratings
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own ratings
create policy "brief_ratings: users delete own"
  on public.brief_ratings
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ─── AI Consultation View ─────────────────────────────────────────────────────
-- Exposes high-rated brief examples (4-5 stars) with their full input/output
-- for use as few-shot examples in AI prompt construction.
-- Only accessible via service_role (never exposed to authenticated users).

create view public.brief_examples_for_ai as
  select
    b.id,
    b.form_data,
    b.generated_content,
    b.formats,
    r.rating,
    r.comment        as rating_comment,
    b.created_at
  from public.brief_ratings r
  join public.briefs b on b.id = r.brief_id
  where r.rating >= 4
  order by r.rating desc, b.created_at desc;

-- Revoke access from all roles; service_role bypasses RLS and can query directly
revoke all on public.brief_examples_for_ai from anon, authenticated;
