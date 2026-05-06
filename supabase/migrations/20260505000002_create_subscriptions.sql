-- Migration: create_subscriptions
-- Tracks Stripe billing plan per user.
-- Written by the Stripe webhook handler (server-side, service_role only).

create type public.plan_type as enum ('free', 'pro', 'agencia');
create type public.subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete'
);

create table if not exists public.subscriptions (
  -- 1:1 with profiles; cascades on user deletion
  user_id                uuid                        primary key
                           references public.profiles (id) on delete cascade,

  stripe_customer_id     text                        unique,
  stripe_subscription_id text                        unique,

  plan                   public.plan_type            not null default 'free',
  status                 public.subscription_status  not null default 'active',

  -- When the current billing period ends (null for free plan)
  current_period_end     timestamptz,

  -- How many briefs the user created this calendar month
  briefs_used_this_month integer                     not null default 0,

  -- Date the counter was last reset (used to detect month rollover)
  briefs_reset_at        timestamptz                 not null default date_trunc('month', now()),

  created_at             timestamptz                 not null default now(),
  updated_at             timestamptz                 not null default now()
);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- Auto-create a free subscription row when a profile is created
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;

-- No anonymous access
create policy "subscriptions: no anonymous access"
  on public.subscriptions
  for all
  to anon
  using (false);

-- Users can read their own subscription
create policy "subscriptions: users read own"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users CANNOT write to subscriptions directly.
-- All writes are done by the Stripe webhook via service_role (bypasses RLS).
create policy "subscriptions: deny client writes"
  on public.subscriptions
  for insert
  to authenticated
  with check (false);

create policy "subscriptions: deny client updates"
  on public.subscriptions
  for update
  to authenticated
  using (false);

create policy "subscriptions: deny client deletes"
  on public.subscriptions
  for delete
  to authenticated
  using (false);
