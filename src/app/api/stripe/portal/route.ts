import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  // ── 1. Auth ──────────────────────────────────────────────────────────────
  const supabase = createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return errorResponse('Não autorizado.', 401)
  }

  // ── 2. Busca o stripe_customer_id ─────────────────────────────────────────
  const admin = createAdminClient()
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('stripe_customer_id, plan')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    return errorResponse(
      'Nenhuma assinatura paga encontrada. Faça upgrade primeiro.',
      404,
    )
  }

  // ── 3. Cria a sessão do Customer Portal ───────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const portalSession = await stripe.billingPortal.sessions.create({
    customer:   subscription.stripe_customer_id,
    return_url: `${appUrl}/dashboard`,
  })

  console.log('[portal] sessão criada:', { userId: user.id, plan: subscription.plan })

  return NextResponse.json({ url: portalSession.url })
}
