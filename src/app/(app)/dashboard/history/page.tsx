import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FileText, ArrowRight, Plus } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Histórico de briefs' }

const FORMAT_LABELS: Record<string, string> = {
  estatico: 'Estático',
  story: 'Story',
  ugc: 'Vídeo UGC',
}

interface BriefRow {
  id: string
  created_at: string
  form_data: { product_name?: string }
  formats: string[]
}

export default async function HistoryPage() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, created_at, form_data, formats')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (briefs ?? []) as BriefRow[]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Histórico de briefs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length === 0 ? 'Nenhum brief gerado ainda.' : `${rows.length} brief${rows.length !== 1 ? 's' : ''} gerado${rows.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <Link href="/dashboard/new-brief" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          Novo brief
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-20 px-8 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/8">
            <FileText className="size-8 text-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-foreground">Nenhum brief ainda</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Crie seu primeiro brief e ele aparecerá aqui.
          </p>
          <Link href="/dashboard/new-brief" className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}>
            Criar primeiro brief →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <ul role="list" className="divide-y divide-border">
            {rows.map(brief => {
              const name = brief.form_data?.product_name ?? 'Brief sem título'
              // eslint-disable-next-line security/detect-object-injection
              const formats = (brief.formats ?? []).map(f => FORMAT_LABELS[f] ?? f).join(', ')
              const age = formatDistanceToNow(new Date(brief.created_at), { addSuffix: true, locale: ptBR })
              return (
                <li key={brief.id}>
                  <Link
                    href={`/briefs/${brief.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formats} · {age}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
