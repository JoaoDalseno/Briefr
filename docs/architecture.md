# Briefr — Arquitetura

## Visão geral

```
Usuario → Formulário (Next.js) → API Route → Claude Sonnet → Brief gerado
                                           → Supabase (salva brief)
                                           → Stripe (verifica plano/limite)
```

## Fluxo principal

1. Usuário preenche formulário com dados do produto/anúncio
2. Frontend envia para `/api/briefs/generate`
3. API Route verifica plano do usuário no Supabase
4. Se permitido, monta prompt e chama Claude Sonnet via Anthropic SDK
5. Brief retornado é salvo no Supabase e exibido ao usuário
6. Usuário pode baixar como PDF via `@react-pdf/renderer`

## Limites por plano

| Plano    | Preço      | Briefs/mês |
|----------|------------|------------|
| Free     | R$ 0       | 3          |
| Pro      | R$ 97/mês  | Ilimitado  |
| Agência  | R$ 197/mês | Ilimitado + multiusuário |

## Formatos de brief suportados

- Estático (imagem/carrossel)
- Story (vertical 9:16)
- Vídeo UGC
