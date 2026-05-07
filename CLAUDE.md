# Briefr — Claude Code Context

## O que é o Briefr
SaaS de geração de briefs de criativos com IA para gestores de tráfego e anunciantes brasileiros. O usuário preenche um formulário sobre seu produto/anúncio e recebe um brief completo por formato (estático, story, vídeo UGC) — em português, com contexto BR.

## Stack
- Frontend: Next.js 14 + Tailwind + shadcn/ui
- Backend: Next.js API Routes (sem servidor separado)
- Banco: Supabase (Auth + Postgres)
- IA: Claude Sonnet via API Anthropic
- PDF: @react-pdf/renderer
- Billing: Stripe
- Email: Resend + react-email
- Analytics: PostHog
- Deploy: Vercel

## Estrutura de pastas
- `src/app/` — rotas Next.js (App Router)
  - `(marketing)/` — landing page, legal, beta, auth
  - `(app)/` — área autenticada: dashboard, briefs, settings
  - `(public)/` — páginas públicas sem auth (briefs compartilhados)
  - `api/` — API Routes: briefs, stripe, waitlist, feedback, health
- `src/components/` — componentes reutilizáveis
  - `marketing/` — Header, Hero, Pricing, Faq, Footer, BetaForm, etc.
  - `app/` — AppShell, Sidebar, TopBar, BriefView, Dashboard, Onboarding, Feedback
  - `ui/` — design system: Button, Accordion, Container, SectionHeader, etc.
  - `pdf/` — BriefPDF (react-pdf, server-only)
  - `analytics/` — PostHogProvider
  - `branding/` — Logo
- `src/lib/` — utilitários, clientes Supabase, Stripe, PostHog, rate-limit
- `src/prompts/` — prompts do Claude para geração de briefs
- `src/emails/` — templates react-email
- `docs/` — documentação técnica (arquitetura, decisões, runbook)

## Convenções
- Idioma do código: inglês (variáveis, funções, comentários)
- Idioma da UI e prompts: português brasileiro
- Componentes: PascalCase
- Funções/variáveis: camelCase
- Arquivos: kebab-case
- **Toda action destrutiva (delete, archive, revoke) DEVE ter confirmação via Dialog antes de executar**
- Server Components para data fetching; Client Components apenas para interatividade
- Auth check sempre no início de Server Components e API Routes

## Comandos importantes
- `npm run dev` — inicia servidor local
- `npm run build` — build de produção
- `npm run lint` — checar erros

## Contexto de negócio
- Público-alvo: gestores de tráfego autônomos e anunciantes diretos BR
- Planos: Free (3 briefs/mês) | Pro R$97/mês | Agência R$197/mês
- Decisões de produto em: ../01 — Produto/Decisões de produto.md
- Roadmap em: ../01 — Produto/Roadmap.md

## O que NÃO fazer
- Não criar backend separado (Railway, FastAPI) — tudo em API Routes
- Não usar pgvector ou RAG — produto mais simples que o Lore
- Não commitar o arquivo .env.local
- Não enviar PII (email, nome, CPF) ao PostHog — apenas UUIDs e eventos
- Não expor conteúdo dos briefs no PostHog — apenas métricas de uso

## Security Rules
Todo código novo deve seguir estes princípios obrigatoriamente:

### Secrets e credenciais
- NUNCA hardcodar API keys, tokens ou senhas no código
- NUNCA usar prefixo `NEXT_PUBLIC_` em variáveis secretas (Anthropic, Supabase service_role, Stripe secret)
- NUNCA logar API keys, senhas, tokens JWT ou dados pessoais do usuário
- Variáveis sensíveis vivem APENAS no `.env.local` (nunca commitado)

### Autenticação e autorização
- TODO endpoint de API Route começa com verificação de `supabase.auth.getUser()`
- NUNCA confiar no `user_id` vindo do client — sempre derivar da sessão server-side
- NUNCA usar `createAdminClient()` em Client Components ou código que vai ao browser
- O plano do usuário (free/pro/agencia) é SEMPRE derivado do webhook do Stripe, nunca do client

