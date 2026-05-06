# Briefr — Guia de Deploy na Vercel

## Pré-requisitos

Antes de fazer o deploy, garanta que você tem:
- [ ] Conta na Vercel (vercel.com)
- [ ] Projeto no Supabase configurado com as migrations rodadas
- [ ] Conta no Stripe com produtos criados (`npm run stripe:setup`)
- [ ] Conta no Upstash com um banco Redis criado
- [ ] Conta no Sentry com projeto Next.js criado
- [ ] Domínio customizado (ex: briefr.com.br) — opcional mas recomendado

---

## 1. Conectar o repositório

1. Acesse **vercel.com/new**
2. Clique em **"Import Git Repository"**
3. Conecte sua conta GitHub e selecione o repositório `Briefr`
4. Framework detectado automaticamente: **Next.js**
5. Root Directory: deixar em branco (projeto está na raiz)
6. Clique em **Deploy** (vai falhar por falta de env vars — isso é esperado)

---

## 2. Configurar variáveis de ambiente

Acesse: **Vercel → seu projeto → Settings → Environment Variables**

### Ambientes disponíveis
| Ambiente | Quando usar |
|---|---|
| **Production** | Branch `main` — usuários reais |
| **Preview** | Pull requests — testes antes de mergear |
| **Development** | `vercel dev` localmente |

### Variáveis obrigatórias

Configure cada variável nos ambientes corretos:

#### Supabase
| Variável | Production | Preview | Dev | Sensitive? |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto prod | URL do projeto staging | URL local | Não |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod anon key | Staging anon key | Local anon key | Não |
| `SUPABASE_SERVICE_ROLE_KEY` | **Prod service_role** | Staging service_role | Local service_role | **Sim** |

> Use projetos Supabase separados para prod e staging. Nunca use o banco de prod em PRs.

#### Anthropic
| Variável | Environments | Sensitive? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Production, Preview | **Sim** |

#### Stripe
| Variável | Production | Preview | Sensitive? |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` | **Sim** |
| `STRIPE_WEBHOOK_SECRET` | Secret do endpoint prod | Secret do endpoint test | **Sim** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` | Não |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Price ID prod | Price ID test | Não |
| `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` | Price ID prod | Price ID test | Não |

#### Upstash Redis
| Variável | Environments | Sensitive? |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Todos | Não |
| `UPSTASH_REDIS_REST_TOKEN` | Todos | **Sim** |

#### Sentry
| Variável | Environments | Sensitive? |
|---|---|---|
| `SENTRY_DSN` | Production, Preview | Não (DSN é público) |
| `NEXT_PUBLIC_SENTRY_DSN` | Production, Preview | Não |

#### App
| Variável | Production | Preview |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://briefr.com.br` | URL gerada pelo Vercel |
| `ADMIN_EMAILS` | `seu@email.com` | `seu@email.com` |
| `RESEND_API_KEY` | API key prod | API key prod |

### Como marcar como "Sensitive"
1. Ao adicionar a variável, marque o checkbox **"Sensitive"**
2. Após salvar, o valor não poderá mais ser visualizado na UI
3. Use isso para: `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `UPSTASH_REDIS_REST_TOKEN`

---

## 3. Configurar o webhook do Stripe em produção

Após o primeiro deploy bem-sucedido:

1. Acesse **dashboard.stripe.com → Developers → Webhooks**
2. Clique em **"Add endpoint"**
3. URL: `https://briefr.com.br/api/stripe/webhook`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Webhook signing secret** e adicione como `STRIPE_WEBHOOK_SECRET` na Vercel
6. Faça um redeploy para a variável entrar em vigor

---

## 4. Configurar domínio customizado com HTTPS

1. Acesse **Vercel → seu projeto → Settings → Domains**
2. Adicione `briefr.com.br`
3. Vercel vai mostrar os registros DNS a configurar:
   - Para domínio apex (`briefr.com.br`): registro `A` apontando para IP da Vercel
   - Para `www`: registro `CNAME` apontando para `cname.vercel-dns.com`
4. Configure no seu registrador de domínio (Registro.br, Cloudflare, etc.)
5. A Vercel provisiona o certificado SSL automaticamente via Let's Encrypt
6. HTTPS é forçado automaticamente — redirects de HTTP → HTTPS são aplicados pela Vercel

> O header `Strict-Transport-Security` (HSTS) já está configurado no `next.config.mjs`
> e será enviado após o primeiro request HTTPS.

---

## 5. Configurar Better Uptime (monitoramento)

1. Acesse **betteruptime.com** → New monitor
2. URL: `https://briefr.com.br/api/health`
3. Tipo: HTTP
4. Frequência: 3 minutos
5. Threshold de status code: `200`
6. Configure alertas por email ou Slack

---

## 6. Checklist pós-deploy

- [ ] Acessar `https://briefr.com.br/api/health` e confirmar `{ "status": "ok" }`
- [ ] Testar login e signup com email real
- [ ] Testar geração de 1 brief (plano free)
- [ ] Testar checkout com cartão de teste Stripe: `4242 4242 4242 4242`
- [ ] Confirmar que webhook recebeu o evento no dashboard do Stripe
- [ ] Confirmar que assinatura foi atualizada no Supabase
- [ ] Acessar `https://briefr.com.br/admin` com email admin e confirmar métricas
- [ ] Verificar se erros aparecem no Sentry (fazer um erro intencional e ver se captura)
- [ ] Confirmar que `X-Powered-By` não aparece nos response headers

---

## Variáveis que NÃO devem ter prefixo NEXT_PUBLIC_

| Variável | Motivo |
|---|---|
| `ANTHROPIC_API_KEY` | Nunca exposta ao browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypassa RLS — crítico |
| `STRIPE_SECRET_KEY` | Permite cobranças — crítico |
| `STRIPE_WEBHOOK_SECRET` | Valida origem dos eventos |
| `UPSTASH_REDIS_REST_TOKEN` | Acesso ao Redis |
| `RESEND_API_KEY` | Envia emails |
| `ADMIN_EMAILS` | Lista de acesso privilegiado |
