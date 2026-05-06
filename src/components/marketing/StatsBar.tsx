'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

const STATS = [
  {
    number: '10×',
    label: 'mais rápido',
    description: 'De 30 min para 3 min por brief',
  },
  {
    number: '+340%',
    label: 'de CTR',
    description: 'Aumento médio com briefs estruturados',
  },
  {
    number: '100%',
    label: 'em português',
    description: 'Contexto e linguagem do mercado BR',
  },
]

export default function StatsBar() {
  return (
    <div className="border-y border-border bg-slate-50/60">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {STATS.map(({ number, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center gap-1 py-8 px-6 text-center"
            >
              <span className="text-gradient-brand font-heading font-bold tracking-heading text-4xl sm:text-5xl">
                {number}
              </span>
              <span className="font-semibold text-sm text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  )
}
