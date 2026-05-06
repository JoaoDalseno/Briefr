import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { PLAN_DETAILS } from '@/lib/stripe/plans'

// Protege a rota de métricas com a mesma whitelist do layout admin
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET() {
  // ── Auth + whitelist ──────────────────────────────────────────────────────
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !getAdminEmails().includes(user.email?.toLowerCase() ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()
  const now   = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfWeek  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // ── Queries paralelas ──────────────────────────────────────────────────────
  const [
    { count: totalUsers },
    { count: newUsersThisMonth },
    { data: planCounts },
    { count: totalBriefs },
    { count: briefsToday },
    { count: briefsThisWeek },
    { count: briefsThisMonth },
    { data: recentBriefs },
  ] = await Promise.all([
    // Total de usuários
    admin.from('profiles').select('id', { count: 'exact', head: true }),

    // Novos usuários este mês
    admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),

    // Distribuição de planos (para calcular MRR)
    admin
      .from('subscriptions')
      .select('plan')
      .in('status', ['active', 'trialing']),

    // Total de briefs já gerados
    admin.from('briefs').select('id', { count: 'exact', head: true }),

    // Briefs hoje
    admin
      .from('briefs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday),

    // Briefs esta semana
    admin
      .from('briefs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfWeek),

    // Briefs este mês
    admin
      .from('briefs')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),

    // Últimos 20 briefs — APENAS metadados, NUNCA form_data ou generated_content
    admin
      .from('briefs')
      .select('id, user_id, formats, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  // ── MRR ───────────────────────────────────────────────────────────────────
  const planCountMap: Record<string, number> = { free: 0, pro: 0, agencia: 0 }
  for (const row of planCounts ?? []) {
    planCountMap[row.plan] = (planCountMap[row.plan] ?? 0) + 1
  }

  const mrrBrl =
    planCountMap.pro     * PLAN_DETAILS.pro.priceMonthlyBrl +
    planCountMap.agencia * PLAN_DETAILS.agencia.priceMonthlyBrl

  return NextResponse.json({
    users: {
      total:          totalUsers ?? 0,
      newThisMonth:   newUsersThisMonth ?? 0,
    },
    mrr: {
      brl:       mrrBrl,
      breakdown: {
        free:    { count: planCountMap.free,    priceMonthly: 0 },
        pro:     { count: planCountMap.pro,     priceMonthly: PLAN_DETAILS.pro.priceMonthlyBrl },
        agencia: { count: planCountMap.agencia, priceMonthly: PLAN_DETAILS.agencia.priceMonthlyBrl },
      },
    },
    briefs: {
      total:     totalBriefs ?? 0,
      today:     briefsToday ?? 0,
      thisWeek:  briefsThisWeek ?? 0,
      thisMonth: briefsThisMonth ?? 0,
    },
    // Metadados apenas — sem conteúdo dos clientes
    recentBriefs: recentBriefs ?? [],
  })
}