### Banco de dados
- TODA tabela nova no Supabase DEVE ter RLS habilitado antes de ir para produção
- TODA tabela nova DEVE ter política explícita bloqueando acesso anônimo (`using (false)`)
- Verificar RLS ativo mensalmente via checklist em `docs/security-checklist.md`
- Tabelas novas neste projeto: waitlist, feedback (ambas precisam de RLS)

### Inputs e outputs
- TODO input de usuário passa por validação Zod no server antes de qualquer uso
- Dados do usuário inseridos em prompts de IA DEVEM usar delimitadores XML + escape de `< > &`
- Outputs da IA DEVEM ser validados com Zod antes de salvar no banco ou retornar ao client
- Mensagens de erro para o usuário são SEMPRE genéricas (nunca revelar detalhes internos)

### Webhooks e integrações externas
- Webhooks do Stripe DEVEM verificar assinatura com `constructEvent` — nunca pular
- Body de webhooks DEVE ser lido como RAW (`request.text()`) antes de qualquer parse
- Toda integração externa usa idempotência (salvar event.id antes de processar)

### Rate limiting e proteção
- Endpoints públicos (auth) usam rate limit por IP via Upstash
- Endpoints autenticados (geração) usam rate limit por `user_id`
- Respostas de auth usam mensagens genéricas para não revelar se email existe

## Design System

### Paleta — Terracota + Bege quente

| Ramp | 50 | 600 (base) | 900 |
|------|----|-----------|-----|
| terracota | #FFF7F2 | **#C2410C** | #5C1F08 |
| petroleo  | #F0FDFA | **#0F766E** | #063431 |
| stone     | #FFFCF5 | **#6B6258** | #1F1A14 |

### Tokens semânticos

| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | terracota.600 `hsl(17 89% 41%)` | CTAs, links ativos, marca |
| `accent` | petróleo.600 `hsl(174 77% 26%)` | Destaques secundários |
| `background` | stone.50 `hsl(36 100% 98%)` | Fundo da página |
| `surface` | stone.100 `hsl(38 60% 96%)` | Cards, sidebars, seções alt. |
| `foreground` | stone.900 `hsl(30 25% 10%)` | Texto principal |
| `muted-foreground` | stone.600 `hsl(25 11% 38%)` | Texto secundário |
| `border` | stone.300 `hsl(36 50% 84%)` | Bordas padrão |

### Regras obrigatórias
- **Sempre use classes Tailwind.** NUNCA hardcode cores hexadecimais nos componentes.
- Backgrounds de cards/painéis: `bg-card` ou `bg-surface`
- Backgrounds de seção alternada: `bg-surface`
- Gradiente de texto: `.text-gradient-brand` (terracota→petróleo)
- Glow do primário: `shadow-glow-sm`, `shadow-glow`, `shadow-glow-lg`
- Radius padrão: `--radius: 0.5rem` (8px)

## Brand Assets

### Logo
- Componente: `src/components/branding/Logo.tsx` (com texto "Briefr")
- Componente: `LogoMark` (só ícone, exportado do mesmo arquivo)
- Tamanho padrão: `size={36}` (default), `size={32}` (header/sidebar)
- Sempre use o componente, NUNCA SVG inline em outros lugares

### Arquivos estáticos
- `/logo.svg` — versão colorida principal (terracota)
- `/logo-mono.svg` — versão monocromática (preto, para PDFs/print)
- `/logo-dark.svg` — versão para dark mode (terracota mais clara)
- `/icon.svg` — favicon 32×32 (Next.js detecta automaticamente)
- `/apple-icon.svg` — ícone iOS 180×180

### Conceito da marca
B. Mark — inicial B customizada com terminação reta. O ponto branco no
canto inferior direito é um elemento de marca reutilizável que pode aparecer:
- Como separador entre seções
- Como bullet em listas de features
- Como indicador de status ativo
