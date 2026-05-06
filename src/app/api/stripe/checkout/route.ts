import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { PLAN_PRICE_IDS, type PlanType } from '@/lib/stripe/plans'
import { z } from 'zod'

const checkoutSchema = z.object({
  plan: z.enum(['pro', 'agencia']),
})

const VALID_PRICE_IDS = new Set(Object.values(PLAN_PRICE_IDS))

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user || !user.email) {
    return errorResponse('Não autorizado.', 401)
  }

  // ── 2. Validação do body ──────────────────────────────────────────────────
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return errorResponse('Body inválido.', 400)
  }

  const parsed = checkoutSchema.safeParse(raw)
  if (!parsed.success) {
    return errorResponse('Plano inválido. Escolha "pro" ou "agencia".', 400)
  }

  const { plan } = parsed.data
  const priceId = PLAN_PRICE_IDS[plan as Exclude<PlanType, 'free'>]

  // Dupla verificação: garante que o price ID é um dos nossos
  if (!VALID_PRICE_IDS.has(priceId)) {
    return errorResponse('Price ID inválido.', 400)
  }

  // ── 3. Busca ou cria o Stripe Customer ───────────────────────────────────
  // Armazenamos o customer_id imediatamente (não esperamos o webhook)
  // para ter o ID disponível no portal antes de uma assinatura ativa.
  const admin = createAdminClient()

  const { data: subscription } = await admin
    .from('subscriptions')
    .select('plan, stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  // Impede checkout duplicado: usuário já tem o plano ativo
  if (subscription?.plan === plan && subscription?.stripe_customer_id) {
    return errorResponse(
      `Você já está no plano ${plan}. Gerencie sua assinatura pelo portal.`,
      409,
    )
  }

  let stripeCustomerId = subscription?.stripe_customer_id ?? null

  if (!stripeCustomerId) {
    // Cria um novo Customer com metadata para rastreabilidade
    const customer = await stripe.customers.create({
      email:    user.email,
      metadata: { user_id: user.id },
    })
    stripeCustomerId = customer.id

    // Persiste imediatamente — não depende do webhook para ter o customer_id
    await admin
      .from('subscriptions')
      .upsert({ user_id: user.id, stripe_customer_id: stripeCustomerId })
  }

  // ── 4. Cria a Checkout Session ────────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer:             stripeCustomerId,
    mode:                 'subscription',
    line_items:           [{ price: priceId, quantity: 1 }],
    // metadata na session E na subscription — útil nos dois eventos do webhook
    metadata:             { user_id: user.id },
    subscription_data:    { metadata: { user_id: user.id } },
    success_url:          `${appUrl}/dashboard?checkout=success`,
    cancel_url:           `${appUrl}/pricing?checkout=canceled`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  })

  if (!session.url) {
    console.error('[checkout] Stripe retornou session sem URL:', { userId: user.id })
    return errorResponse('Erro ao criar sessão de pagamento.', 502)
  }

  console.log('[checkout] session criada:', { userId: user.id, plan, sessionId: session.id })

  return NextResponse.json({ url: session.url })
}
