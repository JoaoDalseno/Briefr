import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/app/DashboardClient'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefRow {
  id: string
  created_at: string
  form_data: {
    productName?: string
    formats?: string[]
    objective?: string
  }
  formats: string[]
}

// ─── Server Component — fetches all data ─────────────────────────────────────

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  const userId = user.id
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Parallel data fetches
  const [subscriptionRes, monthlyCountRes, recentBriefsRes] = await Promise.all([
    supabase.from('subscriptions').select('plan, current_period_end').eq('user_id', userId).single(),
    supabase.from('briefs').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', startOfMonth),
    supabase.from('briefs').select('id, created_at, form_data, formats').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
  ])

  const plan = subscriptionRes.data?.plan ?? 'free'
  const periodEnd = subscriptionRes.data?.current_period_end ?? null
  const monthlyCount = monthlyCountRes.count ?? 0
  const recentBriefs = (recentBriefsRes.data ?? []) as BriefRow[]

  const onboardingDone = !!(user.user_metadata?.onboarding_complete as boolean | undefined)

  const PLAN_LIMITS: Record<string, number> = { free: 3, pro: Infinity, agencia: Infinity }
  // eslint-disable-next-line security/detect-object-injection
  const monthlyLimit = PLAN_LIMITS[plan] ?? 3

  return (
    <DashboardClient
      userName={user.user_metadata?.full_name as string | undefined}
      plan={plan}
      monthlyCount={monthlyCount}
      monthlyLimit={monthlyLimit}
      periodEnd={periodEnd}
      recentBriefs={recentBriefs}
      onboardingDone={onboardingDone}
    />
  )
}
