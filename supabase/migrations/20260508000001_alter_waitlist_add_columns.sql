-- Migration: alter_waitlist_add_columns
-- The waitlist table was created manually with a minimal schema.
-- This adds the missing columns required by the API route.

alter table public.waitlist
  add column if not exists name    text,
  add column if not exists profile text,
  add column if not exists volume  text;

-- Ensure the email unique constraint exists
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.waitlist'::regclass
      and contype = 'u'
      and conname = 'waitlist_email_key'
  ) then
    alter table public.waitlist add constraint waitlist_email_key unique (email);
  end if;
end
$$;

-- Ensure RLS is enabled
alter table public.waitlist enable row level security;

-- Ensure block policies exist (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'waitlist' and policyname = 'waitlist: no anon access'
  ) then
    execute 'create policy "waitlist: no anon access" on public.waitlist for all to anon using (false)';
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'waitlist' and policyname = 'waitlist: no authenticated direct access'
  ) then
    execute 'create policy "waitlist: no authenticated direct access" on public.waitlist for all to authenticated using (false)';
  end if;
end
$$;
