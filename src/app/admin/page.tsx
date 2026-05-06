import { createAdminClient } from '@/lib/supabase/server'
import { PLAN_DETAILS } from '@/lib/stripe/plans'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Briefr' }
export const revalidate = 60 // Revalida a cada 60s

async function getMetrics() {
  const admin = createAdminClient()
  const now   = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const [
    { count: totalUsers },
    { count: newThisMonth },
    { data: planCounts },
    { count: totalBriefs },
    { count: briefsToday },
    { count: briefsThisMonth },
    { data: recentBriefs },
    { data: costData },
  ] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }),
    admin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    admin.from('subscriptions').select('plan').in('status', ['active', 'trialing']),
    admin.from('briefs').select('id', { count: 'exact', head: true }),
    admin.from('briefs').select('id', { count: 'exact', head: true }).gte('created_at', startOfToday),
    admin.from('briefs').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    // Últimos 10 briefs — apenas metadados, ZERO conteúdo de clientes
    admin.from('briefs').select('id, user_id, formats, created_at').order('created_at', { ascending: false }).limit(10),
    // Custo total do mês
    admin.from('usage_log').select('cost_brl').gte('created_at', startOfMonth).eq('success', true),
  ])

  const planMap: Record<string, number> = { free: 0, pro: 0, agencia: 0 }
  for (const r of planCounts ?? []) planMap[r.plan] = (planMap[r.plan] ?? 0) + 1

  const mrrBrl =
    planMap.pro     * PLAN_DETAILS.pro.priceMonthlyBrl +
    planMap.agencia * PLAN_DETAILS.agencia.priceMonthlyBrl

  const monthCostBrl = (costData ?? []).reduce((sum, r) => sum + (r.cost_brl ?? 0), 0)

  return { totalUsers, newThisMonth, planMap, mrrBrl, totalBriefs, briefsToday, briefsThisMonth, recentBriefs, monthCostBrl }
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default async function AdminPage() {
  const m = await getMetrics()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Dados internos — não compartilhe esta tela.
        </p>
      </div>

      {/* MRR + Usuários */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Negócio</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="MRR"
            value={`R$${m.mrrBrl.toLocaleString('pt-BR')}`}
            sub={`Pro: ${m.planMap.pro} · Agência: ${m.planMap.agencia}`}
          />
          <StatCard
            label="Usuários totais"
            value={m.totalUsers ?? 0}
            sub={`+${m.newThisMonth ?? 0} este mês`}
          />
          <StatCard
            label="Plano Free"
            value={m.planMap.free}
            sub="Potencial de conversão"
          />
          <StatCard
            label="Custo IA (mês)"
            value={`R$${(m.monthCostBrl ?? 0).toFixed(2)}`}
            sub="Anthropic Claude"
          />
        </div>
      </section>

      {/* Briefs */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Geração de briefs</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Hoje" value={m.briefsToday ?? 0} />
          <StatCard label="Este mês" value={m.briefsThisMonth ?? 0} />
          <StatCard label="Total histórico" value={m.totalBriefs ?? 0} />
        </div>
      </section>

      {/* Últimos briefs — sem conteúdo */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Últimas gerações (metadados apenas)
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Formatos</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(m.recentBriefs ?? []).map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.user_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(b.formats as string[]).map((f: string) => (
                        <span key={f} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(b.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Conteúdo dos briefs e dados do formulário não são exibidos aqui por privacidade dos clientes.
        </p>
      </section>
    </div>
  )
}
