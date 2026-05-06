'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    eyebrow: 'Para experimentar',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: null,
    highlight: false,
    features: [
      '3 briefs por mês',
      'Formatos básicos (estático e story)',
      'Exportação em texto',
      'Histórico de 30 dias',
    ],
    cta: 'Começar grátis',
    href: '/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    eyebrow: 'Para gestores autônomos',
    priceMonthly: 97,
    priceAnnual: 80,
    badge: 'Mais popular',
    highlight: true,
    features: [
      'Briefs ilimitados',
      'Todos os formatos (vídeo, carrossel)',
      'Exportação PDF premium',
      'Histórico completo',
      'Templates por nicho',
      'Suporte por chat',
    ],
    cta: 'Assinar Pro',
    href: '/signup?plan=pro',
  },
  {
    id: 'agencia',
    name: 'Agência',
    eyebrow: 'Para agências e times',
    priceMonthly: 197,
    priceAnnual: 164,
    badge: null,
    highlight: false,
    features: [
      'Tudo do Pro',
      'Até 5 usuários',
      'Workspace compartilhado',
      'White-label nos PDFs',
      'Relatórios de uso do time',
      'Suporte prioritário',
    ],
    cta: 'Assinar Agência',
    href: '/signup?plan=agencia',
  },
]

const TRUST_BADGES = [
  'Sem cartão necessário',
  'Cancele quando quiser',
  'Suporte em português',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [annual, setAnnual] = React.useState(false)

  return (
    <section id="pricing" className="py-24">
      <Container>
        <SectionHeader
          eyebrow="Planos"
          title="Conheça nossos planos"
          subtitle="Comece grátis, evolua quando precisar."
          gradient
        />

        {/* Toggle mensal / anual */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <span className={cn('text-sm font-medium', !annual ? 'text-foreground' : 'text-muted-foreground')}>
            Mensal
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual(v => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              annual ? 'bg-primary' : 'bg-muted-foreground/30'
            )}
          >
            <span
              className={cn(
                'inline-block size-4 rounded-full bg-white shadow transition-transform duration-200',
                annual ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn('text-sm font-medium flex items-center gap-2', annual ? 'text-foreground' : 'text-muted-foreground')}>
            Anual
            <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              -17%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3 items-start">
          {PLANS.map(plan => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly
            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-8 transition-shadow duration-300',
                  plan.highlight
                    ? 'border-primary/50 bg-primary/5 shadow-glow'
                    : 'border-border bg-white shadow-card'
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                    {plan.badge}
                  </span>
                )}

                {/* Header */}
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    {plan.eyebrow}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{plan.name}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      {price === 0 ? 'Grátis' : `R$\u00a0${price}`}
                    </span>
                    {price > 0 && (
                      <span className="mb-1 text-sm text-muted-foreground">/mês</span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cobrado anualmente · R$&nbsp;{price * 12}/ano
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 flex flex-col gap-3 flex-1">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check
                        className={cn(
                          'mt-0.5 size-4 shrink-0',
                          plan.highlight ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: plan.highlight ? 'default' : 'outline',
                      size: 'default',
                    }),
                    'w-full justify-center',
                    plan.highlight && 'shadow-glow-sm'
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map((badge, i) => (
            <React.Fragment key={badge}>
              <span className="text-sm text-muted-foreground">{badge}</span>
              {i < TRUST_BADGES.length - 1 && (
                <span className="text-muted-foreground/40 hidden sm:inline">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  )
}
