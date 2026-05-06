-- Migration: create_stripe_events
-- Garante idempotência no webhook do Stripe: cada event.id é processado
-- uma única vez. Se o Stripe reenviar o mesmo evento, ignoramos.

create table if not exists public.stripe_events (
  -- ID nativo do Stripe: evt_xxxxxxxxxxxxxxxx
  id            text        primary key,
  type          text        not null,
  processed_at  timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.stripe_events enable row level security;

-- Acesso exclusivo via service_role (webhook handler com admin client).
-- Nenhum usuário autenticado ou anônimo pode ler ou escrever esta tabela.
create policy "stripe_events: no direct access"
  on public.stripe_events
  for all
  to authenticated, anon
  using (false);
