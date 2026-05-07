# Briefr — Checklist de Lançamento v1.0

Marque cada item antes de ir ao ar. Nenhum item é opcional.

---

## Infraestrutura

- [ ] Domínio `briefr.com.br` apontando para a Vercel com HTTPS ativo
- [ ] SSL/TLS configurado e renovação automática ativa
- [ ] Todas as variáveis de ambiente configuradas em **production** na Vercel:
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `STRIPE_SECRET_KEY` (live key, não test)
  - [ ] `STRIPE_PUBLISHABLE_KEY` (live key)
  - [ ] `STRIPE_WEBHOOK_SECRET` (live webhook)
  - [ ] `UPSTASH_REDIS_REST_URL`
  - [ ] `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `RESEND_API_KEY`
  - [ ] `ADMIN_ALERT_EMAIL`
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - [ ] `SENTRY_DSN`

## Banco de dados (Supabase)

- [ ] RLS habilitado em TODAS as tabelas: `briefs`, `subscriptions`, `stripe_events`, `usage_log`, `waitlist`, `feedback`
- [ ] Coluna `public_share_token` adicionada à tabela `briefs` (nullable text, unique index)
- [ ] Tabela `waitlist` criada: `id, name, email (unique), profile, volume, created_at`
- [ ] Tabela `feedback` criada: `id, user_id, type, text, created_at`
- [ ] Backup automático (Point-in-Time Recovery) ativado no plano Pro do Supabase
- [ ] Índices criados em: `briefs.user_id`, `briefs.created_at`, `briefs.public_share_token`

## Billing (Stripe)

- [ ] Produtos e preços criados em modo **live** (não test)
- [ ] Webhook endpoint configurado: `https://briefr.com.br/api/stripe/webhook`
- [ ] Eventos do webhook: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Teste end-to-end do fluxo de checkout em produção (use cartão de teste do Stripe em modo live com valor real)
- [ ] Portal do cliente configurado (Stripe Billing Portal)

## Email transacional (Resend)

- [ ] Domínio `briefr.com.br` verificado no Resend (DKIM/SPF configurados)
- [ ] Email de boas-vindas testado após signup
- [ ] Email de confirmação de assinatura testado
- [ ] Email de alerta de webhook testado
- [ ] Email de recuperação de senha testado

## Qualidade e performance

- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` passa sem warnings
- [ ] Lighthouse homepage: Performance > 85, Acessibilidade > 90, SEO > 95
- [ ] Teste em iPhone SE (375px) — sem overflow, touch targets OK
- [ ] Teste em iPad (768px) — layout responsivo OK
- [ ] Teste em desktop 1440px — sidebar visível, 2 colunas OK

## Segurança

- [ ] Headers de segurança verificados (CSP, HSTS, X-Frame-Options)
- [ ] `npm audit` sem vulnerabilidades críticas ou altas
- [ ] Arquivo `.env.local` não commitado (verificar `.gitignore`)
- [ ] Sentry recebendo erros em produção (enviar erro de teste)

## Analytics e monitoramento

- [ ] PostHog recebendo evento `signup` após teste de cadastro
- [ ] Evento `brief_generated` chegando no PostHog
- [ ] Uptime monitor configurado (Better Uptime ou UptimeRobot) para `/api/health`
- [ ] Alertas de erro do Sentry configurados (notify on first occurrence)

## Legal e compliance

- [ ] Páginas publicadas: `/termos`, `/privacidade`, `/lgpd`
- [ ] Links para páginas legais no footer
- [ ] Links para termos no formulário de signup
- [ ] DPO/email de privacidade respondendo (`privacidade@briefr.com.br`)

## Conteúdo e SEO

- [ ] Meta tags e OG image configurados na homepage
- [ ] `sitemap.xml` acessível em `/sitemap.xml`
- [ ] `robots.txt` correto em `/robots.txt`
- [ ] Google Search Console: domínio verificado, sitemap enviado
- [ ] Favicon e ícones de app configurados

## Go-to-market

- [ ] Post de lançamento redigido para Instagram, LinkedIn e X
- [ ] ProductHunt "upcoming" criado (agendar para dia do lançamento)
- [ ] DM templates prontos para enviar aos primeiros 20 gestores de tráfego
- [ ] Grupo/canal de early adopters criado (WhatsApp ou Discord)
- [ ] Códigos de convite beta criados no banco: `BETA10` (10 usos), `FRIENDS` (50 usos + Pro grátis)

---

## Comando final de verificação

```bash
# Rodar antes de apertar "publicar"
npm run build && npm run lint
```

**Resultado esperado:** build verde, zero erros de lint.

---

*Checklist criado em maio de 2026 para o lançamento do Briefr v1.0*
