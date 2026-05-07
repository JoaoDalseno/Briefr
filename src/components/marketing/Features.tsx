'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Smartphone, LayoutGrid, Video, Film, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Dados ───────────────────────────────────────────────────────────────────

const FORMATS = [
  {
    id: 'estatico',
    label: 'Estático 1:1',
    icon: Image,
    badge: 'Mais popular',
    description: 'Anúncio estático para feed do Meta e Google',
    preview: {
      type: 'Estático 1:1 · Meta Ads / Google Display',
      fields: [
        {
          label: 'Headline',
          value: '"Ganhe 5kg de músculo em 30 dias"',
          highlight: false,
        },
        {
          label: 'Copy',
          value: 'Whey isolado com absorção 3× mais rápida. +12.000 clientes no Brasil. Frete grátis hoje.',
          highlight: false,
        },
        {
          label: 'CTA',
          value: 'Comprar com 40% OFF →',
          highlight: true,
        },
        {
          label: 'Sugestão visual',
          value: 'Split-screen antes/depois em luz natural. Contraste alto. Expressão de confiança.',
          highlight: false,
        },
      ],
      metric: 'CTR estimado: 2.8–4.2% · CPC médio BR: R$ 0,85',
    },
  },
  {
    id: 'story',
    label: 'Story 9:16',
    icon: Smartphone,
    description: 'Para Stories do Instagram e TikTok',
    preview: {
      type: 'Story 9:16 · Instagram / TikTok',
      fields: [
        {
          label: 'Hook (0–3s)',
          value: '"Ei, você ainda tá ignorando isso no treino?" (olhando direto pra câmera)',
          highlight: false,
        },
        {
          label: 'Meio',
          value: 'Apresente o problema → produto como solução → prova social rápida ("12k pessoas já transformaram…")',
          highlight: false,
        },
        {
          label: 'CTA',
          value: 'Arrasta pra cima e pega o desconto de hoje',
          highlight: true,
        },
        {
          label: 'Duração sugerida',
          value: '15–30 segundos',
          highlight: false,
        },
      ],
      metric: 'Swipe-up rate estimado: 4.5–7%',
    },
  },
  {
    id: 'carrossel',
    label: 'Carrossel',
    icon: LayoutGrid,
    description: 'Sequência de 3–7 slides para engajamento',
    preview: {
      type: 'Carrossel · Meta Ads / Orgânico',
      fields: [
        {
          label: 'Slide 1 — Hook',
          value: '"5 erros que estão sabotando seu resultado" — imagem de impacto, texto curto',
          highlight: false,
        },
        {
          label: 'Slides 2–4 — Conteúdo',
          value: 'Um erro por slide. Visual simples, solução prática no rodapé de cada frame.',
          highlight: false,
        },
        {
          label: 'Último slide — CTA',
          value: '"Comece hoje com o método que funciona →" + link no bio / swipe',
          highlight: true,
        },
        {
          label: 'Sugestão visual',
          value: 'Paleta de cor consistente entre slides. Tipografia bold. Fundo sólido.',
          highlight: false,
        },
      ],
      metric: 'Retenção estimada: 62% até o último slide',
    },
  },
  {
    id: 'ugc',
    label: 'Vídeo UGC 15s',
    icon: Video,
    description: 'Script para creator gravar de forma autêntica',
    preview: {
      type: 'UGC 15s · TikTok / Reels / Meta',
      fields: [
        {
          label: 'Script do hook (0–5s)',
          value: '"Cara, eu não acreditava nisso até experimentar…" (tom casual, câmera na mão)',
          highlight: false,
        },
        {
          label: 'Talking points',
          value: '① Dor antes do produto  ② Como o produto resolveu  ③ Prova (número ou reação)',
          highlight: false,
        },
        {
          label: 'CTA final',
          value: '"Link na bio pra pegar o desconto de hoje, acaba em breve"',
          highlight: true,
        },
        {
          label: 'Orientações de tom',
          value: 'Natural, sem cortes rápidos. Fundo doméstico real. Sem trilha muito alta.',
          highlight: false,
        },
      ],
      metric: 'Hook rate estimado: 68%+ (acima da média do nicho)',
    },
  },
  {
    id: 'video30',
    label: 'Vídeo 30s',
    icon: Film,
    description: 'Roteiro estruturado para produção profissional',
    preview: {
      type: 'Vídeo 30s · YouTube / Meta / TV',
      fields: [
        {
          label: 'Hook (0–5s)',
          value: 'Visual de impacto + pergunta ou afirmação ousada em lettering',
          highlight: false,
        },
        {
          label: 'Desenvolvimento (5–20s)',
          value: 'Problema → agitação → solução → demonstração rápida em 15 segundos',
          highlight: false,
        },
        {
          label: 'CTA (20–30s)',
          value: '"Acesse o link abaixo e garanta o seu com frete grátis hoje"',
          highlight: true,
        },
        {
          label: 'Referência de ritmo',
          value: 'Cortes a cada 2–3s. BG music animado. Locução + texto na tela.',
          highlight: false,
        },
      ],
      metric: 'View-through rate estimado: 35–50%',
    },
  },
]

