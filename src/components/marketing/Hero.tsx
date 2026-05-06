'use client'

import Link from 'next/link'
import { Play, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { GradientText } from '@/components/ui/GradientText'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

// ─── Dashboard Mockup ──────────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden border border-border/60',
        'shadow-glow bg-white',
        'transform-gpu perspective-1000 rotate-y-[-2deg] rotate-x-[2deg]',
      )}
      style={{ perspective: '1200px', transform: 'rotateY(-3deg) rotateX(3deg) translateZ(0)' }}
    >
      {/* Browser chrome */}
      <div className="bg-secondary-900 h-9 flex items-center gap-3 px-4 shrink-0">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#FF5F57]/80" />
          <span className="size-3 rounded-full bg-[#FFBD2E]/80" />
          <span className="size-3 rounded-full bg-[#28CA41]/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-secondary-800 rounded h-5 w-44 flex items-center justify-center">
            <span className="text-[10px] text-secondary-400 font-mono">briefr.com.br/dashboard</span>
          </div>
        </div>
      </div>

      {/* App UI */}
      <div className="bg-slate-50 grid grid-cols-5 gap-3 p-3">
        {/* Sidebar form */}
        <div className="col-span-2 bg-white rounded-lg border border-border p-3 space-y-3 text-xs">
          <p className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground">
            Novo brief
          </p>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px]">Produto</p>
            <div className="bg-primary/5 border border-primary/25 rounded-md h-6 px-2 flex items-center text-foreground/80">
              Suplemento Alpha Pro
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px]">Público-alvo</p>
            <div className="bg-slate-50 border border-border rounded-md h-6 px-2 flex items-center text-muted-foreground">
              Homens 25–40 que treinam…
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px]">Tom</p>
            <div className="bg-slate-50 border border-border rounded-md h-6 px-2 flex items-center text-muted-foreground">
              Urgente e direto
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[10px]">Formatos</p>
            <div className="flex gap-1 flex-wrap">
              {['Estático', 'Story'].map((f) => (
                <span
                  key={f}
                  className="bg-primary/10 text-primary text-[9px] font-semibold rounded-full px-2 py-0.5 border border-primary/20"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-primary text-white text-[10px] font-semibold rounded-md h-6 flex items-center justify-center gap-1 cursor-pointer">
            Gerar brief <ArrowRight className="size-2.5" />
          </div>
        </div>

        {/* Brief output */}
        <div className="col-span-3 bg-white rounded-lg border border-border p-3 space-y-2.5 text-xs">
          {/* Format tabs */}
          <div className="flex gap-3 border-b border-border pb-2">
            <span className="text-primary font-semibold text-[10px] border-b-2 border-primary pb-0.5">
              Estático 1:1
            </span>
            <span className="text-muted-foreground text-[10px]">Story 9:16</span>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Headline
            </p>
            <p className="font-semibold text-foreground text-[11px] leading-snug">
              &quot;Ganhe 5kg de músculo em 30 dias&quot;
            </p>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Copy
            </p>
            <p className="text-[10px] text-foreground/70 leading-relaxed">
              Whey isolado com absorção 3× mais rápida. +12.000 clientes no Brasil. Frete grátis hoje.
            </p>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              CTA
            </p>
            <span className="inline-flex items-center bg-accent/10 text-accent text-[10px] font-semibold rounded px-2 py-0.5 border border-accent/20">
              Comprar com 40% OFF →
            </span>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Sugestão visual
            </p>
            <p className="text-[10px] text-foreground/70 leading-relaxed">
              Split-screen antes/depois, luz natural, paleta de contraste alto.
            </p>
          </div>

          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="text-[9px] text-muted-foreground">CTR estimado: 2.8–4.2%</span>
            <span className="text-[10px] font-medium text-primary cursor-pointer">
              Exportar PDF →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-20 -right-20 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Briefs de criativos com IA
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold tracking-heading text-balance text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] leading-[1.08]"
            >
              Briefs que convertem,{' '}
              <span className="block">
                em{' '}
                <GradientText gradient="brand">minutos.</GradientText>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg text-balance"
            >
              Descreva seu produto e a IA monta o brief completo — hook, copy, formato e referência visual — pronto pra passar pro designer.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'shadow-glow-sm hover:shadow-glow transition-shadow',
                )}
              >
                Começar grátis <ArrowRight className="size-4" />
              </Link>

              <button
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'gap-2',
                )}
              >
                <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 border border-primary/20">
                  <Play className="size-3 fill-primary text-primary ml-0.5" />
                </span>
                Ver demo de 2 min
              </button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.36 }}
              className="text-xs text-muted-foreground"
            >
              Sem cartão de crédito · Configuração em 2 minutos
            </motion.p>
          </div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glow behind mockup */}
            <div
              aria-hidden
              className="absolute inset-x-8 -bottom-6 h-20 bg-primary/30 blur-2xl rounded-full"
            />
            <DashboardMockup />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
