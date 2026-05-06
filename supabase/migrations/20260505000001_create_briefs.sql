-- Migration: create_briefs
-- Stores form input and generated brief content per user.

create table if not exists public.briefs (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles (id) on delete cascade,

  -- Raw form data submitted by the user (product name, audience, format, etc.)
  form_data         jsonb       not null default '{}',

  -- AI-generated brief content keyed by format: { estatico, story, ugc }
  generated_content jsonb       not null default '{}',

  -- Which formats were requested: ['estatico', 'story', 'ugc']
  formats           text[]      not null default '{}',

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger briefs_updated_at
  before update on public.briefs
  for each row execute procedure public.handle_updated_at();

-- Index for listing a user's briefs efficiently
create index briefs_user_id_created_at_idx
  on public.briefs (user_id, created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.briefs enable row level security;

-- No anonymous access
create policy "briefs: no anonymous access"
  on public.briefs
  for all
  to anon
  using (false);

-- Users can only read their own briefs
create policy "briefs: users read own"
  on public.briefs
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create briefs only for themselves
create policy "briefs: users insert own"
  on public.briefs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update only their own briefs
create policy "briefs: users update own"
  on public.briefs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete only their own briefs
create policy "briefs: users delete own"
  on public.briefs
  for delete
  to authenticated
  using (auth.uid() = user_id);
