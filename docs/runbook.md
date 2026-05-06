# Briefr — Runbook Operacional

Comandos e procedimentos para operações comuns de manutenção.

---

## Como restaurar um brief deletado

Briefs são deletados com `DELETE` físico. Se precisar restaurar:

1. Acesse o Supabase Dashboard → Table Editor → `briefs`
2. Use o painel de Point-in-Time Recovery (se habilitado no plano Pro+)
3. Ou consulte os logs do Sentry para o `briefId` e recrie manualmente com base no `form_data` armazenado

**Prevenção:** Considere implementar soft-delete (`deleted_at timestamp`) para briefs no futuro.

---

## Como dar upgrade manual a um usuário

Use quando um pagamento foi confirmado fora do Stripe (ex: PIX, transferência):

```sql
-- No Supabase SQL Editor
UPDATE subscriptions
SET
  plan = 'pro',           -- ou 'agencia'
  status = 'active',
  current_period_end = NOW() + INTERVAL '1 month'
WHERE user_id = '<UUID_DO_USUARIO>';
```

Ou via Supabase Dashboard → Table Editor → `subscriptions` → editar linha.

---

## Como pausar uma assinatura sem cobrar

1. No Stripe Dashboard → Customers → selecionar cliente → Subscriptions
2. Clique em "Pause collection" → escolha o período
3. O webhook `customer.subscription.updated` vai disparar e atualizar o status no banco automaticamente
4. Se precisar atualizar manualmente: `UPDATE subscriptions SET status = 'paused' WHERE ...`

---

## Como rotacionar API keys sem downtime

### Anthropic API Key
1. Crie nova key em console.anthropic.com
2. Adicione como `ANTHROPIC_API_KEY_NEW` nas env vars da Vercel
3. Atualize o código para ler `ANTHROPIC_API_KEY_NEW ?? ANTHROPIC_API_KEY` temporariamente
4. Faça deploy
5. Após confirmar que funciona, renomeie para `ANTHROPIC_API_KEY` na Vercel
6. Delete a key antiga no console da Anthropic

### Stripe Webhook Secret
1. No Stripe Dashboard → Webhooks → Edit endpoint → Roll secret
2. Salve o novo secret como `STRIPE_WEBHOOK_SECRET_NEW` na Vercel
3. Atualize o webhook handler para tentar ambos os secrets
4. Após confirmar, remova o antigo

### Supabase Service Role Key
1. No Supabase Dashboard → Settings → API → Rotate service_role key
2. Atualize `SUPABASE_SERVICE_ROLE_KEY` na Vercel imediatamente
3. Faça deploy — zero downtime pois a chave antiga ainda funciona por ~1h

---

## Comandos comuns de manutenção

### Ver usuários no plano free que chegaram ao limite
```sql
SELECT u.email, COUNT(b.id) as briefs_this_month
FROM auth.users u
JOIN briefs b ON b.user_id = u.id
WHERE b.created_at >= DATE_TRUNC('month', NOW())
GROUP BY u.email
HAVING COUNT(b.id) >= 3
ORDER BY briefs_this_month DESC;
```

### Ver receita do mês atual
```sql
SELECT plan, COUNT(*) as subscribers
FROM subscriptions
WHERE status = 'active'
GROUP BY plan;
```

### Limpar eventos Stripe antigos (>6 meses)
```sql
DELETE FROM stripe_events
WHERE created_at < NOW() - INTERVAL '6 months';
```

### Ver waitlist
```sql
SELECT profile, COUNT(*) as count
FROM waitlist
GROUP BY profile
ORDER BY count DESC;
```

### Forçar reprocessamento de webhook Stripe
No Stripe Dashboard → Webhooks → selecionar evento → "Resend"

---

## Checagem de saúde rápida

```bash
# Verifica se a API está respondendo
curl https://briefr.com.br/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"...","version":"..."}
```

---

## Escalação de incidentes

1. **Nível 1** (site fora): checar status da Vercel em vercel-status.com
2. **Nível 2** (erros de geração): verificar Sentry + checar status da Anthropic API
3. **Nível 3** (problema de billing): verificar Stripe Dashboard + logs do webhook
4. **Nível 4** (banco de dados): verificar Supabase status + connection pooling

Alertas automáticos chegam por email via Resend quando:
- Webhook do Stripe falha 3× consecutivas
- Custo de um request Claude > R$ 2,00
