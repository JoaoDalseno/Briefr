'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { CreditCard, User, Zap, ExternalLink, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

// ─── Plan badge ───────────────────────────────────────────────────────────────

const PLAN_DETAILS: Record<string, { label: string; desc: string; color: string }> = {
  free:    { label: 'Free',    desc: '3 briefs por mês',          color: 'text-muted-foreground bg-muted border-border' },
  pro:     { label: 'Pro',     desc: 'Briefs ilimitados + PDF',   color: 'text-primary bg-primary/8 border-primary/20' },
  agencia: { label: 'Agência', desc: 'Ilimitado + multi-usuário', color: 'text-accent bg-accent/8 border-accent/20' },
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [plan,      setPlan]      = React.useState<string>('free')
  const [email,     setEmail]     = React.useState<string>('')
  const [name,      setName]      = React.useState<string>('')
  const [loading,   setLoading]   = React.useState(true)
  const [upgrading, setUpgrading] = React.useState<string | null>(null)
  const [portalLoading, setPortalLoading] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email ?? '')
      setName((user.user_metadata?.full_name as string) ?? '')

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single()

      setPlan(sub?.plan ?? 'free')
      setLoading(false)
    }
    load()
  }, [])

  // Show upgrade success toast when redirected from Stripe
  React.useEffect(() => {
    if (searchParams.get('upgrade') === '1') {
      toast.success('Plano atualizado com sucesso!')
    }
    if (searchParams.get('checkout') === 'success') {
      toast.success('Assinatura ativada! Seja bem-vindo ao plano Pro.')
    }
  }, [searchParams])

  async function handleUpgrade(targetPlan: 'pro' | 'agencia') {
    setUpgrading(targetPlan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Erro ao iniciar checkout.'); return }
      window.location.href = data.url
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setUpgrading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Erro ao abrir portal.'); return }
      window.location.href = data.url
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  // eslint-disable-next-line security/detect-object-injection
  const planInfo = PLAN_DETAILS[plan] ?? PLAN_DETAILS.free
  const isFree = plan === 'free'

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie sua conta e assinatura.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Conta */}
        <Section title="Conta">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="size-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {name && <p className="font-semibold text-foreground text-sm">{name}</p>}
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{email}</p>
              <span className={cn('mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', planInfo.color)}>
                Plano {planInfo.label}
              </span>
            </div>
          </div>
        </Section>

        {/* Plano atual */}
        <Section title="Plano e cobrança">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                <Zap className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Plano {planInfo.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{planInfo.desc}</p>
              </div>
            </div>
            {!isFree && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePortal}
                disabled={portalLoading}
                className="shrink-0"
              >
                <ExternalLink className="size-3.5" />
                {portalLoading ? 'Abrindo...' : 'Gerenciar assinatura'}
              </Button>
            )}
          </div>

          {isFree && (
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {/* Pro */}
              <div className="rounded-xl border border-primary/20 bg-primary/4 p-4 flex flex-col gap-3">
                <div>
                  <p className="font-bold text-sm text-primary">Pro — R$97/mês</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>✓ Briefs ilimitados</li>
                    <li>✓ Exportação PDF</li>
                    <li>✓ Links compartilháveis</li>
                    <li>✓ Suporte prioritário</li>
                  </ul>
                </div>
                <Button
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => handleUpgrade('pro')}
                  disabled={upgrading !== null}
                >
                  {upgrading === 'pro' ? 'Aguarde...' : 'Assinar Pro'}
                  <ChevronRight className="size-3" />
                </Button>
              </div>

              {/* Agência */}
              <div className="rounded-xl border border-accent/20 bg-accent/4 p-4 flex flex-col gap-3">
                <div>
                  <p className="font-bold text-sm text-accent">Agência — R$197/mês</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>✓ Tudo do Pro</li>
                    <li>✓ Multi-usuário (em breve)</li>
                    <li>✓ White-label (em breve)</li>
                    <li>✓ API de integração</li>
                  </ul>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-between border-accent/30 text-accent hover:bg-accent/8"
                  onClick={() => handleUpgrade('agencia')}
                  disabled={upgrading !== null}
                >
                  {upgrading === 'agencia' ? 'Aguarde...' : 'Assinar Agência'}
                  <ChevronRight className="size-3" />
                </Button>
              </div>
            </div>
          )}
        </Section>

        {/* Faturamento */}
        {!isFree && (
          <Section title="Faturamento">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Acesse o portal de cobrança para gerenciar cartões, faturas e cancelamentos.</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handlePortal}
              disabled={portalLoading}
            >
              <ExternalLink className="size-4" />
              {portalLoading ? 'Abrindo...' : 'Abrir portal de faturamento'}
            </Button>
          </Section>
        )}
      </div>
    </div>
  )
}
