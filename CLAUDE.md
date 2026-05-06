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
- Deploy: Vercel

## Estrutura de pastas
- `src/app/` — rotas Next.js (App Router)
- `src/components/` — componentes reutilizáveis
- `src/lib/` — utilitários, clientes Supabase, Stripe
- `src/prompts/` — prompts do Claude para geração de briefs
- `docs/` — documentação técnica (arquitetura, decisões)

## Convenções
- Idioma do código: inglês (variáveis, funções, comentários)
- Idioma da UI e prompts: português brasileiro
- Componentes: PascalCase
- Funções/variáveis: camelCase
- Arquivos: kebab-case

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
