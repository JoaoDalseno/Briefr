/**
 * Script de setup dos produtos e preços do Stripe.
 * Idempotente: cria apenas o que ainda não existe.
 *
 * Uso:
 *   npm run stripe:setup
 *
 * Após rodar, copie os price IDs exibidos para o .env.local:
 *   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxx
 *   NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_xxx
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Carrega .env.local antes de qualquer import que leia process.env
config({ path: resolve(process.cwd(), '.env.local') })

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌  STRIPE_SECRET_KEY não encontrada no .env.local')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

// ─── Definição dos planos ─────────────────────────────────────────────────────

const PLANS = [
  {
    key:         'pro',
    name:        'Briefr Pro',
    description: 'Geração ilimitada de briefs criativos com IA',
    amountBrl:   9700, // R$97,00 em centavos
    metadata:    { briefr_plan: 'pro' },
  },
  {
    key:         'agencia',
    name:        'Briefr Agência',
    description: 'Tudo do Pro + suporte multi-usuário para agências',
    amountBrl:   19700, // R$197,00 em centavos
    metadata:    { briefr_plan: 'agencia' },
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function findOrCreateProduct(plan: (typeof PLANS)[number]): Promise<Stripe.Product> {
  // Busca produto existente pelo metadata para ser idempotente
  const existing = await stripe.products.search({
    query: `metadata['briefr_plan']:'${plan.key}'`,
  })

  if (existing.data.length > 0) {
    console.log(`  ↩  Produto já existe: ${existing.data[0].name} (${existing.data[0].id})`)
    return existing.data[0]
  }

  const product = await stripe.products.create({
    name:        plan.name,
    description: plan.description,
    metadata:    plan.metadata,
  })

  console.log(`  ✅  Produto criado: ${product.name} (${product.id})`)
  return product
}

async function findOrCreatePrice(
  product: Stripe.Product,
  plan: (typeof PLANS)[number],
): Promise<Stripe.Price> {
  // Busca preço ativo existente para este produto
  const existing = await stripe.prices.list({
    product: product.id,
    active:  true,
  })

  if (existing.data.length > 0) {
    const p = existing.data[0]
    console.log(
      `  ↩  Preço já existe: R$${(p.unit_amount! / 100).toFixed(2)}/mês (${p.id})`,
    )
    return p
  }

  const price = await stripe.prices.create({
    product:     product.id,
    unit_amount: plan.amountBrl,
    currency:    'brl',
    recurring:   { interval: 'month' },
    metadata:    plan.metadata,
  })

  console.log(
    `  ✅  Preço criado: R$${(price.unit_amount! / 100).toFixed(2)}/mês (${price.id})`,
  )
  return price
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔧  Briefr — Setup de produtos no Stripe\n')

  const results: Record<string, string> = {}

  for (const plan of PLANS) {
    console.log(`\n📦  Plano: ${plan.name}`)
    const product = await findOrCreateProduct(plan)
    const price   = await findOrCreatePrice(product, plan)
    results[plan.key] = price.id
  }

  console.log('\n─────────────────────────────────────────────────────')
  console.log('✅  Setup concluído. Adicione ao seu .env.local:\n')
  console.log(`NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=${results.pro}`)
  console.log(`NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=${results.agencia}`)
  console.log('─────────────────────────────────────────────────────\n')
}

main().catch((err) => {
  console.error('❌  Erro no setup:', err)
  process.exit(1)
})
