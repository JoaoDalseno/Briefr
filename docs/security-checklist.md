# Briefr — Checklist de Segurança Mensal

Execute este checklist no primeiro dia útil de cada mês.
Registre a data de execução e o responsável ao final.

---

## 1. Rotação de Credenciais

### Anthropic API Key
- [ ] Acesse console.anthropic.com → API Keys
- [ ] Crie uma nova key com o mesmo nome + sufixo do mês (ex: `briefr-prod-2026-06`)
- [ ] Atualize `ANTHROPIC_API_KEY` na Vercel (Settings → Environment Variables)
- [ ] Teste a geração de um brief em produção
- [ ] Revogue a key antiga após confirmação de funcionamento

### Supabase Service Role Key
- [ ] Acesse app.supabase.com → Project Settings → API
- [ ] Gere uma nova `service_role` key (botão "Roll")
- [ ] Atualize `SUPABASE_SERVICE_ROLE_KEY` na Vercel
- [ ] Teste um fluxo de webhook (ex: simule um evento Stripe)
- [ ] Confirme que os logs de erro não aumentaram

### Stripe Secret Key
- [ ] Acesse dashboard.stripe.com → Developers → API Keys
- [ ] Clique em "Roll key" na secret key
- [ ] Atualize `STRIPE_SECRET_KEY` na Vercel
- [ ] Atualize `STRIPE_SECRET_KEY` no `.env.local` local
- [ ] Teste criação de checkout session

### Stripe Webhook Secret
- [ ] Acesse dashboard.stripe.com → Developers → Webhooks
- [ ] Selecione o endpoint de produção → "Roll secret"
- [ ] Atualize `STRIPE_WEBHOOK_SECRET` na Vercel
- [ ] Envie um evento de teste pelo dashboard do Stripe
- [ ] Confirme que o webhook retornou `200` nos logs

### Upstash Redis (se usar token de longa duração)
- [ ] Acesse console.upstash.com → seu banco → Details
- [ ] Regenere o REST token se disponível
- [ ] Atualize `UPSTASH_REDIS_REST_TOKEN` na Vercel

---

## 2. Revisão de Logs de Erro

### Vercel Logs
- [ ] Acesse Vercel → seu projeto → Logs (filtrar por `error`)
- [ ] Verifique erros em `/api/briefs/generate`:
  - Muitos erros 502 = problema com Claude API ou parsing de output
  - Erros 401 recorrentes = tentativas de acesso sem auth
- [ ] Verifique erros em `/api/stripe/webhook`:
  - Erros 400 = tentativas de forjar webhooks ou secret incorreto
  - Erros 500 = falha de processamento (verificar handler específico)
- [ ] Verifique erros em `/api/stripe/checkout`:
  - Erros 409 repetidos para o mesmo usuário = possível confusão de estado

### Supabase Logs
- [ ] Acesse app.supabase.com → Logs → API Logs
- [ ] Filtre por `status >= 400`
- [ ] Identifique padrões suspeitos (muitas requisições com erro de auth)
- [ ] Verifique se há tentativas de acesso direto às tabelas `usage_log` ou `stripe_events`

### Usage Log (custo)
- [ ] Execute no Supabase SQL Editor:
  ```sql
  SELECT
    DATE_TRUNC('day', created_at) AS dia,
    COUNT(*) AS requests,
    SUM(cost_brl) AS custo_brl,
    AVG(duration_ms) AS latencia_media_ms
  FROM usage_log
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 1
  ORDER BY 1 DESC;
  ```
- [ ] Verifique se algum dia teve custo anormalmente alto
- [ ] Identifique user_ids com uso desproporcional

---

## 3. Verificação de Usuários Admin

### Supabase Auth
- [ ] Acesse app.supabase.com → Authentication → Users
- [ ] Verifique se há usuários desconhecidos com muitos briefs gerados
- [ ] Confirme que não há contas com email de domínios suspeitos
- [ ] Verifique usuários criados nos últimos 7 dias (sinal de bot se muitos)

### Supabase Database — verificação de RLS
- [ ] Execute no SQL Editor (confirma RLS ativo em todas as tabelas):
  ```sql
  SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
  ```
- [ ] **Resultado esperado: `rls_enabled = true` em TODAS as linhas.**
  Qualquer `false` é um incidente de segurança — corrija imediatamente.

### Verificação de políticas RLS ativas
- [ ] Execute:
  ```sql
  SELECT
    tablename,
    policyname,
    cmd,
    roles
  FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, cmd;
  ```
- [ ] Compare com a lista esperada de políticas (ver `supabase/migrations/`)
- [ ] Investigue qualquer política não documentada nas migrations

---

## 4. Revisão de Dependências

- [ ] Execute localmente: `npm audit --audit-level=moderate`
- [ ] Verifique os PRs abertos pelo Dependabot no GitHub
- [ ] Mergue PRs de patch seguro (sem breaking changes)
- [ ] Avalie PRs de minor manualmente antes de mergear
- [ ] Documente qualquer vuln ignorada intencionalmente com justificativa

---

## 5. Revisão de GitHub Actions

- [ ] Acesse o repo → Actions → Security workflow
- [ ] Confirme que todos os jobs passaram no último run
- [ ] Verifique se o Gitleaks não reportou nenhum finding
- [ ] Confirme que o npm audit não encontrou high+ vulnerabilities

---

## 6. Verificação do Stripe

- [ ] Acesse dashboard.stripe.com → Developers → Webhooks → seu endpoint
- [ ] Confirme que o webhook endpoint está ativo (não desabilitado)
- [ ] Verifique o log de entrega dos últimos 30 dias
- [ ] Confirme taxa de sucesso (200) > 99%
- [ ] Identifique eventos que falharam e o motivo

---

## 7. Revisão de Rate Limits (Upstash)

- [ ] Acesse console.upstash.com → seu banco → Data Browser
- [ ] Verifique as chaves `rl:login:*`, `rl:signup:*`, `rl:generate:*`
- [ ] Identifique IPs com rate limit atingido recorrentemente
- [ ] Avalie se os limites atuais estão adequados (nem muito restritivos nem permissivos)

---

## Registro de Execução

| Data | Responsável | Observações |
|---|---|---|
| | | |

---

> Este checklist deve ser tratado como documento vivo.
> Adicione novos itens conforme a arquitetura do sistema evolui.
