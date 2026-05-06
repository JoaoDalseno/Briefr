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
