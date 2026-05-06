'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Logo } from '@/components/branding/Logo'
import { cn } from '@/lib/utils'

// ─── Dados ───────────────────────────────────────────────────────────────────

type CellValue = true | false | 'partial' | string

const ROWS: { feature: string; briefr: CellValue; chatgpt: CellValue; manual: CellValue }[] = [
  {
    feature:  'Tempo de criação',
    briefr:   '< 3 minutos',
    chatgpt:  '15–30 min',
    manual:   '30–60 min',
  },
  {
    feature:  'Qualidade do brief',
    briefr:   true,
    chatgpt:  'partial',
    manual:   'partial',
  },
  {
    feature:  'Contexto brasileiro',
    briefr:   true,
    chatgpt:  false,
    manual:   true,
  },
  {
    feature:  'Formato específico (story, UGC…)',
    briefr:   true,
    chatgpt:  false,
    manual:   'partial',
  },
  {
    feature:  'Histórico de briefs',
    briefr:   true,
    chatgpt:  false,
    manual:   false,
  },
  {
    feature:  'Exportação PDF formatado',
    briefr:   true,
    chatgpt:  false,
    manual:   false,
  },
  {
    feature:  'Métricas estimadas',
    briefr:   true,
    chatgpt:  false,
    manual:   false,
  },
]

// ─── Cell component ───────────────────────────────────────────────────────────

function Cell({ value, isBriefr = false }: { value: CellValue; isBriefr?: boolean }) {
  if (value === true) {
    return (
      <td className={cn('px-4 py-4 text-center', isBriefr && 'bg-primary/5')}>
        <CheckCircle2 className="size-5 text-primary mx-auto" />
      </td>
    )
  }
  if (value === false) {
    return (
      <td className="px-4 py-4 text-center">
        <XCircle className="size-5 text-muted-foreground/40 mx-auto" />
      </td>
    )
  }
  if (value === 'partial') {
    return (
      <td className="px-4 py-4 text-center">
        <MinusCircle className="size-5 text-amber-400 mx-auto" />
      </td>
    )
  }
  // String value
  return (
    <td className={cn('px-4 py-4 text-center', isBriefr && 'bg-primary/5')}>
      <span
        className={cn(
          'text-sm font-semibold',
          isBriefr ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {value}
      </span>
    </td>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Comparison() {
  return (
    <section className="py-24 bg-slate-50/60">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Por que Briefr"
            title="Menos improviso, mais resultado"
            subtitle="Compare o Briefr com as alternativas mais usadas no mercado."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-x-auto rounded-xl border border-border shadow-card bg-white"
        >
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left font-semibold text-foreground/60 text-xs uppercase tracking-wider w-2/5">
                  Recurso
                </th>
                {/* Briefr — highlighted */}
                <th className="px-4 py-4 text-center bg-primary/5 border-x border-primary/15">
                  <div className="flex flex-col items-center gap-1">
                    <Logo size="xs" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      Briefr
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">🤖</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      ChatGPT
                    </span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">✍️</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Manual
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ feature, briefr, chatgpt, manual }, i) => (
                <tr
                  key={feature}
                  className={cn(
                    'border-b border-border last:border-0',
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
                  )}
                >
                  <td className="px-4 py-4 font-medium text-foreground text-sm">{feature}</td>
                  <Cell value={briefr} isBriefr />
                  <Cell value={chatgpt} />
                  <Cell value={manual} />
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-border bg-slate-50/40 rounded-b-xl">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-primary" /> Sim
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MinusCircle className="size-3.5 text-amber-400" /> Parcial
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <XCircle className="size-3.5 text-muted-foreground/40" /> Não
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
