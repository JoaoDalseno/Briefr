// CRÍTICO: esta rota DEVE usar o runtime Node.js.
// O Edge runtime não tem acesso à crypto do Node.js, necessária para
// stripe.webhooks.constructEvent() verificar a assinatura HMAC-SHA256.
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import { getPlanFromPriceId, mapStripeStatus } from '@/lib/stripe/plans'
import { Redis } from '@upstash/redis'
import { sendWebhookFailureAlert } from '@/lib/resend/alerts'

let _redis: Redis | undefined
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _redis
}

const WEBHOOK_FAIL_KEY      = 'stripe:webhook:consecutive_fails'
const WEBHOOK_FAIL_THRESHOLD = 3

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 1. Lê o body RAW antes de qualquer parse ──────────────────────────────
  // CRÍTICO: o body deve ser a string/Buffer exata que o Stripe enviou.
  // Qualquer parsing (JSON.parse, etc.) antes desta etapa invalida a assinatura.
  const rawBody = await request.text()

  // ── 2. Valida a assinatura ────────────────────────────────────────────────
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    console.warn('[webhook] Requisição sem header stripe-signature')
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET não configurada')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    // NUNCA pule esta verificação — ela garante que o request vem do Stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (err) {
    // Assinatura inválida: request forjado ou body alterado
    console.warn('[webhook] Falha na verificação de assinatura:', {
      error: err instanceof Error ? err.message : 'unknown',
    })
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // ── 3. Idempotência: ignora eventos já processados ────────────────────────
  const admin = createAdminClient()

  const { data: existingEvent } = await admin
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .single()

  if (existingEvent) {
    // Stripe reenvia eventos em caso de timeout — acknowledge sem reprocessar
    console.log('[webhook] Evento duplicado ignorado:', { eventId: event.id, type: event.type })
    return NextResponse.json({ received: true, status: 'duplicate' })
  }

  // Registra o evento ANTES de processar (previne race condition em retries paralelos)
  const { error: insertError } = await admin
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })

  if (insertError) {
    console.error('[webhook] Falha ao registrar evento para idempotência:', {
      eventId: event.id,
      error: insertError.message,
    })
    // Retorna 500 para o Stripe retentar mais tarde
    return NextResponse.json({ error: 'Failed to register event' }, { status: 500 })
  }

  // ── 4. Processa o evento ──────────────────────────────────────────────────
  console.log('[webhook] Processando evento:', { eventId: event.id, type: event.type })

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        // Eventos não tratados são ignorados silenciosamente (mas registrados acima)
        break
    }
  } catch (err) {
    console.error('[webhook] Erro ao processar evento:', {
      eventId: event.id,
      type:    event.type,
      error:   err instanceof Error ? err.message : 'unknown',
    })
    // Retorna 500 → Stripe vai retentar o evento
    // Incrementa contador de falhas consecutivas e alerta se necessário
    await trackWebhookFailure()
    return NextResponse.json({ error: 'Event processing failed' }, { status: 500 })
  }

  // Sucesso — reset do contador de falhas consecutivas
  await getRedis().set(WEBHOOK_FAIL_KEY, 0).catch(() => {})

  return NextResponse.json({ received: true })
}

// ─── Rastreamento de falhas consecutivas ──────────────────────────────────────

async function trackWebhookFailure(): Promise<void> {
  try {
    const count = await getRedis().incr(WEBHOOK_FAIL_KEY)
    // Expira em 1 hora para não acumular falhas antigas
    await getRedis().expire(WEBHOOK_FAIL_KEY, 3600)

    if (count >= WEBHOOK_FAIL_THRESHOLD) {
      // Alerta assíncrono — não bloqueia a resposta ao Stripe
      sendWebhookFailureAlert(count).catch(console.error)
    }
  } catch {
    // Falha no tracking não deve afetar o webhook em si
  }
}

// ─── Handlers de evento ───────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  if (!userId) {
    console.error('[webhook] checkout.session.completed sem user_id no metadata:', session.id)
    return
  }

  if (!session.subscription || !session.customer) {
    // Checkout sem assinatura (ex: pagamento único) — ignorar
    return
  }

  // Busca os detalhes completos da subscription para obter o price_id
  const admin = createAdminClient()
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string,
    { expand: ['items.data.price'] },
  )

  const priceId  = subscription.items.data[0]?.price.id ?? null
  const plan     = getPlanFromPriceId(priceId)
  const status   = mapStripeStatus(subscription.status)
  // current_period_end foi movido em API versions mais novas — cast necessário
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const periodEnd = new Date(((subscription as any).current_period_end as number) * 1000).toISOString()

  await admin.from('subscriptions').upsert({
    user_id:                userId,
    stripe_customer_id:     session.customer as string,
    stripe_subscription_id: subscription.id,
    plan,
    status,
    current_period_end: periodEnd,
  })

  console.log('[webhook] Assinatura ativada:', { userId, plan, status })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const admin = createAdminClient()

  // Deriva user_id pelo stripe_customer_id (o metadata da subscription
  // também tem user_id, mas usar customer_id é mais robusto)
  const { data: record, error } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single()

  if (error || !record) {
    console.error('[webhook] subscription.updated: customer não encontrado:', {
      customerId: subscription.customer,
    })
    return
  }

  const priceId  = subscription.items.data[0]?.price.id ?? null
  const plan     = getPlanFromPriceId(priceId)
  const status   = mapStripeStatus(subscription.status)
  // current_period_end foi movido em API versions mais novas — cast necessário
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const periodEnd = new Date(((subscription as any).current_period_end as number) * 1000).toISOString()

  await admin.from('subscriptions').update({
    stripe_subscription_id: subscription.id,
    plan,
    status,
    current_period_end: periodEnd,
  }).eq('user_id', record.user_id)

  console.log('[webhook] Assinatura atualizada:', { userId: record.user_id, plan, status })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const admin = createAdminClient()

  const { data: record, error } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single()

  if (error || !record) {
    console.error('[webhook] subscription.deleted: customer não encontrado:', {
      customerId: subscription.customer,
    })
    return
  }

  // Downgrade para free — mantém stripe_customer_id para histórico
  await admin.from('subscriptions').update({
    plan:                   'free',
    status:                 'canceled',
    stripe_subscription_id: null,
    current_period_end:     null,
  }).eq('user_id', record.user_id)

  console.log('[webhook] Assinatura cancelada → downgrade para free:', {
    userId: record.user_id,
  })
}
