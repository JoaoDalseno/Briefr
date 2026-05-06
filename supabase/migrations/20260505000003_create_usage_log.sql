-- Migration: create_usage_log
-- Registra o uso da API do Claude por request para monitoramento de custo.
-- Escrita exclusiva via service_role (API routes). Sem acesso de leitura para usuários.

create table if not exists public.usage_log (
  id                uuid        primary key default gen_random_uuid(),

  -- Pode ser null se o usuário for deletado (on delete set null)
  user_id           uuid        references public.profiles (id) on delete set null,

  model             text        not null,
  input_tokens      integer     not null check (input_tokens >= 0),
  output_tokens     integer     not null check (output_tokens >= 0),

  -- Custo calculado no momento do request (preço pode mudar; registre o atual)
  cost_usd          numeric(12, 8) not null check (cost_usd >= 0),
  cost_brl          numeric(12, 6) not null check (cost_brl >= 0),

  -- Latência total do request à API Anthropic em milissegundos
  duration_ms       integer     not null check (duration_ms >= 0),

  success           boolean     not null default true,

  -- Código de erro legível para diagnóstico (ex: 'rate_limited', 'invalid_output')
  error_code        text,

  created_at        timestamptz not null default now()
);

-- Index para análise de custo por usuário e período
create index usage_log_user_id_created_at_idx
  on public.usage_log (user_id, created_at desc);

-- Index para análise de custo total por período
create index usage_log_created_at_idx
  on public.usage_log (created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.usage_log enable row level security;

-- Nenhum acesso direto — leitura e escrita apenas via service_role (API routes)
create policy "usage_log: no direct access"
  on public.usage_log
  for all
  to authenticated, anon
  using (false);
