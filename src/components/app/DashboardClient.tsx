'use client'

import * as React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileText,
  ArrowRight,
  Zap,
  TrendingUp,
  Calendar,
  BarChart2,
  Image,
  PlaySquare,
  LayoutGrid,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { OnboardingDialog, useOnboarding } from '@/components/app/OnboardingDialog'
import { cn } from '@/lib/utils'

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

interface DashboardClientProps {
  userName?: string
  plan: string
  monthlyCount: number
  monthlyLimit: number
  periodEnd: string | null
  recentBriefs: BriefRow[]
  onboardingDone: boolean
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  progress,
}: {
  label: string
  value: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  sub?: React.ReactNode
  progress?: { value: number; max: number }
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="flex items-center justify-center size-8 rounded-lg bg-primary/8 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="font-serif font-normal text-4xl text-foreground tracking-[-0.02em]">{value}</div>
      {progress && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              {progress.value} / {progress.max === Infinity ? '∞' : progress.max}
            </span>
            {progress.max !== Infinity && (
              <span className="text-xs text-muted-foreground">
                {Math.round((progress.value / progress.max) * 100)}%
              </span>
            )}
          </div>
          {progress.max !== Infinity && (
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  progress.value / progress.max >= 1 ? 'bg-destructive' : 'bg-primary'
                )}
                style={{ width: `${Math.min((progress.value / progress.max) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

// ─── Quick action card ────────────────────────────────────────────────────────

function QuickActionCard({
  href,
  icon: Icon,
  title,
  desc,
  gradient,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  gradient: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-6',
        'hover:border-primary/30 hover:shadow-card transition-all duration-200 overflow-hidden'
      )}
    >
      {/* Gradient wash */}
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity', gradient)} />

      <div className="relative flex items-center justify-between">
        <span className="flex items-center justify-center size-10 rounded-xl bg-primary/8 text-primary group-hover:bg-primary/15 transition-colors">
          <Icon className="size-5" />
        </span>
        <ArrowRight className="size-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>

      <div className="relative">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

// ─── Brief preview card ───────────────────────────────────────────────────────

function BriefCard({ brief }: { brief: BriefRow }) {
  const name = brief.form_data?.productName ?? 'Brief sem título'
  const formats = brief.formats ?? []
  const age = formatDistanceToNow(new Date(brief.created_at), { addSuffix: true, locale: ptBR })

  return (
    <Link
      href={`/briefs/${brief.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 hover:border-primary/30 hover:shadow-card transition-all"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formats.join(', ')} · {age}
        </p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-16 px-8 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/8">
        <Zap className="size-8 text-primary" />
      </div>
      <h3 className="font-serif font-normal text-2xl text-foreground tracking-[-0.02em]">Crie seu primeiro brief</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
        Preencha o formulário com os dados do seu produto e a IA gera um brief completo em menos de 30 segundos.
      </p>
      <Link
        href="/dashboard/new-brief"
        className={cn(buttonVariants({ size: 'lg' }), 'mt-6')}
      >
        Criar meu primeiro brief em 2 minutos →
      </Link>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardClient({
  userName,
  plan,
  monthlyCount,
  monthlyLimit,
  periodEnd,
  recentBriefs,
  onboardingDone,
}: DashboardClientProps) {
  const { show: showOnboarding, dismiss: dismissOnboarding } = useOnboarding(onboardingDone)

  const firstName = userName?.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const daysLeft = periodEnd
    ? Math.max(0, Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <>
      {/* Onboarding */}
      {showOnboarding && <OnboardingDialog onDone={dismissOnboarding} />}

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif font-normal text-3xl text-foreground tracking-[-0.02em]">
          {greeting}{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          Aqui está um resumo da sua atividade no Briefr.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <section aria-label="Métricas">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Briefs este mês"
            value={monthlyCount}
            icon={FileText}
            progress={{ value: monthlyCount, max: monthlyLimit }}
          />
          <StatCard
            label="Tempo médio"
            value="~22s"
            icon={TrendingUp}
            sub="por geração"
          />
          <StatCard
            label="Plataforma top"
            value="Meta Ads"
            icon={BarChart2}
            sub="formato mais gerado"
          />
          <StatCard
            label="Plano atual"
            value={plan.charAt(0).toUpperCase() + plan.slice(1)}
            icon={Calendar}
            sub={daysLeft !== null ? `${daysLeft} dias restantes` : 'Renovação mensal'}
          />
        </div>
      </section>

      {/* ── Quick actions ── */}
      <section aria-label="Ações rápidas" className="mb-8">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Ações rápidas
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <QuickActionCard
            href="/dashboard/new-brief?format=estatico"
            icon={Image}
            title="Novo brief estático"
            desc="Banner, feed ou card para redes sociais"
            gradient="bg-gradient-to-br from-primary/5 to-transparent"
          />
          <QuickActionCard
            href="/dashboard/new-brief?format=ugc"
            icon={PlaySquare}
            title="Novo brief vídeo UGC"
            desc="Roteiro para criador de conteúdo"
            gradient="bg-gradient-to-br from-accent/5 to-transparent"
          />
          <QuickActionCard
            href="/dashboard/new-brief?format=story"
            icon={LayoutGrid}
            title="Novo brief story"
            desc="Story vertical 9:16 para redes sociais"
            gradient="bg-gradient-to-br from-emerald-500/5 to-transparent"
          />
        </div>
      </section>

      {/* ── Recent briefs ── */}
      <section aria-label="Briefs recentes">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Continuar de onde parou
          </h2>
          {recentBriefs.length > 0 && (
            <Link
              href="/dashboard/history"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {recentBriefs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-3">
            {recentBriefs.map(b => (
              <BriefCard key={b.id} brief={b} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// ─── Skeleton for Suspense fallback ──────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
