# Briefr — Plano de Resposta a Incidentes

Guia de ação imediata para os incidentes de segurança mais prováveis.
**Tempo de resposta esperado: ≤ 30 minutos para incidentes críticos.**

---

## 🔴 Incidente 1: API Key vazou no código ou em log

**Detecção:** Alerta do Gitleaks, GitHub Secret Scanning, ou descoberta manual.

### Ações imediatas (em ordem)

**1. Revogar a key comprometida AGORA** (antes de qualquer outra coisa):

| Key | Onde revogar |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys → Revoke |
| `SUPABASE_SERVICE_ROLE_KEY` | app.supabase.com → Settings → API → Roll Key |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys → Roll Key |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Developers → Webhooks → Roll Secret |
| `UPSTASH_REDIS_REST_TOKEN` | console.upstash.com → Database → Details → Rotate Token |

**2. Criar keys novas e atualizar na Vercel:**
```
Vercel → projeto → Settings → Environment Variables → editar cada variável
```
Fazer redeploy após atualizar: `vercel --prod` ou trigger manual na UI.

**3. Investigar o vazamento:**
```bash
# Ver todos os commits que tocaram o arquivo suspeito
git log --all --follow -p <arquivo>

# Verificar se o secret aparece no histórico
git log --all -S 'sk-ant-' --oneline
```

**4. Remover do histórico git (se necessário):**
```bash
# ATENÇÃO: reescreve o histórico — coordinate com o time antes
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch <arquivo-com-secret>' \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

**5. Notificar:**
- Se a key do Supabase ou Stripe foi exposta, verificar logs de uso nas últimas 24h
- Se houver acesso não autorizado, contatar suporte da plataforma respectiva

---

## 🔴 Incidente 2: Suspeita de conta de usuário comprometida

**Detecção:** Alerta de acesso ao /admin, uso anormal de API, reclamação do usuário.

### Revogar sessões do usuário

```sql
-- No Supabase SQL Editor (substitua <user_id> pelo UUID real):
-- Invalida TODOS os tokens de sessão do usuário imediatamente
SELECT auth.admin_delete_user('<user_id>');

-- OU apenas encerrar sessões sem deletar a conta:
DELETE FROM auth.sessions WHERE user_id = '<user_id>';
```

Via Supabase Dashboard:
1. Authentication → Users
2. Busque o usuário
3. Clique em "..." → "Delete user" (ou apenas invalidar sessões se disponível)

### Investigar atividade suspeita

```sql
-- Briefs gerados pelo usuário nas últimas 24h
SELECT id, formats, created_at
FROM briefs
WHERE user_id = '<user_id>'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Custo gerado pelo usuário
SELECT SUM(cost_brl), COUNT(*), MAX(created_at)
FROM usage_log
WHERE user_id = '<user_id>'
  AND created_at > NOW() - INTERVAL '24 hours';
```

---

## 🔴 Incidente 3: Ataque de força bruta / rate limit explodindo

**Detecção:** Alerta do Resend, logs da Vercel com muitos 429, Upstash com picos.

### Bloquear IP no Vercel Firewall

1. Acesse **Vercel → seu projeto → Firewall**
2. Clique em **"Add Rule"**
3. Condition: `IP Address` equals `<IP suspeito>`
4. Action: `Block`
5. A regra entra em vigor em segundos

Para bloquear um range de IPs (ataque distribuído):
- Use `IP in CIDR` em vez de IP exato
- Ex: `192.168.1.0/24`

### Aumentar restrição no Upstash temporariamente

Se necessário, acesse o Redis e aumente o limite:
```bash
# Verificar chaves de rate limit de um IP específico
# No Upstash Data Browser, busque: rl:login:<IP>
```

Ou via código, edite `src/lib/rate-limit.ts` temporariamente para limites mais restritivos e faça deploy.

---

## 🟡 Incidente 4: Webhook do Stripe com falhas consecutivas

**Detecção:** Alerta do Resend (3+ falhas consecutivas).

### Diagnóstico rápido

1. Vercel → Functions → `/api/stripe/webhook` → ver logs de erro
2. Stripe Dashboard → Developers → Webhooks → seu endpoint → ver tentativas com falha

**Causas comuns:**

| Sintoma nos logs | Causa provável | Solução |
|---|---|---|
| `Webhook signature verification failed` | STRIPE_WEBHOOK_SECRET incorreto | Atualizar na Vercel + redeploy |
| `Failed to register event` | Supabase indisponível | Verificar status do Supabase |
| `Event processing failed` | Bug no handler | Ver stack trace no Sentry |
| Timeout (sem log) | Handler demora >30s | Otimizar query ou aumentar timeout |

### Reprocessar eventos perdidos

No dashboard do Stripe, você pode reenviar eventos manualmente:
1. Developers → Webhooks → seu endpoint
2. Clique no evento com falha
3. "Resend" → o webhook vai tentar processar novamente

---

## 🟡 Incidente 5: Tabela sem RLS descoberta

**Detecção:** Checklist mensal ou auditoria manual.

### Ações imediatas

```sql
-- 1. Verificar quais tabelas estão sem RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = false;

-- 2. Habilitar RLS na tabela sem proteção
ALTER TABLE public.<nome_da_tabela> ENABLE ROW LEVEL SECURITY;

-- 3. Bloquear acesso anônimo imediatamente
CREATE POLICY "<tabela>: block anonymous"
  ON public.<nome_da_tabela>
  FOR ALL TO anon
  USING (false);

-- 4. Adicionar política para usuários autenticados (ajuste conforme a tabela)
CREATE POLICY "<tabela>: users own data"
  ON public.<nome_da_tabela>
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);
```

Em seguida, criar uma migration em `supabase/migrations/` documentando a correção.

---

## 🟢 Procedimentos preventivos mensais

Ver `docs/security-checklist.md` para o checklist completo.

Pontos críticos:
1. Rotacionar todas as API keys
2. Verificar RLS em todas as tabelas
3. Revisar logs de erro no Sentry
4. Verificar usuários com acesso ao `/admin`
5. Conferir alertas do Dependabot (PRs abertas)

---

## Contatos de emergência

| Serviço | Suporte |
|---|---|
| Vercel | vercel.com/support |
| Supabase | supabase.com/support |
| Stripe | support.stripe.com |
| Anthropic | support.anthropic.com |

**Email de segurança interno:** security@briefr.com.br
