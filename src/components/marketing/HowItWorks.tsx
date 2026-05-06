'use client'

import { motion } from 'framer-motion'
import { FileText, Sparkles, Download } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Descreva seu produto',
    description: 'Preencha 8 campos em 2 minutos: produto, público-alvo, objetivo, diferencial, tom e formatos desejados.',
    detail: 'Sem briefing complexo · Formulário inteligente',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'A IA monta o brief',
    description: 'O Claude analisa o contexto brasileiro e gera um brief específico para cada formato — com hook, copy, CTA e referência visual.',
    detail: 'Contexto BR · Sem hallucination',
  },
  {
    number: '03',
    icon: Download,
    title: 'Exporte e mande pro designer',
    description: 'Baixe em PDF formatado ou compartilhe com link direto. O designer recebe tudo que precisa sem uma palavra a mais.',
    detail: 'PDF em 1 clique · Link compartilhável',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-slate-50/70">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Como funciona"
            title="Conecte uma vez."
            subtitle="Brief pronto pra sempre."
          />
        </motion.div>

        {/* Steps */}
        <div className="mt-16 relative">
          {/* Connector line — visible on desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-12 left-[calc(16.67%+0.5px)] right-[calc(16.67%+0.5px)] h-px"
            style={{
              background: 'linear-gradient(90deg, oklch(0.563 0.196 271.2 / 0.15), oklch(0.563 0.196 271.2 / 0.4), oklch(0.724 0.188 19.8 / 0.3), oklch(0.724 0.188 19.8 / 0.15))',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STEPS.map(({ number, icon: Icon, title, description, detail }, i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'group relative flex flex-col gap-5 rounded-xl border border-border bg-white p-7',
                  'shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300',
                )}
              >
                {/* Number + Icon */}
                <div className="flex items-center gap-4">
                  {/* Circle with number */}
                  <div className="relative flex-shrink-0">
                    <div className="size-12 rounded-full bg-white border-2 border-border group-hover:border-primary/40 transition-colors flex items-center justify-center z-10 relative">
                      <span className="text-gradient-brand font-heading font-bold text-lg leading-none">
                        {number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="p-2.5 rounded-xl bg-primary/8 group-hover:bg-primary/12 transition-colors">
                    <Icon className="size-5 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <h3 className="font-heading font-semibold text-lg tracking-heading text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Detail pill */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary/80">
                    <span className="size-1.5 rounded-full bg-primary/60" />
                    {detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