// ─── Preview Card ─────────────────────────────────────────────────────────────

function BriefPreview({ format }: { format: typeof FORMATS[0] }) {
  return (
    <motion.div
      key={format.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="rounded-xl border border-border bg-card shadow-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <format.icon className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Brief gerado
          </p>
          <p className="text-sm font-semibold text-foreground">{format.preview.type}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {format.preview.fields.map(({ label, value, highlight }) => (
          <div key={label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              {label}
            </p>
            {highlight ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 border border-accent/20 px-3 py-1.5 text-sm font-semibold text-accent">
                {value}
              </span>
            ) : (
              <p className="text-sm text-foreground/80 leading-relaxed">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Metric footer */}
      <div className="pt-4 border-t border-border flex items-center gap-2">
        <CheckCircle2 className="size-3.5 text-primary shrink-0" />
        <span className="text-xs text-muted-foreground">{format.preview.metric}</span>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Features() {
  const [activeId, setActiveId] = useState(FORMATS[0].id)
  const active = FORMATS.find((f) => f.id === activeId)!

  return (
    <section id="features" className="py-24">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeader
            eyebrow="Construído para gestores de tráfego"
            title="Brief estratégico em todos os formatos"
            subtitle="Cada formato vira um brief específico com hook, copy, referência visual e métricas esperadas."
          />
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid lg:grid-cols-2 gap-8 items-start">
          {/* Format list */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2"
          >
            {FORMATS.map((format) => {
              const isActive = format.id === activeId
              return (
                <button
                  key={format.id}
                  onClick={() => setActiveId(format.id)}
                  className={cn(
                    'w-full flex items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200',
                    isActive
                      ? 'border-primary/40 bg-primary/5 shadow-glow-xs'
                      : 'border-border bg-white hover:border-primary/20 hover:bg-primary/3',
                  )}
                >
                  {/* Active indicator */}
                  <span
                    className={cn(
                      'w-1 self-stretch rounded-full transition-all duration-200',
                      isActive ? 'bg-primary' : 'bg-transparent',
                    )}
                  />

                  <div
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isActive ? 'bg-primary/15' : 'bg-surface',
                    )}
                  >
                    <format.icon
                      className={cn('size-4 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-semibold transition-colors',
                          isActive ? 'text-primary' : 'text-foreground',
                        )}
                      >
                        {format.label}
                      </span>
                      {'badge' in format && format.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 rounded-full px-1.5 py-0.5">
                          {format.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {format.description}
                    </p>
                  </div>

                  <ChevronRight
                    className={cn(
                      'size-4 shrink-0 transition-all duration-200',
                      isActive ? 'text-primary rotate-90 lg:rotate-0' : 'text-muted-foreground/40',
                    )}
                  />
                </button>
              )
            })}

            <div className="pt-2">
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
              >
                Ver todos os formatos <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <BriefPreview key={activeId} format={active} />
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
