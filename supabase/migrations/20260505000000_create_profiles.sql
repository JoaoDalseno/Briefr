-- Migration: create_profiles
-- Stores public profile data linked 1:1 to auth.users.

create table if not exists public.profiles (
  id            uuid        primary key references auth.users (id) on delete cascade,
  full_name     text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Keep updated_at in sync automatically
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- No anonymous access
create policy "profiles: no anonymous access"
  on public.profiles
  for all
  to anon
  using (false);

-- Users can only read their own profile
create policy "profiles: users read own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can only update their own profile
create policy "profiles: users update own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert is handled by the trigger — deny direct insert from client
create policy "profiles: deny direct insert"
  on public.profiles
  for insert
  to authenticated
  with check (false);
